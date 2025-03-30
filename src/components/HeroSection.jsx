import React, { useEffect, useRef, memo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InfinityLogo from './InfinityLogo';

gsap.registerPlugin(ScrollTrigger);

const SecureRandom = {
  random() {
    if (window.crypto && window.crypto.getRandomValues) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] / (0xffffffff + 1);
    }
    return Math.random();
  },
  range(min, max) {
    return min + this.random() * (max - min);
  },
  integer(min, max) {
    return Math.floor(this.range(min, max + 1));
  },
  fromArray(array) {
    return array[this.integer(0, array.length - 1)];
  }
};

const HeroSection = memo(({ user }) => {
  const heroRef = useRef(null);
  const particlesRef = useRef(null);
  const particlesCreated = useRef(false);
  
  const createParticles = useCallback(() => {
    const particles = particlesRef.current;
    if (!particles || particlesCreated.current) return;
    
    const fragment = document.createDocumentFragment();
    const particleCount = 30; // 약간 감소
    const colors = [
      'rgba(145, 84, 247, 0.8)',
      'rgba(77, 115, 255, 0.8)',
      'rgba(236, 72, 153, 0.8)',
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      const size = SecureRandom.range(1, 4);
      const color = SecureRandom.fromArray(colors);
      const validatedSize = Math.max(1, Math.min(4, size));
      
      Object.assign(particle.style, {
        width: `${validatedSize}px`,
        height: `${validatedSize}px`,
        backgroundColor: color,
        left: `${SecureRandom.range(0, 100)}%`,
        top: `${SecureRandom.range(0, 100)}%`,
        opacity: SecureRandom.range(0.3, 0.8),
        borderRadius: '50%',
        position: 'absolute',
        filter: 'blur(1px)',
        boxShadow: `0 0 ${validatedSize * 2}px ${color}`,
        animationDuration: `${SecureRandom.range(30, 60)}s`, // 애니메이션 기간 감소
        animationDelay: `${SecureRandom.range(0, 3)}s`, // 지연 시간 감소
      });
      
      fragment.appendChild(particle);
    }
    
    particles.appendChild(fragment);
    particlesCreated.current = true;
  }, []);
  
  useEffect(() => {
    try {
      createParticles();
    } catch (error) {
      console.error('Failed to create particles:', error);
    }
    
    const ctx = gsap.context(() => {
      let titleChars;
      const titleElement = heroRef.current.querySelector('.hero-title');
      
      if (titleElement) {
        let html = '';
        const text = titleElement.innerText;
        
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            html += '<span class="char">&nbsp;</span>';
          } else {
            html += `<span class="char">${text[i]}</span>`;
          }
        }
        
        titleElement.innerHTML = html;
        titleChars = gsap.utils.toArray('.hero-title .char');
        
        gsap.set(titleChars, { opacity: 0, y: 50 });
        
        gsap.to(titleChars, {
          opacity: 1,
          y: 0,
          duration: 0.6, // 애니메이션 시간 단축
          stagger: 0.02, // 간격 감소
          ease: "back.out(1.5)", // 이징 단순화
          delay: 0.3 // 지연 시간 감소
        });
      }
      
      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 30,
        duration: 0.8, // 시간 감소
        delay: 1.2, // 지연 시간 감소
        ease: "power2.out" // 더 가벼운 이징
      });
      
      gsap.from(".hero-decoration", {
        opacity: 0,
        scale: 0,
        duration: 1,
        delay: 0.8,
        stagger: 0.15,
        ease: "back.out(1.2)" // 더 가벼운 이징
      });
      
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const parallaxBg = heroRef.current.querySelector('.parallax-bg');
          if (parallaxBg) {
            gsap.set(parallaxBg, { y: 200 * self.progress });
          }
        }
      });
    }, heroRef);
    
    return () => ctx.revert();
  }, [createParticles]);
  
  return (
    <div 
      ref={heroRef} 
      className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-[85vh] flex items-center justify-center"
    >
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden">
        <style jsx>{`
          .hero-particle {
            animation: float linear infinite;
          }
          @keyframes float {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-40px, 40px); }
            50% { transform: translate(40px, -40px); }
            75% { transform: translate(-20px, -20px); }
            100% { transform: translate(0, 0); }
          }
        `}</style>
      </div>
      
      <div className="hero-decoration absolute bottom-20 left-20 w-24 h-24 rounded-full border-2 border-purple-500/20 backdrop-blur-sm opacity-60"></div>
      <div className="hero-decoration absolute top-40 right-40 w-32 h-32 rounded-full border border-indigo-500/20 backdrop-blur-sm opacity-40"></div>
      <div className="hero-decoration absolute bottom-60 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-sm opacity-50"></div>
      
      <div className="parallax-bg absolute inset-0 -z-10">
        <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-600/10 to-indigo-600/5 rounded-full blur-3xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 bg-gradient-to-r from-indigo-600/10 to-purple-600/5 rounded-full blur-3xl -bottom-20 -right-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto z-10">
        <div className="flex flex-col items-center justify-center text-center relative z-10">
          <div className="w-full mx-auto mb-14 pt-16">
            <InfinityLogo />
          </div>
          
          <div className="max-w-2xl mx-auto text-white">
            <h1 className="hero-title text-4xl md:text-6xl font-bold mb-6 tracking-tighter">
              J-Flow DevOps 플랫폼
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
});

export default HeroSection;