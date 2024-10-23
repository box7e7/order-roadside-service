/* eslint-disable */
// @ts-nocheck


'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';
import { Loader } from '@googlemaps/js-api-loader';
import debounce from 'lodash/debounce'; 
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import Modal from './Modal';
import DropOffDetailsForm from './DropOffDetailsForm';
import CarInformationForm from './CarInformationForm';
import ServiceSummary from './ServiceSummary';
import TowServiceQuestions from './TowServiceQuestions';

interface Location {
  lat: number;
  lng: number;
}

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  version: 'weekly',
  libraries: ['places']
});

export default function ServiceLocationClient() {
  const searchParams = useSearchParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [address, setAddress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleRef = useRef<typeof google | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);
  const { service, setService, pickupAddress, setPickupAddress } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [activeComponent, setActiveComponent] = useState<'dropoff' | 'carInfo' | 'motorcycleInfo' | 'serviceQuestions' | 'summary'>('dropoff');
 
  const initMap = useCallback(() => {
    if (googleRef.current && mapRef.current && location) {
      const mapOptions = {
        center: location,
        zoom: 15,
      };
      mapInstanceRef.current = new googleRef.current.maps.Map(mapRef.current, mapOptions);
    }
  }, [location]);

  const addCustomMarker = useCallback(() => {
    if (googleRef.current && mapInstanceRef.current && location) {
      class CustomMarker extends googleRef.current.maps.OverlayView {
        position: google.maps.LatLng;
        content: HTMLElement;

        constructor(position: google.maps.LatLng, map: google.maps.Map, onConfirm: () => void) {
          super();
          this.position = position;

          const container = document.createElement('div');
          container.className = 'custom-marker-container';

          const button = document.createElement('button');
          button.innerHTML = 'Confirm Address';
          button.className = 'custom-marker-button';
          button.onclick = onConfirm;

          const pin = document.createElement('div');
          pin.className = 'custom-marker-pin';

          container.appendChild(button);
          container.appendChild(pin);

          this.content = container;

          this.setMap(map);
        }

        onAdd() {
          const panes = this.getPanes();
          if (panes) {
            const pane = panes.overlayImage;
            pane.appendChild(this.content);
          }
        }

        draw() {
          const overlayProjection = this.getProjection();
          const position = overlayProjection.fromLatLngToDivPixel(this.position)!;
          const div = this.content;
          div.style.left = position.x + 'px';
          div.style.top = position.y + 'px';
        }

        onRemove() {
          if (this.content.parentElement) {
            this.content.parentElement.removeChild(this.content);
          }
        }
      }

      const onConfirm = () => {
        console.log('Address confirmed:', address);
        setPickupAddress(address);
        setShowModal(true);
      };

      new CustomMarker(
        new googleRef.current.maps.LatLng(location.lat, location.lng),
        mapInstanceRef.current,
        onConfirm
      );
    }
  }, [location, address, setPickupAddress]);

  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (geocoderRef.current && googleRef.current) {
      geocoderRef.current.geocode(
        { location: { lat, lng } },
        (results, status) => {
          if (status === 'OK' && results && results[0]) {
            setAddress(results[0].formatted_address);
          } else {
            console.error('Geocoder failed due to: ' + status);
          }
        }
      );
    }
  }, []);


  useEffect(()=>{
    // console.log("/////// service ////////",service);
    (service=="tow" || service=="winch out" || service=="motorcycle") ? setActiveComponent('dropoff') : setActiveComponent('carInfo')
  },[service])

  useEffect(() => {
    loader.load().then((google) => {
      googleRef.current = google;
      geocoderRef.current = new google.maps.Geocoder();
      setIsLoaded(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setLocation(newLocation);
            reverseGeocode(newLocation.lat, newLocation.lng);
          },
          () => {
            console.error('Geolocation failed');
          }
        );
      }
    }).catch(err => console.error('Error loading Google Maps API:', err));
  }, [reverseGeocode]);

  useEffect(() => {
    if (isLoaded && inputRef.current && googleRef.current) {
      const autocomplete = new googleRef.current.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const newLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          setLocation(newLocation);
          setAddress(place.formatted_address || '');
        }
      });
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded && location) {
      initMap();
      addCustomMarker();
    }
  }, [isLoaded, location, initMap, addCustomMarker]);

  const { setDropOffAddress, setIsLocationOpen, setHasNightDropBox } = useStore();

  const handleModalSubmit = (details: {
    dropOffAddress: string;
    isLocationOpen: boolean | null;
    hasNightDropBox: boolean | null;
  }) => {
    console.log('Drop-off details:', details);
    setDropOffAddress(details.dropOffAddress);
    setIsLocationOpen(details.isLocationOpen);
    setHasNightDropBox(details.hasNightDropBox);
    setActiveComponent('summary');
  };

  return (
    <>
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 w-[90%] flex">
        <input
          ref={inputRef}
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="flex-grow p-2 border-t border-b border-l rounded-full shadow-md bg-black bg-opacity-50 text-white placeholder-gray-300 focus:outline-none focus:ring-0"
        />
      </div>
      <div ref={mapRef} className="w-full h-full">
        {!isLoaded || !location && (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              <p className="mt-2 text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
      </div>
      <Modal 
          isOpen={showModal} 
          onClose={() => {
            setShowModal(false);
            setActiveComponent('dropoff');
          }}
          activeComponent={activeComponent}
          setActiveComponent={setActiveComponent}
        >
          {
          // activeComponent === 'summary' ? (
          //   <ServiceSummary />
          // ) : activeComponent === 'serviceQuestions' ? (
          //   <TowServiceQuestions />
          // ) : 
          activeComponent === 'summary' ? <ServiceSummary /> :
          (
            (service=="tow" || service=="winch out" || service=="motorcycle")? <DropOffDetailsForm onSubmit={handleModalSubmit} /> : <CarInformationForm />
          )}
      </Modal>
      <style jsx global>{`
        .custom-marker-container {
          position: absolute;
          transform: translate(-50%, -100%);
          cursor: pointer;
        }
        .custom-marker-button {
          background-color: #4CAF50;
          border: none;
          color: white;
          padding: 10px 20px;
          text-align: center;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
          margin: 4px 2px;
          cursor: pointer;
          border-radius: 4px;
          white-space: nowrap;
          transition: background-color 0.3s, transform 0.3s;
        }
        .custom-marker-button:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }
        .custom-marker-pin {
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 15px solid #4CAF50;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      `}</style>
    </>
  );
}
