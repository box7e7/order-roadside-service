import React, { useRef, useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useStore } from '@/store/store';
import Lottie from 'lottie-react';
import carAnimation from '@/lotties/dropoff.json'; // You'll need to add this file

export default function DropOffDetailsForm() {
  const { setDropOffAddress, setIsLocationOpen, setHasNightDropBox } = useStore();
  const store = useStore();

  // Changed local state variable names
  const [localDropOffAddress, setLocalDropOffAddress] = useState(store.dropOffAddress);
  const [localIsLocationOpen, setLocalIsLocationOpen] = useState<boolean | null>(store.isLocationOpen);
  const [localHasNightDropBox, setLocalHasNightDropBox] = useState<boolean | null>(store.hasNightDropBox);
  const dropOffInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (dropOffInputRef.current) {
        const autocomplete = new google.maps.places.Autocomplete(dropOffInputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['formatted_address', 'geometry']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setLocalDropOffAddress(place.formatted_address);
            setDropOffAddress(place.formatted_address);
          }
        });
      }
    });
  }, [setDropOffAddress]);

  // Updated useEffect hooks to use new local state names
  useEffect(() => {
    setDropOffAddress(localDropOffAddress);
  }, [localDropOffAddress, setDropOffAddress]);

  useEffect(() => {
    setIsLocationOpen(localIsLocationOpen);
  }, [localIsLocationOpen, setIsLocationOpen]);

  useEffect(() => {
    setHasNightDropBox(localHasNightDropBox);
  }, [localHasNightDropBox, setHasNightDropBox]);

  return (
    <>
      <div className="text-center mb-[-0px] mt-[-50px]  ">
          <div className="w-40 h-40 mx-auto">
          <Lottie animationData={carAnimation} loop={true} />
          </div>
      </div>
      <input
        ref={dropOffInputRef}
        type="text"
        value={localDropOffAddress}
        onChange={(e) => setLocalDropOffAddress(e.target.value)}
        placeholder="Enter drop off address"
        className="w-full p-2 mb-8 border rounded"
      />
      <div className="mb-12">
        <p className="mb-3">Is the Drop off location going to be open?</p>
        <button
          onClick={() => setLocalIsLocationOpen(true)}
          className={`mr-2 px-4 py-2 rounded ${localIsLocationOpen === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Yes
        </button>
        <button
          onClick={() => setLocalIsLocationOpen(false)}
          className={`px-4 py-2 rounded ${localIsLocationOpen === false ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          No
        </button>
      </div>
      <div className="mb-6">
        <p className="mb-3">At the Drop off location, do they have night drop off box for keys?</p>
        <button
          onClick={() => setLocalHasNightDropBox(true)}
          className={`mr-2 px-4 py-2 rounded ${localHasNightDropBox === true ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          Yes
        </button>
        <button
          onClick={() => setLocalHasNightDropBox(false)}
          className={`px-4 py-2 rounded ${localHasNightDropBox === false ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
        >
          No
        </button>
      </div>
    </>
  );
}
