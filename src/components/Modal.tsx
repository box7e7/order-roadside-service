import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '@/store/store';
import CarInformationForm from './CarInformationForm';
import TowServiceQuestions from './TowServiceQuestions';
import ContactInformationForm from './ContactInformationForm';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
// import { TowQuestions } from '@/store/store';
import AlertComponent from './AlertComponent';
import MotorcycleInformationForm from './MotorcycleInformationForm';


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  activeComponent: 'dropoff' | 'carInfo' | 'motorcycleInfo' | 'serviceQuestions' | 'contactInfo' | 'summary';
  setActiveComponent: (component: 'dropoff' | 'carInfo' | 'motorcycleInfo' | 'serviceQuestions' | 'contactInfo' | 'summary') => void;
}


let alertTimeoutId: NodeJS.Timeout | null = null;

const alertFunc = () => {
  const btn = document.getElementById("alert0")
  const pr = document.getElementById("progress0")

  // Clear any existing timeout
  if (alertTimeoutId) {
    clearTimeout(alertTimeoutId);
    btn?.classList.add("hidden")
    btn?.classList.remove("animate-wiggle")
    pr?.classList.remove('progress0')
  }

  // Reset the animation by removing the class
  btn?.classList.remove("animate-wiggle")
  
  // Force a reflow to ensure the removal is processed
  void btn?.offsetWidth

  // Show the alert and start animations
  btn?.classList.remove("hidden")
  btn?.classList.add("animate-wiggle")
  pr?.classList.remove('progress0')
  pr?.classList.add('progress0')

  // Hide the alert after 4 seconds
  alertTimeoutId = setTimeout(() => {
    btn?.classList.add("hidden")
    btn?.classList.remove("animate-wiggle")
    pr?.classList.remove('progress0')
    alertTimeoutId = null;
  }, 4000)
}


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, activeComponent, setActiveComponent }) => {
  const { service, dropOffAddress, isLocationOpen, hasNightDropBox, carMake, carModel, carYear, carColor, towQuestions, fullName, email, phoneNumber, resetState } = useStore();
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState({ fullName: '', email: '', phoneNumber: '' });



  console.log(dropOffAddress,isLocationOpen,hasNightDropBox)
  // Add this function
  const getModalTitle = () => {
    switch (activeComponent) {
      case 'dropoff':
        return 'Drop Off Location';
      case 'carInfo':
        return 'Vehicle Information';
      case 'serviceQuestions':
        if (service === 'tow') return 'Tow Service Questions';
        if (service === 'tire') return 'Tire Service Questions';
        if (service === 'fuel') return 'Fuel Delivery Questions';
        if (service === 'jump start') return 'Jump Start Questions';
        if (service === 'lock out') return 'Lockout Service Questions';
        if (service === 'winch out') return 'Winch Out Questions';
       
        return 'Service Questions';
      case 'contactInfo':
        return 'Contact Information';
      case 'summary':
        return 'Service Summary';
      default:
        return '';
    }
  };

  useEffect(() => {

    
    const checkScroll = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = contentRef.current;
        setShowScrollIndicator(scrollHeight > clientHeight && scrollTop < scrollHeight - clientHeight - 20);

        console.log("////// showScrollIndicator ///////", showScrollIndicator);
      }
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    if (contentRef.current) {
      contentRef.current.addEventListener('scroll', checkScroll);
    }

    return () => {
      window.removeEventListener('resize', checkScroll);
      if (contentRef.current) {
        contentRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, [activeComponent,isOpen]);

  if (!isOpen) return null;

  const validateContactInfo = () => {
    const newErrors = {
      fullName: fullName.trim() ? '' : 'Full name is required',
      email: email.trim() ? (isEmail(email) ? '' : 'Invalid email address') : 'Email is required',
      phoneNumber: phoneNumber.trim() ? (isMobilePhone(phoneNumber, 'en-US') ? '' : 'Invalid phone number') : 'Phone number is required',
    };

    setErrors(newErrors);

    return Object.values(newErrors).every(error => error === '');
  };

  const handleNextStep = () => {
    if (activeComponent === 'dropoff') {
      if (!dropOffAddress.trim()) {
        alertFunc()
        return;
      }
      if (isLocationOpen === null) {
        alertFunc()
        return;
      }
      if (hasNightDropBox === null) {
        alertFunc()
        return;
      }
      setActiveComponent(service === "motorcycle" ? 'motorcycleInfo' : 'carInfo');
    } else if (activeComponent === 'carInfo') {
      if (!carMake || !carModel || !carYear || !carColor) {
        alertFunc()
        return;
      }
      if (service) {
        setActiveComponent('serviceQuestions');
      } else {
        setActiveComponent('summary');
      }
    } else if (activeComponent === 'serviceQuestions') {
      // Check relevant questions based on service type
      if (service === 'tow' || service === 'winch out') {
        if (
          towQuestions.accident === null ||
          towQuestions.brokenAxle === null ||
          towQuestions.wheelsIntact === null ||
          towQuestions.unattended === null ||
          towQuestions.keyWithVehicle === null ||
          towQuestions.canPutInNeutral === null ||
          !towQuestions.locationType
        ) {
          alertFunc()
          return;
        }
      } else if (service === 'tire') {
        if (
          towQuestions.hasWorkingSpare === null ||
          towQuestions.hasWheelLockKey === null ||
          towQuestions.areLugnutsStripped === null ||
          !towQuestions.locationType
        ) {
          alertFunc()
          return;
        }
      }
      // Add checks for other service types if needed
      
      if (!towQuestions.locationType) {
        alertFunc()
        return;
      }
      setActiveComponent('contactInfo');
    } else if (activeComponent === 'contactInfo') {
      const isValid = validateContactInfo();
      if (isValid) {
        setActiveComponent('summary');
      } else {
        alertFunc()
      }
    }
  };

  const renderToggleButton = (component: 'dropoff' | 'carInfo' | 'motorcycleInfo' | 'serviceQuestions' | 'contactInfo' | 'summary', icon: JSX.Element) => {
    const isClickable = () => {
      switch (component) {
        case 'dropoff':
          return true;
        case 'carInfo':
          if (service === "tire" || service === "jump start" || service === "fuel" || service === "lock out" ){
            return true
          }
        case 'motorcycleInfo':
          return !!dropOffAddress && isLocationOpen !== null && hasNightDropBox !== null;
        case 'serviceQuestions':
          return !!carMake && !!carModel && !!carYear && !!carColor;
        case 'contactInfo':
          if (service === 'tow' || service === 'winch out') {
            return towQuestions.accident !== null &&
                   towQuestions.brokenAxle !== null &&
                   towQuestions.wheelsIntact !== null &&
                   towQuestions.unattended !== null &&
                   towQuestions.keyWithVehicle !== null &&
                   towQuestions.canPutInNeutral !== null &&
                   !!towQuestions.locationType;
          } else if (service === 'tire') {
            return towQuestions.hasWorkingSpare !== null &&
                   towQuestions.hasWheelLockKey !== null &&
                   towQuestions.areLugnutsStripped !== null &&
                   !!towQuestions.locationType;
          }
          return !!towQuestions.locationType;
        case 'summary':
          return !!fullName && !!email && !!phoneNumber;
        default:
          return false;
      }
    };

    return (
      <button
        onClick={() => isClickable() && setActiveComponent(component)}
        className={`p-2 rounded-full ${
          activeComponent === component
            ? 'bg-green-500'
            : isClickable()
            ? 'bg-gray-200 hover:bg-gray-300'
            : 'bg-gray-200 opacity-50 cursor-not-allowed'
        }`}
        disabled={!isClickable()}
      >
        {icon}
      </button>
    );
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <AlertComponent />
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] max-h-[40rem] md:max-h-[50rem] relative">

      {showScrollIndicator && (
            <div id="scroll-indicator" className="absolute bottom-28 md:bottom-36 right-4 animate-bounce z-50">
              <div className="bg-white bg-opacity-75 rounded-full p-2 shadow-md">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )}


        <div className="relative flex-shrink-0">
          <div className="absolute top-4 left-4 flex space-x-2">
            {service=="tow" || service=="winch out" || service=="motorcycle" ? renderToggleButton('dropoff', 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={activeComponent === 'dropoff' ? 'white' : 'currentColor'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ): null}

            {renderToggleButton(service === "motorcycle" ? 'motorcycleInfo' : 'carInfo', 
              service === "motorcycle" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 490.001 490.001" fill={activeComponent === 'motorcycleInfo' ? 'white' : 'currentColor'}>
                  <path d="M410.689,235.919c-14.154,0-27.443,3.744-38.96,10.268l-20.528-27.251c26.069-19.054,52.85-27.796,55.161-28.526 c2.881-0.916,5.223-3.034,6.424-5.794c1.201-2.769,1.15-5.925-0.153-8.644c-35.267-73.853-89.95-80.237-92.262-80.472 c-4.429-0.438-8.471,1.853-10.394,5.732c-1.935,3.889-1.253,8.563,1.699,11.749c6.486,6.964,9.173,14.499,8.207,23.04 c-0.418,3.72-1.502,7.509-3.085,11.297c-59.498-19.458-97.449,8.263-110.85,20.886c-33.22-11.701-63.089-17.613-89.272-17.613 c-40.358,0-57.371,14.273-59.183,15.903c-2.952,2.656-4.144,6.77-3.055,10.599c1.09,3.828,4.256,6.698,8.165,7.412 c38.377,6.954,65.206,20.062,83.918,35.579l-24.247,28.524c-12.389-8.014-27.131-12.689-42.953-12.689 C35.583,235.919,0,271.502,0,315.232c0,43.738,35.583,79.321,79.322,79.321c43.738,0,79.322-35.583,79.322-79.321 c0-20.417-7.76-39.054-20.482-53.127l23.244-27.344c33.791,39.865,26.9,87.054,26.418,90.061c-0.51,3.023,0.346,6.108,2.331,8.45 c1.975,2.342,4.887,3.685,7.952,3.685h93.239c3.044,0,5.947-1.334,7.921-3.645c1.985-2.321,2.851-5.387,2.382-8.399 c-6.43-40.978,11.064-71.267,33.506-92.626l19.928,26.455c-14.626,14.395-23.715,34.398-23.715,56.489 c0,43.738,35.583,79.321,79.322,79.321c43.729,0,79.311-35.583,79.311-79.321C490.001,271.502,454.418,235.919,410.689,235.919z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 31.445 31.445" 
                  stroke={activeComponent === 'carInfo' ? 'white' : 'currentColor'} 
                  fill={activeComponent === 'carInfo' ? 'white' : 'currentColor'}>
                  <g>
                    <path d="M7.592,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.768,0,3.203-1.434,3.203-3.204S9.36,16.86,7.592,16.86z M7.592,21.032c-0.532,0-0.968-0.434-0.968-0.967s0.436-0.967,0.968-0.967c0.531,0,0.966,0.434,0.966,0.967S8.124,21.032,7.592,21.032z"/>
                    <path d="M30.915,17.439l-0.524-4.262c-0.103-0.818-0.818-1.418-1.643-1.373L27.6,11.868l-3.564-3.211c-0.344-0.309-0.787-0.479-1.249-0.479l-7.241-0.001c-1.625,0-3.201,0.555-4.468,1.573l-4.04,3.246l-5.433,1.358c-0.698,0.174-1.188,0.802-1.188,1.521v1.566C0.187,17.44,0,17.626,0,17.856v2.071c0,0.295,0.239,0.534,0.534,0.534h3.067c-0.013-0.133-0.04-0.26-0.04-0.396c0-2.227,1.804-4.029,4.03-4.029s4.029,1.802,4.029,4.029c0,0.137-0.028,0.264-0.041,0.396h8.493c-0.012-0.133-0.039-0.26-0.039-0.396c0-2.227,1.804-4.029,4.029-4.029c2.227,0,4.028,1.802,4.028,4.029c0,0.137-0.026,0.264-0.04,0.396h2.861c0.295,0,0.533-0.239,0.533-0.534v-1.953C31.449,17.68,31.21,17.439,30.915,17.439zM20.168,12.202l-10.102,0.511L12,11.158c1.051-0.845,2.357-1.305,3.706-1.305h4.462V12.202z M21.846,12.117V9.854h0.657c0.228,0,0.447,0.084,0.616,0.237l2.062,1.856L21.846,12.117z"/>
                    <path d="M24.064,16.86c-1.77,0-3.203,1.434-3.203,3.204s1.434,3.204,3.203,3.204c1.769,0,3.203-1.434,3.203-3.204S25.833,16.86,24.064,16.86z M24.064,21.032c-0.533,0-0.967-0.434-0.967-0.967s0.434-0.967,0.967-0.967c0.531,0,0.967,0.434,0.967,0.967S24.596,21.032,24.064,21.032z"/>
                  </g>
                </svg>
              )
            )}
            {renderToggleButton('serviceQuestions', 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 256 256">
                <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" fill={activeComponent === 'serviceQuestions' ? 'white' : 'currentColor'}>
                  <path d="M 88.5 32.989 H 78.038 c -0.828 0 -1.5 -0.671 -1.5 -1.5 s 0.672 -1.5 1.5 -1.5 H 88.5 c 0.828 0 1.5 0.671 1.5 1.5 S 89.328 32.989 88.5 32.989 z" />
                  <path d="M 11.962 32.989 H 1.5 c -0.829 0 -1.5 -0.671 -1.5 -1.5 s 0.671 -1.5 1.5 -1.5 h 10.462 c 0.829 0 1.5 0.671 1.5 1.5 S 12.791 32.989 11.962 32.989 z" />
                  <path d="M 73.896 16.973 c -0.527 0 -1.039 -0.279 -1.313 -0.773 c -0.402 -0.725 -0.141 -1.637 0.584 -2.039 l 9.15 -5.072 c 0.724 -0.4 1.638 -0.14 2.039 0.585 c 0.402 0.725 0.141 1.637 -0.584 2.039 l -9.15 5.072 C 74.393 16.912 74.143 16.973 73.896 16.973 z" />
                  <path d="M 6.956 54.079 c -0.528 0 -1.04 -0.278 -1.313 -0.772 c -0.401 -0.725 -0.14 -1.638 0.585 -2.039 l 9.15 -5.072 c 0.725 -0.403 1.638 -0.141 2.039 0.584 s 0.14 1.638 -0.585 2.039 l -9.15 5.072 C 7.451 54.019 7.202 54.079 6.956 54.079 z" />
                  <path d="M 16.103 16.973 c -0.246 0 -0.495 -0.061 -0.726 -0.188 l -9.15 -5.072 c -0.725 -0.402 -0.986 -1.314 -0.585 -2.039 s 1.314 -0.986 2.039 -0.584 l 9.15 5.072 c 0.725 0.402 0.986 1.314 0.585 2.039 C 17.143 16.693 16.631 16.973 16.103 16.973 z" />
                  <path d="M 83.045 54.079 c -0.246 0 -0.496 -0.061 -0.727 -0.188 l -9.15 -5.072 c -0.725 -0.401 -0.986 -1.314 -0.584 -2.039 c 0.401 -0.725 1.315 -0.986 2.039 -0.584 l 9.15 5.072 c 0.725 0.401 0.986 1.314 0.584 2.039 C 84.084 53.801 83.572 54.079 83.045 54.079 z" />
                  <path d="M 43.338 6.323 C 30.61 7.123 20.226 17.42 19.328 30.142 c -0.631 8.938 3.306 16.988 9.712 22.057 c 3.62 2.865 5.811 7.162 5.811 11.779 v 7.492 c 0 1.3 1.054 2.354 2.354 2.354 h 0.163 v 5.643 c 0 2.354 1.908 4.262 4.262 4.262 h 6.74 c 2.354 0 4.262 -1.908 4.262 -4.262 v -5.643 h 0.163 c 1.3 0 2.354 -1.054 2.354 -2.354 v -7.494 c 0 -4.536 2.05 -8.852 5.631 -11.635 c 6.059 -4.708 9.958 -12.064 9.958 -20.331 C 70.738 17.244 58.306 5.383 43.338 6.323 z M 45.208 52.638 c -1.826 0 -3.307 -1.481 -3.307 -3.307 s 1.481 -3.307 3.307 -3.307 s 3.307 1.481 3.307 3.307 S 47.035 52.638 45.208 52.638 z M 54.998 26.794 c 0 2.62 -1.006 5.097 -2.833 6.973 c -0.03 0.031 -0.062 0.062 -0.093 0.092 l -3.975 3.752 v 1.421 c 0.002 1.713 -1.386 3.1 -3.097 3.1 s -3.099 -1.388 -3.099 -3.099 v -2.757 c 0 -0.853 0.352 -1.667 0.972 -2.253 l 4.891 -4.618 c 0.67 -0.708 1.038 -1.633 1.038 -2.61 v -0.183 c 0 -1.034 -0.408 -2.001 -1.149 -2.724 c -0.74 -0.721 -1.721 -1.107 -2.755 -1.077 c -2.04 0.052 -3.7 1.827 -3.7 3.957 c 0 1.711 -1.388 3.099 -3.099 3.099 S 35 28.478 35 26.767 c 0 -5.459 4.368 -10.013 9.737 -10.151 c 2.718 -0.073 5.292 0.936 7.24 2.834 c 1.948 1.898 3.021 4.441 3.021 7.161 V 26.794 z" />
                </g>
              </svg>
            )}
            {renderToggleButton('contactInfo', 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={activeComponent === 'contactInfo' ? 'white' : 'currentColor'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
            {renderToggleButton('summary', 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={activeComponent === 'summary' ? 'white' : 'currentColor'}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            )}
          </div>
          <div className="flex justify-between items-center pt-24 pb-8 px-4">
            {activeComponent != 'summary' ? <h2 className="text-2xl font-bold text-center w-full"> { getModalTitle()} </h2>
              : null}
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out absolute right-4 top-4"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div ref={contentRef} className="flex-grow overflow-y-auto relative">
          <div className="p-6 pb-32 md:pb-40 flex flex-col items-center text-center">
            {activeComponent === 'carInfo' ? (
              <CarInformationForm />
            ) : activeComponent === 'serviceQuestions' ? (
              <TowServiceQuestions />
            ) : activeComponent === 'contactInfo' ? (
              <ContactInformationForm errors={errors} setErrors={setErrors} />
            ): activeComponent === 'motorcycleInfo' ? (
              <MotorcycleInformationForm />
            ) : (
              children
            )
            }
          </div>
         {/* //////// */}
         {/* {showScrollIndicator && (
            <div id="scroll-indicator" className="absolute bottom-28 md:bottom-36 right-4 animate-bounce z-50">
              <div className="bg-white bg-opacity-75 rounded-full p-2 shadow-md">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          )} */}
        </div>
        {activeComponent !== 'summary' && (
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 pt-6 pb-8 md:pb-10 rounded-b-lg">
            <button
              onClick={handleNextStep}
              className="w-full bg-green-500 text-white py-3 md:py-4 rounded-lg hover:bg-green-600 shadow-md text-lg md:text-xl font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
