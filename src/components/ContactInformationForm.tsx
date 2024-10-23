import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/store';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import Lottie from 'lottie-react';
import carAnimation from '@/lotties/contact.json'; // You'll need to add this file

interface ContactInformationFormProps {
  errors: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  setErrors: React.Dispatch<React.SetStateAction<{
    fullName: string;
    email: string;
    phoneNumber: string;
  }>>;
}

const ContactInformationForm: React.FC<ContactInformationFormProps> = ({ errors, setErrors }) => {
  const { fullName, setFullName, email, setEmail, phoneNumber, setPhoneNumber } = useStore();
  const [touched, setTouched] = useState({ fullName: false, email: false, phoneNumber: false });

  const validateFullName = (value: string) => {
    if (!value.trim()) {
      return 'Full name is required';
    }
    if (value.trim().length < 2) {
      return 'Full name must be at least 2 characters long';
    }
    return '';
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'Email is required';
    }
    if (!isEmail(value)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhoneNumber = (value: string) => {
    if (!value.trim()) {
      return 'Phone number is required';
    }
    if (!isMobilePhone(value, 'en-US')) {
      return 'Please enter a valid US phone number';
    }
    return '';
  };

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    setTouched(prev => ({ ...prev, fullName: true }));
    setErrors(prev => ({ ...prev, fullName: validateFullName(value) }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setTouched(prev => ({ ...prev, email: true }));
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setTouched(prev => ({ ...prev, phoneNumber: true }));
    setErrors(prev => ({ ...prev, phoneNumber: validatePhoneNumber(value) }));
  };

  useEffect(() => {
    // This effect will run when the component mounts, setting initial errors if fields are pre-filled
    setErrors({
      fullName: fullName ? validateFullName(fullName) : '',
      email: email ? validateEmail(email) : '',
      phoneNumber: phoneNumber ? validatePhoneNumber(phoneNumber) : '',
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

        <div className="text-center mb-[10px] mt-[-100px]">
            <div className="w-72 h-64 mx-auto">
            <Lottie animationData={carAnimation} loop={true} />
            </div>
         </div>

      <div className="mb-4 z-50">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={handleFullNameChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            touched.fullName && errors.fullName ? 'border-red-500' : ''
          }`}
          placeholder="John Doe"
        />
        {touched.fullName && errors.fullName && <p className="text-red-500 text-xs italic">{errors.fullName}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            touched.email && errors.email ? 'border-red-500' : ''
          }`}
          placeholder="john@example.com"
        />
        {touched.email && errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
          Phone Number
        </label>
        <input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''
          }`}
          placeholder="1234567890"
        />
        {touched.phoneNumber && errors.phoneNumber && <p className="text-red-500 text-xs italic">{errors.phoneNumber}</p>}
      </div>
    </div>
  );
};

export default ContactInformationForm;
