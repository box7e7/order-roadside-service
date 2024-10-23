'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { SessionData, ServiceMetadata } from '@/types';
import OrderConfirmationEmail from '@/components/OrderConfirmationEmail';

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [metadata, setMetadata] = useState<ServiceMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  console.log("sessionData", sessionData)

  useEffect(() => {
    const sessionId = searchParams?.get('session_id');
    if (sessionId) {
      fetch(`/api/stripe-session?session_id=${sessionId}`)
        .then(response => response.json())
        .then(data => {
          setSessionData(data.session);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load session data');
          console.error("Error from stripe-session:", err);
          setLoading(false);
        });
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    const metadataCookie = getCookie('service_metadata');
    if (metadataCookie) {
      try {
        const parsedMetadata = JSON.parse(metadataCookie as string) as ServiceMetadata;
        setMetadata(parsedMetadata);
      } catch (error) {
        console.error('Error parsing metadata cookie:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (metadata) {
      const emailData = {
        customerName: metadata.fullName,
        serviceType: metadata.service,
        vehicleMakeModel: `${metadata.carYear} ${metadata.carMake} ${metadata.carModel}`,
        serviceDate: new Date().toLocaleDateString(),
        pickupLocation: metadata.pickupAddress,
        destination: metadata.dropOffAddress,
        total: metadata.total,
        year: new Date().getFullYear().toString(),
        customerEmail: metadata.email
      };

      fetch('/api/send-order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Order confirmation email sent:', data);
        })
        .catch(error => console.error('Error sending order confirmation email:', error));

      const dispatchData = {
        towFrom: metadata.pickupAddress,
        towTo: metadata.dropOffAddress,
        vehicle: {
          make: metadata.carMake,
          model: metadata.carModel,
          year: parseInt(metadata.carYear)
        },
        name: metadata.fullName,
        phone: metadata.phoneNumber,
        email: metadata.email,
        PO: "0",
        serviceType: metadata.service.charAt(0).toUpperCase() + metadata.service.slice(1),
        notes: metadata.towQuestions?.specialNotes || ""
      };

      fetch('/api/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dispatchData),
      })
        .then(response => response.json())
        .then(data => {
          console.log('Job dispatched:', data);
          setDispatchStatus('Job successfully dispatched');
        })
        .catch(error => {
          console.error('Error dispatching job:', error);
          setDispatchStatus('Failed to dispatch job');
        });
    }
  }, [metadata]);

  if (loading) return <div className="container mx-auto p-4 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto p-4 text-center text-red-600">Error: {error}</div>;
  if (!metadata) return <div className="container mx-auto p-4 text-center">No data available</div>;

  return (
    <div className="container mx-auto p-4">
      {dispatchStatus && (
        <div className={`p-4 mb-4 text-center ${dispatchStatus.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {dispatchStatus}
        </div>
      )}
      <OrderConfirmationEmail
        customerName={metadata.fullName}
        serviceType={metadata.service}
        vehicleMakeModel={`${metadata.carYear} ${metadata.carMake} ${metadata.carModel}`}
        serviceDate={new Date().toLocaleDateString()}
        pickupLocation={metadata.pickupAddress}
        destination={metadata.dropOffAddress}
        total={Number(metadata.total)}
        year={new Date().getFullYear().toString()}
      />
    
    </div>
  );
}
