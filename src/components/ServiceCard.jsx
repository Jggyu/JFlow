import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const createSecureRandomArray = (size) => {
  const array = [];
  const timestamp = Date.now();
  
  for (let i = 0; i < size; i++) {
    const value = ((timestamp * (i + 1)) % 100) / 100;
    array.push(value);
  }
  
  return array;
};

function ServiceCard({ service, onClick }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const imgRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [randomValues, setRandomValues] = useState({
    positions: [],
    scales: [],
    animations: [],
    directions: []
  });
  
  useEffect(() => {
    setRandomValues({
      positions: createSecureRandomArray(60),
      scales: createSecureRandomArray(30),
      animations: createSecureRandomArray(30),
      directions: createSecureRandomArray(30)
    });
  }, []);
  
  const cardStyle = {
    bgGradient: 'from-purple-500/70 via-indigo-500/30 to-purple-500/70',
    bgPattern: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239154f7' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    iconGlow: 'shadow-purple-500/50',
    borderAccent: 'from-purple-400 via-indigo-500 to-purple-400',
    particleColor: 'bg-indigo-400'
  };
  
  const getSecureRandomValue = (type, index, min = 0, max = 1) => {
    if (!randomValues[type] || randomValues[type].length === 0) return min;
    
    const value = randomValues[type][index % randomValues[type].length];
    return min + value * (max - min);
  };

  const getSecureDirection = (index) => {
    if (!randomValues.directions || randomValues.directions.length === 0) return '+';
    
    const value = randomValues.directions[index % randomValues.directions.length];
    return value > 0.5 ? '+' : '-';
  };
  
  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    
    const handleMouseMove = (e) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;
      
      gsap.to(card, {
        rotationY: 10 * percentX,
        rotationX: -10 * percentY,
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power1.out'
      });
      
      gsap.to(content, {
        x: 15 * percentX,
        y: 15 * percentY,
        duration: 0.5,
        ease: 'power1.out'
      });
      
      gsap.to(img, {
        x: -10 * percentX,
        y: -10 * percentY,
        duration: 0.5,
        ease: 'power1.out'
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to([card, content, img], {
        rotationY: 0,
        rotationX: 0,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power1.out'
      });
      
      setIsHovering(false);
    };
    
    const handleMouseEnter = () => {
      setIsHovering(true);
      
      gsap.to(card, {
        scale: 1.03,
        duration: 0.4,
        ease: 'power1.out'
      });
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="relative">
      <div 
        ref={cardRef}
        className="relative h-full rounded-2xl shadow-2xl transform-gpu cursor-pointer overflow-hidden transition-all duration-300 group"
        onClick={onClick}
        style={{ transformStyle: 'preserve-3d', minHeight: '350px' }}
      >
        <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
             style={{ backgroundImage: cardStyle.bgPattern }}></div>
      
        <div className={`absolute inset-0 bg-gradient-to-br ${cardStyle.bgGradient} opacity-80`}></div>
        
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md"></div>
        
        <div className={`absolute inset-0 p-[1.5px] bg-gradient-to-br ${cardStyle.borderAccent} rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        <div className="relative p-8 h-full flex flex-col">
          <div className="absolute top-0 left-0 w-full h-28 bg-white/5 blur-2xl rounded-full transform -translate-y-1/2"></div>
          
          <div ref={contentRef} className="relative z-10 flex-1 flex flex-col">
            <div className="mx-auto mb-7 relative">
              <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${cardStyle.iconGlow}`}></div>
              
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-sm border border-white/10 p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div ref={imgRef} className="relative transform-gpu transition-all duration-300">
                  <img
                    src={service.image}
                    alt={`${service.name} Logo`}
                    className="w-20 h-20 object-contain filter drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center mt-4">
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-300">
                {service.name}
              </h3>
              
              <p className="text-gray-300 text-center text-base mb-6 flex-1 px-2">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {isHovering && randomValues.positions.length > 0 && (
        <>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${cardStyle.particleColor} blur-sm`}
              style={{
                top: `${getSecureRandomValue('positions', i * 2, 0, 100)}%`,
                left: `${getSecureRandomValue('positions', i * 2 + 1, 0, 100)}%`,
                opacity: 0.6,
                transform: `scale(${0.5 + getSecureRandomValue('scales', i, 0, 1)})`,
                animation: `floatParticle${i} ${3 + getSecureRandomValue('animations', i, 0, 3)}s linear infinite ${getSecureRandomValue('animations', i + 15, 0, 2)}s`,
              }}
            />
          ))}
        </>
      )}
      
      <style jsx>{`
        ${randomValues.positions.length > 0 && [...Array(15)].map((_, i) => `
          @keyframes floatParticle${i} {
            0% { transform: translate(0, 0) scale(0); opacity: 0; }
            25% { opacity: 0.6; }
            100% { 
              transform: translate(
                ${getSecureDirection(i)}${70 + getSecureRandomValue('animations', i + 5, 0, 120)}px, 
                ${getSecureDirection(i + 15)}${70 + getSecureRandomValue('animations', i + 10, 0, 120)}px
              ) scale(0); 
              opacity: 0; 
            }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}

export default ServiceCard;