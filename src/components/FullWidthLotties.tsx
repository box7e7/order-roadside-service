/* eslint-disable */
// @ts-nocheck

import React from 'react';
import Lottie, { LottieComponentProps } from 'lottie-react';

interface FullWidthLottieProps {
  animationData: any; // or a more specific type if you know the structure of animationData
}

const FullWidthLottie: React.FC<FullWidthLottieProps> = ({ animationData }) => {
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: 400,
      });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const defaultOptions: LottieComponentProps = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
      <Lottie
        {...defaultOptions}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default FullWidthLottie;
