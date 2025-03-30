import React, { useEffect, useRef, memo, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const createSecureRandomArray = (size) => {
  const array = [];
  const timestamp = Date.now();
  
  for (let i = 0; i < size; i++) {
    const value = ((timestamp * (i + 1)) % 100) / 100;
    array.push(value);
  }
  
  return array;
};

const ProcessDiagram = memo(() => {
  const diagramRef = useRef(null);
  const imageRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  
  const randomValues = useMemo(() => ({
    positions: createSecureRandomArray(20), // 40 -> 20으로 감소
    animations: createSecureRandomArray(20), // 40 -> 20으로 감소
    directions: createSecureRandomArray(20)  // 40 -> 20으로 감소
  }), []);
  
  useEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    
    const ctx = gsap.context(() => {
      gsap.from(".process-title", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: diagram,
          start: "top 85%",
          once: true // 한 번만 실행되도록 변경
        }
      });
      
      gsap.to(".process-title", {
        backgroundPosition: '200% center',
        duration: 15,
        repeat: -1,
        ease: "none"
      });
      
      // 이미지 애니메이션은 제거됨 (성능 향상을 위해)
      
      // 스크롤 트리거는 참조로 저장해서 나중에 정리할 수 있도록 함
      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: diagram,
        start: "top 85%",
        onEnter: () => {
          // 간단한 한 번의 애니메이션만 적용
          gsap.to(imageRef.current, {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out"
          });
        },
        once: true
      });
    }, diagram);
    
    return () => {
      ctx.revert();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
    };
  }, []);

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
  
  // 파티클 수 감소 (10 -> 6)
  const particleCount = 6;

  // 미리 계산된 파티클 애니메이션 스타일
  const particleAnimationStyles = useMemo(() => {
    return [...Array(particleCount)].map((_, i) => `
      @keyframes floatParticle${i} {
        0% { transform: translate(0, 0); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { 
          transform: translate(
            ${getSecureDirection(i)}${80 + getSecureRandomValue('animations', i + 20, 0, 120)}px, 
            ${getSecureDirection(i + 10)}${80 + getSecureRandomValue('animations', i + 30, 0, 120)}px
          ); 
          opacity: 0; 
        }
      }
    `).join('\n');
  }, [randomValues]);

  return (
    <div ref={diagramRef} className="max-w-5xl mx-auto px-4 pb-16 pt-8">
      <div className="text-center mb-10">
        <h2 className="process-title inline-block text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400 bg-[length:200%_auto] text-transparent bg-clip-text">
          제공 프로세스
        </h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          DevOps 워크플로우를 위한 완벽한 통합 프로세스를 제공합니다.
        </p>
      </div>
      
      <div className="relative perspective-1000">
        <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-5 hover:rotate-x-5 group will-change-transform">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-fuchsia-900/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
          
          <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-purple-500/80 via-indigo-500/20 to-purple-500/80 shadow-2xl transform-gpu transition-all duration-700">
            <div className="relative backdrop-blur-sm bg-gray-900/90 rounded-3xl overflow-hidden">
              <img 
                ref={imageRef}
                src="/img/process.png" 
                alt="J-Flow Process" 
                className="w-full transform-gpu transition-all duration-500 group-hover:scale-[1.02] will-change-transform"
                loading="lazy"
                style={{ opacity: 0.9, transform: 'scale(0.98)' }} // 초기 상태를 설정
              />
              
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-900/5 to-indigo-900/5 transition-opacity duration-500"></div>
            </div>
          </div>
          
          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1500 will-change-transform"></div>
          </div>
          
          <div className="particles-container absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {randomValues.positions.length > 0 && [...Array(particleCount)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full w-2 h-2 bg-purple-400/40 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700 will-change-transform"
                style={{
                  top: `${getSecureRandomValue('positions', i * 2, 0, 100)}%`,
                  left: `${getSecureRandomValue('positions', i * 2 + 1, 0, 100)}%`,
                  animation: `floatParticle${i} ${3 + getSecureRandomValue('animations', i, 0, 4)}s linear infinite ${getSecureRandomValue('animations', i + 10, 0, 1.5)}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        
        <div className="absolute -bottom-6 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-6 -left-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          
        <style jsx>{`
          ${particleAnimationStyles}
          
          .perspective-1000 {
            perspective: 1000px;
          }
          
          .rotate-y-5 {
            transform: rotateY(5deg);
          }
          
          .rotate-x-5 {
            transform: rotateX(5deg) rotateY(5deg);
          }
        `}</style>
      </div>
    </div>
  );
});

export default ProcessDiagram;