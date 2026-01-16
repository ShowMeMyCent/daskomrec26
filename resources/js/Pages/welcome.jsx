import React, { useRef } from 'react';
import { Head } from '@inertiajs/react'; 
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

import ocean from '../assets/ocean.jpeg';
import cave from '../assets/cave.png';
import DaskomBnW01 from '../assets/DaskomBnW01.png';
import DLOR_Plain2 from '../assets/DLOR_Plain2.png';
import utama from '../assets/utama.png';
import Button09 from '../assets/Button09.png';
import door2 from '../assets/door2.png';
import trial from '../assets/trial.png';



export default function Welcome() {
  const parallax = useRef(null);

  return (
    <>
      <Head title="DLOR 2026 (Atlantis)" />

      <div style={{ width: '100%', height: '100vh', margin: 0, padding: 0 }}>
        
        <Parallax ref={parallax} pages={3} style={{ top: '0', left: '0', backgroundColor: '#00022c' }}>
          {/* SECTION 1 */}
          <ParallaxLayer 
            offset={0}
            speed={0.2} 
            factor={1}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 50%, #00022c), url(${ocean})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(2px)',
              transform: 'scale(1.1)',
            }}
          />

          <ParallaxLayer
            offset={0}
            speed={0.2} 
            factor={2} 
            style={{
              pointerEvents: 'none', 
              zIndex: 50, 
            }}
          >
            <div style={{
                width: '100%', 
                height: '100%',
                backgroundImage: `url(${cave})`,
                backgroundSize: '100% 100%', 
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center top',
              }}
            />
          </ParallaxLayer>

          <ParallaxLayer
            offset={0}
            speed={0.5}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100, 
            }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',

                textAlign: 'center',
                color: 'white',
                maxWidth: '650px',
                padding: '0 20px',
                fontFamily: 'Caudex, serif',
                marginTop: '300px',
              }}
             >
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' , alignItems: 'center', gap: '5px' }}>
                <img src={DaskomBnW01} alt="Logo Daskom" style={{ width: '150px', height: 'auto' }} />
                <img src={DLOR_Plain2} alt="Logo DLOR" style={{ width: '150px', height: 'auto' }} />
              </div>

              <div style={{ fontSize: '30px', lineHeight: '1.8', textShadow: '0 2px 10px rgba(0,0,0,0.5)', textAlign: 'left',}}>
                <p style={{ marginBottom: '25px' }}>
                  True knowledge, like the lost kingdom,<br/>
                  awaits only in the crushing deep.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  The gates of this Atlantis have opened for<br/>
                  those brave enough to endure the pressure.
                </p>
                <p style={{ marginBottom: '25px' }}>
                  We seek resilient guardians to uphold a<br/>
                  legacy time could not erode.
                </p>
                <p style={{ marginBottom: '40px' }}>
                  Descend into the unknown and forge the<br/>
                  future.
                </p>
                <p style={{ fontSize: '30px', fontStyle: 'italic',}}>
                  Are you ready for the adventure?
                </p>
              </div>

              <div 
                onClick={() => parallax.current.scrollTo(1)}
                style={{ 
                  marginTop: '30px', 
                  animation: 'bounce 2s infinite',
                  display: 'flex',
                  cursor: 'pointer'
                }}
              >
                <img 
                    src= {Button09} 
                    alt="Scroll Down Button" 
                    style={{ width: '50px', height: 'auto'}} 
                />
              </div>

             </div>
          </ParallaxLayer>

            {/* SECTION 2 */}
          <ParallaxLayer 
            offset={1.15} 
            speed={0} 
            factor={1}
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 2, 44, 1) 0%, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 100%), url(${utama})`, 
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: 1,
            }}
          />
            <ParallaxLayer
                offset={1.15}
                speed={0.1}
                style={{
                    display:'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    paddingTop: '20vh',
                    zIndex: 2
                }}
                >
                    <img
                        src={trial}
                        alt="bola"
                        style={{
                            width: '70%',
                            opacity: 0.9,
                            filter: 'drop-shadow(0 0 30px rgba(0, 200, 255, 0.4))'
                        }}
                        />
                </ParallaxLayer>

        </Parallax>
      </div>
    </>
  )
}