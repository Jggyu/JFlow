import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InfinityLogo from './InfinityLogo';

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

function HeroSection({ user }) {
  const heroRef = useRef(null);
  const particlesRef = useRef(null);
  
  useEffect(() => {
    // 파티클 배경 생성
    const createParticles = () => {
      const particles = particlesRef.current;
      const particleCount = 40;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-particle';
        
        // 랜덤 크기 설정 (1-4px)
        const size = Math.random() * 3 + 1;
        
        // 랜덤 색상 (보라색/파란색/핑크색 계열)
        const colors = [
          'rgba(145, 84, 247, 0.8)', // 보라색
          'rgba(77, 115, 255, 0.8)',  // 파란색
          'rgba(236, 72, 153, 0.8)',  // 핑크색
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // 스타일 설정
        Object.assign(particle.style, {
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.5 + 0.3,
          borderRadius: '50%',
          position: 'absolute',
          filter: 'blur(1px)',
          boxShadow: `0 0 ${size * 2}px ${color}`,
          animationDuration: `${Math.random() * 50 + 30}s`,
          animationDelay: `${Math.random() * 5}s`,
        });
        
        particles.appendChild(particle);
      }
    };
    
    // 파티클 생성
    createParticles();
    
    const ctx = gsap.context(() => {
      // 메인 타이틀 애니메이션 - 글자별로 등장
      const titleChars = gsap.utils.toArray('.hero-title .char');
      gsap.set(titleChars, { opacity: 0, y: 50 });
      
      gsap.to(titleChars, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "back.out(1.7)",
        delay: 0.5
      });
      
      // 서브타이틀 애니메이션
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 1.5,
        ease: "power3.out"
      });
      
      // 장식 요소 애니메이션
      gsap.from(".hero-decoration", {
        opacity: 0,
        scale: 0,
        duration: 1.5,
        delay: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
      });
      
      // 패럴랙스 스크롤 효과
      gsap.to(".parallax-bg", {
        y: 200,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }, heroRef);
    
    // 글자 분할 함수
    const splitText = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return;
      
      const text = element.innerText;
      let html = '';
      
      for (let i = 0; i < text.length; i++) {
        if (text[i] === ' ') {
          html += '<span class="char">&nbsp;</span>';
        } else {
          html += `<span class="char">${text[i]}</span>`;
        }
      }
      
      element.innerHTML = html;
    };
    
    // 타이틀 텍스트 분할
    splitText('.hero-title');
    
    return () => ctx.revert();
  }, []);
  
  return (
    <div 
      ref={heroRef} 
      className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center justify-center"
    >
      {/* 파티클 배경 */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
        <style jsx>{`
          .hero-particle {
            animation: float linear infinite;
          }
          @keyframes float {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-50px, 50px); }
            50% { transform: translate(50px, -50px); }
            75% { transform: translate(-25px, -25px); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      </div>
      
      {/* 장식 요소들 */}
      <div className="hero-decoration absolute bottom-20 left-20 w-24 h-24 rounded-full border-2 border-purple-500/20 backdrop-blur-sm opacity-60"></div>
      <div className="hero-decoration absolute top-40 right-40 w-32 h-32 rounded-full border border-indigo-500/20 backdrop-blur-sm opacity-40"></div>
      <div className="hero-decoration absolute bottom-60 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm opacity-50"></div>
      
      {/* 패럴랙스 배경 요소 */}
      <div className="parallax-bg absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/10 to-indigo-600/5 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/5 rounded-full blur-3xl -bottom-20 -right-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          {/* 초특급 무한대 로고 - 더 큰 컨테이너 */}
          <div className="w-full mx-auto mb-14 pt-16">
            <InfinityLogo />
          </div>
          
          <div className="max-w-2xl mx-auto text-white">
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
              J-Flow DevOps 플랫폼 test
            </h1>
            
            <p className="hero-subtitle text-lg md:text-xl text-gray-300 mb-6">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">SaaS로 제공하는 오픈소스 DevOps CI/CD 플랫폼</span>
            </p>
            
            <p className="hero-subtitle text-base text-gray-300 mb-10">
              JFlow는 실제 배포 프로세스에서 활용되는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">여러 오픈소스 도구들을 설치 없이 즉시 활용</span>할 수 있습니다. 교육, 실무 개발, 연구 프로젝트 등 다양한 목적으로 활용하며 인프라 구성 없이 핵심 업무에 집중하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;