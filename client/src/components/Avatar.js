import React from 'react';
import '../Avatar.scss';
import styled from 'styled-components'; 

const Container = styled.div`
  margin-top: 50px;
`;

const Avatar = () => {
  return (
    <Container style={{alignSelf: "end"}}>
      <div className="husky">
  <div className="mane">
    <div className="coat"></div>
  </div>
  <div className="body">
    <div className="head">
      <div className="ear"></div>
      <div className="ear"></div>
      <div className="face">
        <div className="eye"></div>
        <div className="eye"></div>
        <div className="nose"></div>
        <div className="mouth">
          <div className="lips"></div>
          <div className="tongue"></div>
        </div>
      </div>
    </div>
    <div className="torso"></div>
  </div>
  <div className="legs">
    <div className="front-legs">
      <div className="leg"></div>
      <div className="leg"></div>
    </div>
    <div className="hind-leg">
    </div>
  </div>
  <div className="tail">
    <div className="tail">
      <div className="tail">
        <div className="tail">
          <div className="tail">
            <div className="tail">
              <div className="tail"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

{/* <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{position: 'absolute'}}> */}
  <defs>

    
    <filter id="squiggly-0">
      <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="0"/>
      <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="2" />
    </filter>
    <filter id="squiggly-1">
      <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="1"/>
<feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
    </filter>
    
    <filter id="squiggly-2">
      <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="2"/>
<feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
    </filter>
    <filter id="squiggly-3">
      <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="3"/>
<feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
    </filter>
    
    <filter id="squiggly-4">
      <feTurbulence id="turbulence" baseFrequency="0.02" numOctaves="3" result="noise" seed="4"/>
<feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
    </filter>
  </defs> 
{/* </svg> */}
    </Container>
  );
};

export default Avatar;

