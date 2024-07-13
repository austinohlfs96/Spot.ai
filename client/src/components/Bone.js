import React from 'react';
import styled, { keyframes } from 'styled-components';
// import boneImage from './assets/bone.png'; // Adjust the path to your bone image

const throwBone = keyframes`
  0% {
    opacity: 1;
    transform: translate(0, 0) rotate(0);
  }
  100% {
    opacity: 1;
    transform: translate(40px, -170px) rotate(360deg); /* Adjust this for the avatar's mouth position */
  }
`;

const BoneImage = styled.img`
  position: absolute;
  width: 50px;
  height: 20px;
  animation: ${({ isThrown }) => (isThrown ? throwBone : 'none')} 1s ease-in-out forwards;
  z-index: 1000;
`;

const Bone = ({ isThrown }) => {
  return <BoneImage src="https://freepngimg.com/save/10499-bone-png/546x192" isThrown={isThrown} style={{ display: isThrown ? 'block' : 'none' }} />;
};

export default Bone;
