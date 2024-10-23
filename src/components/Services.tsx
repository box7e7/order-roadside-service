import Image from 'next/image'

// import Context from "../components/ContextFile";
import IconComponent from './IconComponent'
import towTruckIcon from "../images/tow-icon-removebg.png"
// import towTruckIcon from "../images/tow-truck-icon_blue.png"
import flatTireIcon from "../images/flat-tire-icon_blue.png"
import carStuckInMud from "../images/car_stuck_in_mud_1_blue.png"
import fuelIcon from "../images/fuel-delivery-icon.png"
// import fuelIcon from "../images/fuel-icon_blue.png"
import iconBatteries from "../images/icon_battery_0.png"
import unlockIcon from "../images/car-lock.png"
// import unlockIcon from "../images/icon_lockout_0.png"
import motorCycle from "../images/motorCycle.png"
import { useStore } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function Service(){
    const { setService} = useStore()
    const router = useRouter();

    const handleServiceClick = (selectedService: string) => {
        setService(selectedService);
        router.push('/service-location');
    }

    return(
        <div className='bg-white h-[550px] flex items-center justify-center pb-10 pt-20'>
            <div className='flex flex-col space-y-3'>
                <div className="flex flex-row justify-center pb-10">
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('tow')}>
                        <IconComponent text="Tow Service" icon={<Image className='p-2 w-full h-full object-contain' src={towTruckIcon} alt="Tow truck"/>} serviceType="tow" />
                    </div>
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('tire')}>
                        <IconComponent text="Tire Change" icon={<Image className='p-3' src={flatTireIcon} alt="Change tire"/>} serviceType="tire" />
                    </div>
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('winch out')}>
                        <IconComponent text="Winch Out" icon={<Image className='w-[65px] h-[40px]' src={carStuckInMud} alt="Winch out"/>} serviceType="winch out" />
                    </div>
                </div>

                <div className="flex flex-row justify-center pb-10">
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('fuel')}>
                        <IconComponent text="Fuel Delivery" icon={<Image className='p-1' src={fuelIcon} alt="Fuel delivery"/>} serviceType="fuel" />
                    </div>
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('jump start')}>
                        <IconComponent text="Jump Start" icon={<Image className='p-3' src={iconBatteries} alt="Jump start"/>} serviceType="jump start" />
                    </div>
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('lock out')}>
                        <IconComponent text="Lock Out" icon={<Image className='p-2' src={unlockIcon} alt="Unlock your Car"/>} serviceType="lock out" />
                    </div>
                </div>

                <div className="flex flex-row justify-center pb-20">
                    <div className='relative mx-5 hover:cursor-pointer'>
                        {/* Empty div for layout */}
                    </div>
                    <div className={`relative mx-5 hover:cursor-pointer`} onClick={() => handleServiceClick('motorcycle')}>
                        <IconComponent text="Tow Motorcycle" icon={<Image className='p-3' src={motorCycle} alt="MotorCylce"/>} serviceType="motorcycle" />
                    </div>
                    <div className='relative mx-5 hover:cursor-pointer'>
                        {/* Empty div for layout */}
                    </div>
                </div>
            </div>
        </div>
    )
}
