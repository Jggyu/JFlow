import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ProcessDiagram() {
  const diagramRef = useRef(null);
  const imageRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 이미지 애니메이션
      gsap.from(imageRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: diagramRef.current,
          start: "top 80%",
        }
      });
      
      // 타이틀 애니메이션
      gsap.from(".process-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: diagramRef.current,
          start: "top 80%",
        }
      });
      
      // 타이틀 그라데이션 애니메이션
      gsap.to(".process-title", {
        backgroundPosition: '200% center',
        duration: 15,
        repeat: -1,
        ease: "none"
      });
      
    }, diagramRef);
    
    return () => ctx.revert();
  }, []);

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
        {/* 3D 카드 컨테이너 */}
        <div className="relative transform-gpu transition-all duration-700 hover:rotate-y-5 hover:rotate-x-5 group">
          {/* 배경 글로우 */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-indigo-900/10 to-fuchsia-900/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>
          
          {/* 카드 프레임 */}
          <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-purple-500/80 via-indigo-500/20 to-purple-500/80 shadow-2xl transform-gpu transition-all duration-700">
            {/* 카드 내용 */}
            <div className="relative backdrop-blur-sm bg-gray-900/90 rounded-3xl overflow-hidden">
              {/* 이미지 */}
              <img 
                ref={imageRef}
                src="/img/process.png" 
                alt="J-Flow Process" 
                className="w-full transform-gpu transition-all duration-500 group-hover:scale-[1.02]"
              />
              
              {/* 오버레이 그라데이션 */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-purple-900/5 to-indigo-900/5 transition-opacity duration-500"></div>
            </div>
          </div>
          
          {/* 프리즘 효과 (반짝임) */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] transform -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1500"></div>
          </div>
          
          {/* 흘러가는 입자들 효과 */}
          <div className="particles-container absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full w-2 h-2 bg-purple-400/40 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `floatParticle ${3 + Math.random() * 7}s linear infinite ${Math.random() * 2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* 패턴 장식 */}
        <div className="absolute -bottom-6 -right-12 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-6 -left-12 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
          
        {/* 스타일 */}
        <style jsx>{`
          @keyframes floatParticle {
            0% { transform: translate(0, 0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translate(${Math.random() > 0.5 ? '+' : '-'}${100 + Math.random() * 150}px, ${Math.random() > 0.5 ? '+' : '-'}${100 + Math.random() * 150}px); opacity: 0; }
          }
          
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
}

export default ProcessDiagram;