import React, {  useState } from 'react';
import { useStore } from '@/store/store';
import { loadStripe } from '@stripe/stripe-js';
import { setCookie } from 'cookies-next';
import PriceBreakdown from './PriceBreakdown';
import { FaMapMarkerAlt, FaUser, FaPhone, FaEnvelope, FaCar, FaRuler, FaClock, FaTruck, FaMotorcycle, FaWrench, FaGasPump, FaTired, FaBatteryThreeQuarters } from 'react-icons/fa';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);




const ServiceSummary: React.FC = () => {
  const {
    pickupAddress,
    dropOffAddress,
    service,
    carMake,
    carModel,
    carYear,
    carColor,
    towQuestions,
    fullName,
    email,
    phoneNumber,
    distance,
    estimatedTime,

  } = useStore();

  const [total, setTotal] = useState(0);

  console.log("$$$$$ total $$$$$$", total);



  const handleCheckout = async () => {
    try {
      // Add records to the database
      const addRecordsResponse = await fetch('/api/add-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          notes: towQuestions.specialNotes || '',
          phone: phoneNumber,
          towTo: dropOffAddress,
          towFrom: pickupAddress,
          vehicle: {
            make: carMake,
            year: carYear,
            model: carModel
          },
          serviceType: service
        }),
      });

      const addRecordsData = await addRecordsResponse.json();
      const poNumber = addRecordsData.PO;

      // Store PO number in a cookie
      setCookie('po_number', poNumber, { maxAge: 3600 }); // Expires in 1 hour

      

      // Store service metadata in a cookie
      setCookie('service_metadata', JSON.stringify({ 
        pickupAddress,
        dropOffAddress,
        service,
        carMake,
        carModel,
        carYear,
        carColor,
        towQuestions,
        fullName,
        email,
        phoneNumber,
        distance,
        estimatedTime,
        poNumber,
        total,
      }), { maxAge: 3600 });

      // Create Stripe checkout session
      const stripe = await stripePromise;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: total*100,
          customer: {
            name: fullName,
            email: email,
            phone: phoneNumber,
          },
          metadata: {
            pickupAddress,
            dropOffAddress,
            service,
            carDetails: `${carYear} ${carMake} ${carModel}, ${carColor}`,
            distance,
            estimatedTime,
            poNumber, // Include PO number in Stripe metadata
          },
        }),
      });

      const session = await response.json();

      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      }) ?? { error: { message: 'Failed to load Stripe' } };

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Error during checkout process:', error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };



  console.log( " ///// stripe key //////// ",process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType.toLowerCase()) {
      case 'tow':
        return <FaTruck className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      case 'motorcycle':
        return <FaMotorcycle className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      case 'winch out':
        return <FaWrench className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      case 'fuel':
        return <FaGasPump className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      case 'tire':
        return <FaTired className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      case 'jump start':
        return <FaBatteryThreeQuarters className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
      default:
        return <FaCar className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4 sm:p-6">
        <PriceBreakdown 
          service={service} 
          distance={distance} 
          setTotal={(newTotal) => setTotal(newTotal)} 
        />
        
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Location Details */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-lg sm:text-base font-semibold py-2 px-4 bg-indigo-100 text-indigo-800 text-center">Location Details</h3>
            <div className="p-4 space-y-2">
              <div className="flex">
                <FaMapMarkerAlt className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                <span className="font-semibold w-20 text-sm sm:text-base">Pickup:</span>
                <span className="text-gray-600 text-sm sm:text-base">{pickupAddress}</span>
              </div>
              {(service === "tow" || service === "winch out" || service === "motorcycle") && (
                <div className="flex">
                  <FaMapMarkerAlt className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                  <span className="font-semibold w-20 text-sm sm:text-base">Drop-off:</span>
                  <span className="text-gray-600 text-sm sm:text-base">{dropOffAddress}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-lg sm:text-base font-semibold py-2 px-4 bg-indigo-100 text-indigo-800 text-center">Contact Information</h3>
            <div className="p-4 space-y-2">
              <div className="flex">
                <FaUser className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                <span className="font-semibold w-20 text-sm sm:text-base">Name:</span>
                <span className="text-gray-600 text-sm sm:text-base">{fullName}</span>
              </div>
              <div className="flex">
                <FaEnvelope className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                <span className="font-semibold w-20 text-sm sm:text-base">Email:</span>
                <span className="text-gray-600 text-sm sm:text-base">{email}</span>
              </div>
              <div className="flex">
                <FaPhone className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                <span className="font-semibold w-20 text-sm sm:text-base">Phone:</span>
                <span className="text-gray-600 text-sm sm:text-base">{phoneNumber}</span>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <h3 className="text-lg sm:text-base font-semibold py-2 px-4 bg-indigo-100 text-indigo-800 text-center">Service Details</h3>
            <div className="p-4 space-y-2">
              <div className="flex">
                {getServiceIcon(service)}
                <span className="font-semibold w-24 text-sm sm:text-base">Service:</span>
                <span className="text-gray-600 text-sm sm:text-base">{service}</span>
              </div>
              <div className="flex">
                <FaCar className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                <span className="font-semibold w-24 text-sm sm:text-base">Vehicle:</span>
                <span className="text-gray-600 text-sm sm:text-base">{carYear} {carMake} {carModel}, {carColor}</span>
              </div>
              {(service === "tow" || service === "winch out" || service === "motorcycle") && (
                <>
                  <div className="flex">
                    <FaRuler className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                    <span className="font-semibold w-24 text-sm sm:text-base">Distance:</span>
                    <span className="text-gray-600 text-sm sm:text-base">{distance || 'Calculating...'}</span>
                  </div>
                  <div className="flex">
                    <FaClock className="mr-2 text-indigo-500 flex-shrink-0 mt-1" />
                    <span className="font-semibold w-24 text-sm sm:text-base">Est. Time:</span>
                    <span className="text-gray-600 text-sm sm:text-base">{estimatedTime || 'Calculating...'}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6">
          <h3 className="text-xl sm:text-2xl font-bold text-center mb-6">Total Price: ${total.toFixed(2)}</h3>
          <button
            onClick={handleCheckout}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out flex items-center justify-center text-sm sm:text-base"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Secure Checkout
          </button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Powered by <span className="font-semibold">Stripe</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceSummary;
