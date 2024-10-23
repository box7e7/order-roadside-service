import React from 'react';
import { useStore } from '@/store/store';

interface IconComponentProps {
  icon: React.ReactNode;
  text: string;
  serviceType: string;
}

const IconComponent: React.FC<IconComponentProps> = ({ icon, text, serviceType }) => {
  const { service } = useStore();

  return (
    <div className={`dispatch-icon group bg-gray-300 hover:bg-gray-400 ${service === serviceType ? 'bg-gray-400' : ''}`}>
      {icon}
      <span className='span-text font-bold text-sm'>{text}</span>
    </div>
  );
};

export default IconComponent;
