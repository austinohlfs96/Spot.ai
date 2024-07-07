import React from 'react';
import '../Avatar.scss';
import styled from 'styled-components'; 

const Container = styled.div`
  margin-top: 50px;
`;

const Avatar = () => {
  return (
    <Container style={{alignSelf: "end"}}>
      <div class="husky">
  <div class="mane">
    <div class="coat"></div>
  </div>
  <div class="body">
    <div class="head">
      <div class="ear"></div>
      <div class="ear"></div>
      <div class="face">
        <div class="eye"></div>
        <div class="eye"></div>
        <div class="nose"></div>
        <div class="mouth">
          <div class="lips"></div>
          <div class="tongue"></div>
        </div>
      </div>
    </div>
    <div class="torso"></div>
  </div>
  <div class="legs">
    <div class="front-legs">
      <div class="leg"></div>
      <div class="leg"></div>
    </div>
    <div class="hind-leg">
    </div>
  </div>
  <div class="tail">
    <div class="tail">
      <div class="tail">
        <div class="tail">
          <div class="tail">
            <div class="tail">
              <div class="tail"></div>
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
