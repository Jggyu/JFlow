import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const InfinityAnimation = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // GSAP 애니메이션
    const ctx = gsap.context(() => {
      // 전체 컨테이너 효과
      gsap.to(container, {
        duration: 5,
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // 왼쪽 루프 회전 및 맥동
      gsap.to(".left-loop", {
        duration: 10,
        rotation: 360,
        repeat: -1,
        ease: "none",
      });
      
      // 오른쪽 루프 반대 방향 회전 및 맥동
      gsap.to(".right-loop", {
        duration: 10,
        rotation: -360,
        repeat: -1,
        ease: "none",
      });
      
      // 발광 효과
      gsap.to(".glow", {
        duration: 2,
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // 파티클 애니메이션
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, i) => {
        // 초기 위치 랜덤 설정
        gsap.set(particle, {
          x: gsap.utils.random(-150, 150),
          y: gsap.utils.random(-150, 150),
          scale: gsap.utils.random(0.3, 1),
          opacity: gsap.utils.random(0.3, 0.8)
        });
        
        // 애니메이션
        gsap.to(particle, {
          duration: gsap.utils.random(3, 8),
          x: gsap.utils.random(-150, 150),
          y: gsap.utils.random(-150, 150),
          scale: gsap.utils.random(0.3, 1),
          opacity: gsap.utils.random(0.3, 0.8),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.1
        });
      });
      
      // 흐르는 빛 효과
      gsap.to(".flow-light", {
        duration: 4,
        backgroundPosition: "200% center",
        repeat: -1,
        ease: "none"
      });
      
      // 중앙 교차 부분 맥동
      gsap.to(".center-cross", {
        duration: 2,
        boxShadow: "0 0 30px 10px rgba(145, 84, 247, 0.9)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // 외부 원 애니메이션
      gsap.to(".outer-circle", {
        duration: 8,
        rotation: 360,
        repeat: -1,
        ease: "none"
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-[500px] h-[300px] mx-auto my-12">
      {/* 배경 글로우 효과 */}
      <div className="glow absolute inset-0 rounded-full bg-purple-500/10 blur-3xl"></div>
      
      {/* 외부 원 장식 */}
      <div className="outer-circle absolute inset-0 rounded-full border-2 border-dashed border-purple-500/20 opacity-80"></div>
      
      {/* 왼쪽 루프 */}
      <div className="left-loop absolute left-0 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border-[15px] border-transparent">
        {/* 왼쪽 루프 그라데이션 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600"></div>
        
        {/* 흐르는 빛 효과 */}
        <div className="flow-light absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 bg-[length:200%_100%]"></div>
      </div>
      
      {/* 오른쪽 루프 */}
      <div className="right-loop absolute right-0 top-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border-[15px] border-transparent">
        {/* 오른쪽 루프 그라데이션 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600"></div>
        
        {/* 흐르는 빛 효과 */}
        <div className="flow-light absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-50 bg-[length:200%_100%]"></div>
      </div>
      
      {/* 중앙 교차 부분 */}
      <div className="center-cross absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-white rounded-full shadow-[0_0_20px_5px_rgba(145,84,247,0.7)]"></div>
      
      {/* 파티클들 */}
      {[...Array(30)].map((_, i) => (
        <div 
          key={i}
          className="particle absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-sm"
          style={{ left: '50%', top: '50%' }}
        ></div>
      ))}
      
      {/* 추가 네온 빛 효과 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-indigo-500/5 to-purple-500/0 mix-blend-overlay"></div>
    </div>
  );
};

export default InfinityAnimation;