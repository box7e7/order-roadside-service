import Image from "next/image";
import bg from "../images/houston_bg3.png";
import clock from "../images/fast.png";
import { FaArrowDown } from 'react-icons/fa';

export default function MainHome() {
  return (
    <div className="relative bg-black h-[400px] md:h-[600px] overflow-hidden">
      <Image className="w-full h-full object-cover opacity-50" src={bg} alt="bg" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
        <div className="flex flex-col items-center">
          <Image className='w-[65px] h-[50px] mb-4' src={clock} alt="clock" />
          <h1 className="text-2xl font-bold mb-8">FAST HELP</h1>
          <div className='text-center'>
            <h2 className="text-3xl font-semibold mb-4">SELECT SERVICE TO</h2>
            <h3 className="text-xl mb-10">GET STARTED</h3>
          </div>
          <FaArrowDown className="text-white animate-bounce text-6xl" />
        </div>
      </div>
    </div>
  );
}