import React, { useState, useEffect } from 'react';


interface BreakDownProps {
  service: string;
  distance: string;
}

const BreakDown: React.FC<BreakDownProps> = ({ service, distance }) => {
    if( service=="tow" || service=="winch out"){
        return(
            <div className="mt-4">
                {/* {mainState.vehicle["Medium Duty"]=="Yes" ? <li>Hook up: <i>125$ Medium Duty</i></li> : <li>Hook up: <i>90$ Light Duty</i></li>} */}
                {/* {mainState.questions.BrokenAxle=="Yes"  ? (mainState.vehicle["Medium Duty"]=="Yes" ? <li>Vehicle Broken Axle fees: <i>125$</i></li> : <li>Vehicle Broken Axle fees: <i>90$</i></li>) : null} */}
                {/* {mainState.vehicle["Medium Duty"]=="Yes" ? <li>Loaded miles are {mainState.distance}: <i>10$ per mile</i></li> : <li>Loaded miles are {mainState.distance}: <i>5$ per mile</i></li>} */}
                {distance ? <li>Loaded miles are {parseInt(distance)/1.6}: <i>5$ per mile</i></li> : null}
            </div>
        )
    }
    else if(service=="jump start" || service=="tire" || service=="lock out"){
        return(
            <div className="mt-4">
                <p>{service}: 65$</p>
            </div>
        )
    }
    else if(service=="fuel"){
        return(
            <div className="mt-4">
                <p>{service}: 75$</p>
            </div>
        )
    }
   

    
}

interface PriceBreakdownProps {
  service: string;
  distance: string;
  setTotal: (total: number) => void;
}

const PriceBreakdownComponent: React.FC<PriceBreakdownProps> = ({ service, distance, setTotal }) => {
  const [isPriceBreakdownVisible, setPriceBreakdownVisible] = useState(false);
  const [total, setLocalTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const togglePriceBreakdown = () => {
    setPriceBreakdownVisible(!isPriceBreakdownVisible);
  };


  useEffect(() => {
    if (distance) {
      setIsLoading(false);
      
      if (service === "tow" || service === "winch out" || service === "motorcycle") {
        setLocalTotal(90 + (parseInt(distance)/1.6) * 5);
      } 
    }

    if (service === "jump start" || service === "tire" || service === "lock out") {
        setLocalTotal(65);
      } else if (service === "fuel") {
        setLocalTotal(75);
      }

    setTotal(total);
  }, [total, service, distance]);

  return (
    <div className='flex justify-center items-center flex-col pb-8'>
      <div className='flex justify-center items-center flex-col pb-4'>
        <div className='text-3xl font-bold text-gray-800 mb-2'>GET HELP NOW</div>
        <div className='text-[#11A9C9] text-5xl font-bold font-serif mb-6 h-16 flex items-center justify-center'>
          { service==="tow" || service==="winch out" || service==="motorcycle"  ? (isLoading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#11A9C9]"></div>
          ) : (
            `$${total.toFixed(2)}`
          )
          ):  `$${total.toFixed(2)}`}
        </div>
      </div>
      <div className="container mx-auto">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div 
              className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-200" 
              onClick={togglePriceBreakdown}
            >
              <h2 className="font-semibold text-lg text-gray-800">Price Breakdown</h2>
              <svg 
                className={`w-6 h-6 text-gray-600 transform transition-transform duration-200 ${isPriceBreakdownVisible ? 'rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
            {isPriceBreakdownVisible && (
              <div className="p-4 border-t border-gray-200">
                <BreakDown service={service} distance={distance} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdownComponent;
