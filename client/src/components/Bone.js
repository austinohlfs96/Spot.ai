import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';


const throwBone = (x, y, isMobile) => keyframes`
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(0vw, -20vh) rotate(540deg) scale(1.5);
  }
  100% {
    opacity: 1;
    transform: translate(0vw, -40vh) rotate(1080deg) scale(0);
  }
`;

const BoneImage = styled.img`
  position: absolute;
  width: 50px;
  height: 20px;
  animation: ${({ isThrown, x, y, isMobile }) => (isThrown ? throwBone(x, y, isMobile) : 'none')} 1s ease-in-out forwards;
  z-index: 1000;
  display: ${({ isThrown }) => (isThrown ? 'block' : 'none')};
`;

const Bone = ({ isThrown, x, y }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <BoneImage src="https://freepngimg.com/save/10499-bone-png/546x192" isThrown={isThrown} x={x} y={y} isMobile={isMobile} />;
};

export default Bone;
