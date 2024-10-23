'use client'
import { useStore } from "@/store/store";
// import FullWidthLottie from "@/components/FullWidthLotties";
// import Animation from '@/lotties/anim.json';
export default function NextStep() {
  const { pickupAddress, service } = useStore();

  return (
    <div className="flex flex-col items-center justify-start h-screen pt-20 relative">
      <h1 className="text-4xl font-bold z-10">Next Step</h1>
      <div className="mt-10 z-10">
        <h1 className="text-2xl font-bold">
          Pickup Address: <span className="text-gray-500">{pickupAddress}</span>
        </h1>
        <h1 className="text-2xl font-bold">
          Service: <span className="text-gray-500">{service}</span>
        </h1>
      </div>

      

     
</div>
  
  );
}




// 'use client'
// import { useStore } from "@/store/store";
// import Lottie from "lottie-react";
// import Animation from '@/lotties/anim.json';

// export default function NextStep() {
//   const { pickupAddress, service } = useStore();

//   return (
//     <div className="flex flex-col items-center justify-start h-screen pt-20 relative">
//       {/* <h1 className="text-4xl font-bold z-10">Next Step</h1>
//       <div className="mt-10 z-10">
//         <h1 className="text-2xl font-bold">
//           Pickup Address: <span className="text-gray-500">{pickupAddress}</span>
//         </h1>
//         <h1 className="text-2xl font-bold">
//           Service: <span className="text-gray-500">{service}</span>
//         </h1>
//       </div> */}

//       {/* Wrapping Lottie in a container for better control */}
//       <div className="w-full h-[400px] relative overflow-hidden bg-gray-100">
//   <div className="absolute inset-0 flex items-center justify-center">
//     <Lottie
//       animationData={Animation}
//       loop={true}
//       style={{
//         width: '100%',
//         height: '100%',
//         maxWidth: '100%',
//         maxHeight: '100%',
//         objectFit: 'contain',
//       }}
//     />
//   </div>
// </div>
// </div>
  
//   );
// }

