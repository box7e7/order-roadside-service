'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getCookie } from 'cookies-next';
import { SessionData, ServiceMetadata } from '@/types';

// function formatAddress(address: Address): string {
//   const { line1, line2, city, state, postal_code, country } = address;
//   const parts = [
//     line1,
//     line2,
//     city,
//     state,
//     postal_code,
//     country === 'US' ? 'USA' : country
//   ].filter(Boolean);
  
//   return parts.join(', ');
// }

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [metadata, setMetadata] = useState<ServiceMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);


  console.log("/////// sessionData ////////",sessionData);

  // Effect for fetching session data
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
          console.log("/////// err from stripe-session ////////",err);
          setLoading(false);
        });
    } else {
      setError('No session ID provided');
      setLoading(false);
    }
  }, [searchParams]);

  // Effect for parsing metadata cookie
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

  // Effect for sending order confirmation email and dispatching job
  useEffect(() => {
    if (metadata) {
      // Send order confirmation email
      const emailData = {
        customerName: metadata.fullName,
        serviceType: metadata.service,
        vehicleMakeModel: `${metadata.carYear} ${metadata.carMake} ${metadata.carModel}`,
        serviceDate: new Date().toLocaleDateString(),
        pickupLocation: metadata.pickupAddress,
        destination: metadata.dropOffAddress,
        estimatedArrivalTime: metadata.estimatedTime,
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

      // Dispatch job
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
        PO: "0", // You might want to generate a PO number or use an order ID
        serviceType: metadata.service.charAt(0).toUpperCase() + metadata.service.slice(1), // Capitalize first letter
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!metadata) return <div>No data available</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thank you for your order!</h1>
      {dispatchStatus && (
        <div className={`p-4 mb-4 ${dispatchStatus.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {dispatchStatus}
        </div>
      )}
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-2">Customer Information</h2>
        <p>Name: {metadata.fullName}</p>
        <p>Email: {metadata.email}</p>
        <p>Phone: {metadata.phoneNumber}</p>

        <h2 className="text-xl font-semibold mt-4 mb-2">Service Details</h2>
        <p>Service: {metadata.service}</p>
        <p>Pickup Address: {metadata.pickupAddress}</p>
        <p>Drop-off Address: {metadata.dropOffAddress}</p>
        <p>Car Details: {`${metadata.carYear} ${metadata.carMake} ${metadata.carModel}, ${metadata.carColor}`}</p>
        <p>Distance: {metadata.distance}</p>
        <p>Estimated Time: {metadata.estimatedTime}</p>

        {metadata.service === 'tow' && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Tow Service Details:</h3>
            <ul className="list-disc pl-5">
              {Object.entries(metadata.towQuestions).map(([key, value]) => (
                <li key={key}>{key}: {value?.toString()}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
