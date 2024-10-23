/* eslint-disable */

"use client"

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Service from '@/components/Services';
import { useStore } from '@/store/store';

const ServiceLocationClient = dynamic(() => import('@/components/ServiceLocationClient'), { ssr: false });

export default function ServiceLocation() {
  const router = useRouter();
  const { service } = useStore();


  console.log("service: ",service)
  useEffect(() => {
    if (!service) {
      router.push('/');
    }
  }, [service, router]);

  if (!service) {
    return null; // or you could return a loading spinner here
  }

  return (
    <>
      <Header />
      <div className="">
        <div className="relative mb-4 rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <ServiceLocationClient />
        </div>
      </div>
      <Service />
      <Footer />
    </>
  );
}
