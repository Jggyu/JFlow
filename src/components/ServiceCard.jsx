import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

function ServiceCard({ service, onClick }) {
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const imgRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  
  // 통일된 JFlow 색상 테마
  const cardStyle = {
    bgGradient: 'from-purple-500/70 via-indigo-500/30 to-purple-500/70',
    bgPattern: "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239154f7' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    iconGlow: 'shadow-purple-500/50',
    borderAccent: 'from-purple-400 via-indigo-500 to-purple-400',
    particleColor: 'bg-indigo-400'
  };
  
  useEffect(() => {
    const card = cardRef.current;
    const content = contentRef.current;
    const img = imgRef.current;
    
    // 3D 효과 함수
    const handleMouseMove = (e) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // 마우스 X 위치
      const y = e.clientY - rect.top;  // 마우스 Y 위치
      
      // 카드 중심에서의 상대적 위치 (-1 ~ 1)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const percentX = (x - centerX) / centerX; // -1 ~ 1
      const percentY = (y - centerY) / centerY; // -1 ~ 1
      
      // 3D 회전 효과 
      gsap.to(card, {
        rotationY: 10 * percentX,
        rotationX: -10 * percentY, // 마우스 반대 방향으로 회전
        transformPerspective: 1000,
        duration: 0.5,
        ease: 'power1.out'
      });
      
      // 내용물 약간 이동 (패럴랙스 효과)
      gsap.to(content, {
        x: 15 * percentX,
        y: 15 * percentY,
        duration: 0.5,
        ease: 'power1.out'
      });
      
      // 이미지 약간 이동 (반대 방향으로 미묘하게)
      gsap.to(img, {
        x: -10 * percentX,
        y: -10 * percentY,
        duration: 0.5,
        ease: 'power1.out'
      });
    };
    
    // 마우스 떠날 때 원래 상태로
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
    
    // 마우스 들어올 때
    const handleMouseEnter = () => {
      setIsHovering(true);
      
      // 살짝 확대
      gsap.to(card, {
        scale: 1.03,
        duration: 0.4,
        ease: 'power1.out'
      });
    };
    
    // 이벤트 리스너 등록
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      // 클린업
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div className="relative">
      {/* 카드 */}
      <div 
        ref={cardRef}
        className="relative h-full rounded-2xl shadow-2xl transform-gpu cursor-pointer overflow-hidden transition-all duration-300 group"
        onClick={onClick}
        style={{ transformStyle: 'preserve-3d', minHeight: '350px' }} // 최소 높이 추가
      >
        {/* 배경 패턴 */}
        <div className={`absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500`}
             style={{ backgroundImage: cardStyle.bgPattern }}></div>
      
        {/* 배경 그라데이션 */}
        <div className={`absolute inset-0 bg-gradient-to-br ${cardStyle.bgGradient} opacity-80`}></div>
        
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-md"></div>
        
        {/* 테두리 그라데이션 */}
        <div className={`absolute inset-0 p-[1.5px] bg-gradient-to-br ${cardStyle.borderAccent} rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500`}></div>
        
        {/* 내부 콘텐츠 컨테이너 */}
        <div className="relative p-8 h-full flex flex-col"> {/* 패딩 증가 */}
          {/* 밝은 상단 글로우 효과 */}
          <div className="absolute top-0 left-0 w-full h-28 bg-white/5 blur-2xl rounded-full transform -translate-y-1/2"></div>
          
          {/* 콘텐츠 래퍼 (3D 효과용) */}
          <div ref={contentRef} className="relative z-10 flex-1 flex flex-col">
            {/* 아이콘 컨테이너 - 크기 증가 */}
            <div className="mx-auto mb-7 relative">
              {/* 아이콘 글로우 */}
              <div className={`absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${cardStyle.iconGlow}`}></div>
              
              {/* 아이콘 원형 배경 - 크기 증가 */}
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gray-800/80 backdrop-blur-sm border border-white/10 p-4 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <div ref={imgRef} className="relative transform-gpu transition-all duration-300">
                  <img
                    src={service.image}
                    alt={`${service.name} Logo`}
                    className="w-20 h-20 object-contain filter drop-shadow-xl" /* 아이콘 크기 증가 */
                  />
                </div>
              </div>
            </div>
            
            {/* 서비스 정보 - 크기 증가 */}
            <div className="flex-1 flex flex-col items-center mt-4">
              <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-100 to-gray-300">
                {service.name}
              </h3>
              
              <p className="text-gray-300 text-center text-base mb-6 flex-1 px-2"> {/* 텍스트 크기 증가 */}
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* 호버 시 나타나는 파티클 */}
      {isHovering && (
        <>
          {[...Array(15)].map((_, i) => ( /* 파티클 개수 증가 */
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${cardStyle.particleColor} blur-sm`} /* 파티클 크기 증가 */
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.6,
                transform: `scale(${0.5 + Math.random() * 1})`,
                animation: `floatParticle ${3 + Math.random() * 3}s linear infinite ${Math.random() * 2}s`,
              }}
            />
          ))}
        </>
      )}
      
      {/* 스타일 */}
      <style jsx>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          25% { opacity: 0.6; }
          100% { transform: translate(${Math.random() > 0.5 ? '+' : '-'}${70 + Math.random() * 120}px, ${Math.random() > 0.5 ? '+' : '-'}${70 + Math.random() * 120}px) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default ServiceCard;