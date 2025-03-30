import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function InfinityLogo() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const logosContainerRef = useRef(null);
  
  useEffect(() => {
    // GSAP 애니메이션 - 서비스 로고 효과
    const logosCtx = gsap.context(() => {
      gsap.from(".service-logo", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        opacity: 0,
        scale: 0.5,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
      
      gsap.to(".service-logo", {
        y: "random(-15, 15)",
        x: "random(-8, 8)",
        rotation: "random(-10, 10)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2
      });
      
      gsap.to(".decoration-element", {
        rotate: "random(-5, 5)",
        scale: "random(0.95, 1.05)",
        duration: "random(5, 8)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3
      });
    }, logosContainerRef);
    
    // Canvas 설정
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;
    
    // 캔버스 설정
    const setupCanvas = () => {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      width = rect.width;
      height = 580;
      
      canvas.width = width * 2.0 * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      ctx.scale(dpr, dpr);
      ctx.translate(width * 0.5, 0);
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    // 무한대 경로상의 위치 계산
    const getPositionOnInfinity = (t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      const safeWidth = width * 0.6;
      const safeHeight = height * 0.85;
      
      const normalizedT = t % 1;
      const angle = normalizedT * Math.PI * 2;
      
      // 무한대 수식 - 더 부드러운 곡선을 위해 계수 조정
      const denominator = 0.65 + 0.35 * Math.sin(angle) * Math.sin(angle);
      
      const x = centerX + Math.cos(angle) * safeWidth * 0.9 / denominator;
      const y = centerY + Math.sin(angle) * Math.cos(angle) * safeHeight * 0.6 / denominator;
      
      return { x, y };
    };
    
    // 색상 팔레트 - 색상 간 더 부드러운 그라데이션을 위해 색상 범위 확장
    const colors = {
      purple: {
        light: { r: 190, g: 110, b: 255 },
        mid: { r: 150, g: 70, b: 255 },
        deep: { r: 120, g: 40, b: 255 }
      },
      blue: {
        light: { r: 110, g: 160, b: 255 },
        mid: { r: 80, g: 120, b: 255 },
        deep: { r: 60, g: 80, b: 255 }
      },
      pink: {
        light: { r: 255, g: 140, b: 220 },
        mid: { r: 255, g: 90, b: 180 },
        deep: { r: 255, g: 60, b: 140 }
      },
      teal: {
        light: { r: 110, g: 240, b: 255 },
        mid: { r: 80, g: 210, b: 230 },
        deep: { r: 50, g: 180, b: 220 }
      }
    };
    
    // 색상 블렌딩 함수
    const blendColors = (color1, color2, ratio) => {
      return {
        r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
        g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
        b: Math.round(color1.b * (1 - ratio) + color2.b * ratio)
      };
    };
    
    // 파티클 클래스 - 더 부드러운 트랜지션을 위해 알파 조정
    class Particle {
      constructor(t) {
        this.t = t;
        this.pos = getPositionOnInfinity(t);
        this.size = 0.8 + Math.random() * 1.8; // 더 작은 파티클
        this.speed = 0.0008 + Math.random() * 0.0025; // 속도 감소
        this.life = 0;
        this.maxLife = 0.6 + Math.random() * 1.8;
        this.alpha = 0;
        
        const colorProgress = t;
        
        let resultColor;
        if (colorProgress < 0.25) {
          resultColor = blendColors(colors.purple.mid, colors.blue.mid, colorProgress * 4);
        } else if (colorProgress < 0.5) {
          resultColor = blendColors(colors.blue.mid, colors.teal.mid, (colorProgress - 0.25) * 4);
        } else if (colorProgress < 0.75) {
          resultColor = blendColors(colors.teal.mid, colors.pink.mid, (colorProgress - 0.5) * 4);
        } else {
          resultColor = blendColors(colors.pink.mid, colors.purple.mid, (colorProgress - 0.75) * 4);
        }
        
        this.color = {
          r: Math.min(255, Math.max(0, resultColor.r + Math.random() * 20 - 10)),
          g: Math.min(255, Math.max(0, resultColor.g + Math.random() * 20 - 10)),
          b: Math.min(255, Math.max(0, resultColor.b + Math.random() * 20 - 10))
        };
      }
      
      update() {
        this.t += this.speed;
        if (this.t > 1) this.t %= 1;
        
        this.pos = getPositionOnInfinity(this.t);
        
        this.life += 0.016;
        
        // 더 부드러운 페이드 인/아웃
        if (this.life < 0.4) {
          this.alpha = this.life / 0.4; // 더 긴 페이드 인
        } else if (this.life > this.maxLife - 0.4) {
          this.alpha = (this.maxLife - this.life) / 0.4; // 더 긴 페이드 아웃
        } else {
          this.alpha = 1;
        }
        
        return this.life < this.maxLife;
      }
      
      draw(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha * 0.5; // 투명도 감소
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 8; // 더 큰 블러
        
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.6})`;
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // 네온 무한대 클래스
    class NeonInfinity {
      constructor() {
        // 레이어 간의 차이를 더 점진적으로 변경
        this.outerGlowWidth = 105;
        this.midGlowWidth = 80;
        this.mainGlowWidth = 52;
        this.highlightWidth = 15;
        
        this.pulsePhase = 0;
        this.pulseFactor = 0;
        
        this.colorFlowPhase = 0;
        this.time = 0;
        
        // 더 많은 세그먼트로 부드러운 곡선
        this.segmentCount = 400;
        
        this.particles = [];
        this.particleSpawnTimer = 0;
        
        this.innerGlowSize = 0;
        this.innerGlowPhase = 0;
      }
      
      update() {
        this.time += 0.016;
        
        this.colorFlowPhase += 0.001; // 더 느린 색상 변화
        
        this.pulsePhase += 0.008;
        this.pulseFactor = 0.94 + 0.06 * Math.sin(this.pulsePhase); // 맥동 효과 감소
        
        this.innerGlowPhase += 0.015;
        this.innerGlowSize = 70 + 15 * Math.sin(this.innerGlowPhase);
        
        this.updateParticles();
      }
      
      getColorForPosition(t) {
        const adjustedT = (t + this.colorFlowPhase) % 1;
        
        let resultColor;
        if (adjustedT < 0.25) {
          resultColor = blendColors(colors.purple.mid, colors.blue.mid, adjustedT * 4);
        } else if (adjustedT < 0.5) {
          resultColor = blendColors(colors.blue.mid, colors.teal.mid, (adjustedT - 0.25) * 4);
        } else if (adjustedT < 0.75) {
          resultColor = blendColors(colors.teal.mid, colors.pink.mid, (adjustedT - 0.5) * 4);
        } else {
          resultColor = blendColors(colors.pink.mid, colors.purple.mid, (adjustedT - 0.75) * 4);
        }
        
        return resultColor;
      }
      
      updateParticles() {
        this.particleSpawnTimer += 0.016;
        
        if (this.particleSpawnTimer > 0.25) {
          this.particleSpawnTimer = 0;
          
          const randomT = Math.random();
          this.particles.push(new Particle(randomT));
          
          if (this.particles.length > 50) {
            this.particles.shift();
          }
        }
        
        this.particles = this.particles.filter(p => p.update());
      }
      
      draw() {
        ctx.clearRect(-width * 0.5, 0, width * 2.0, height);
        
        this.drawBackgroundGlow();
        this.drawInnerGlow();
        
        // 레이어 간의 블러와 투명도 차이를 더 점진적으로 변경
        // 외부 글로우 - 더 넓은 블러, 더 낮은 투명도
        this.drawInfinityGlow(this.outerGlowWidth * this.pulseFactor, 0.4, 45);
        
        // 중간 글로우 - 중간 블러와 투명도
        this.drawInfinityGlow(this.midGlowWidth * this.pulseFactor, 0.6, 30);
        
        // 메인 선 - 낮은 블러, 높은 투명도
        this.drawInfinityGlow(this.mainGlowWidth * this.pulseFactor, 0.8, 20);
        
        // 하이라이트 - 매우 낮은 블러, 가장 높은 투명도
        this.drawInfinityHighlight(this.highlightWidth * this.pulseFactor, 0.85, 8);
        
        this.drawParticles();
      }
      
      drawBackgroundGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.8;
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        // 더 부드러운 배경 글로우
        gradient.addColorStop(0, 'rgba(150, 100, 255, 0.12)');
        gradient.addColorStop(0.3, 'rgba(120, 120, 255, 0.06)');
        gradient.addColorStop(0.6, 'rgba(200, 80, 200, 0.02)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-width * 0.5, 0, width * 2.0, height);
      }
      
      drawInnerGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        const glowSize = this.innerGlowSize;
        
        const centerColor1 = this.getColorForPosition(0.25);
        const centerColor2 = this.getColorForPosition(0.75);
        
        // 첫 번째 그라데이션 - 더 부드러운 트랜지션
        const gradient1 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        gradient1.addColorStop(0, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.25)`);
        gradient1.addColorStop(0.4, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.12)`);
        gradient1.addColorStop(0.8, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.05)`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // 두 번째 그라데이션 - 더 부드러운 트랜지션
        const gradient2 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        gradient2.addColorStop(0, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.25)`);
        gradient2.addColorStop(0.4, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.12)`);
        gradient2.addColorStop(0.8, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.05)`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalCompositeOperation = 'screen';
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        // 중앙 밝은 점 - 부드러운 글로우 효과 추가
        ctx.beginPath();
        ctx.arc(centerX, centerY, 12 * this.pulseFactor, 0, Math.PI * 2);
        const centerGradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, 12 * this.pulseFactor
        );
        centerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        centerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        centerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = centerGradient;
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
      }
      
      drawInfinityGlow(lineWidth, opacity, blur) {
        ctx.save();
        
        ctx.beginPath();
        
        const startPos = getPositionOnInfinity(0);
        ctx.moveTo(startPos.x, startPos.y);
        
        const points = [];
        
        // 더 많은 세그먼트로 부드러운 곡선
        for (let i = 1; i <= this.segmentCount; i++) {
          const t = i / this.segmentCount;
          const pos = getPositionOnInfinity(t);
          ctx.lineTo(pos.x, pos.y);
          
          points.push({ t, x: pos.x, y: pos.y });
        }
        
        ctx.lineTo(startPos.x, startPos.y);
        
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (blur > 0) {
          ctx.globalAlpha = opacity;
          const centerColor = this.getColorForPosition(0.5);
          ctx.shadowColor = `rgba(${centerColor.r}, ${centerColor.g}, ${centerColor.b}, 1)`;
          ctx.shadowBlur = blur;
        }
        
        ctx.strokeStyle = this.createInfinityGradient(points, opacity);
        ctx.stroke();
        
        ctx.restore();
      }
      
      createInfinityGradient(points, opacity) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        // 더 많은 색상 스텝으로 부드러운 그라데이션
        for (let i = 0; i <= 24; i++) {
          const position = i / 24;
          const color = this.getColorForPosition(position);
          
          gradient.addColorStop(position, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
        }
        
        return gradient;
      }
      
      drawInfinityHighlight(lineWidth, opacity, blur) {
        ctx.save();
        
        ctx.beginPath();
        
        const startPos = getPositionOnInfinity(0);
        ctx.moveTo(startPos.x, startPos.y);
        
        for (let i = 1; i <= this.segmentCount; i++) {
          const t = i / this.segmentCount;
          const pos = getPositionOnInfinity(t);
          ctx.lineTo(pos.x, pos.y);
        }
        
        ctx.lineTo(startPos.x, startPos.y);
        
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = opacity;
        
        // 하이라이트에 그라데이션 적용
        const highlightGradient = ctx.createLinearGradient(0, 0, width, height);
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
        highlightGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.8)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0.9)');
        
        ctx.shadowColor = `rgba(255, 255, 255, 1)`;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = highlightGradient;
        ctx.stroke();
        
        ctx.restore();
      }
      
      drawParticles() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        
        for (const particle of this.particles) {
          particle.draw(ctx);
        }
        
        ctx.restore();
      }
    }
    
    const neonInfinity = new NeonInfinity();
    
    function animate() {
      neonInfinity.update();
      neonInfinity.draw();
      
      animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setupCanvas);
      cancelAnimationFrame(animationId);
      logosCtx.revert();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[580px] flex justify-center items-center overflow-hidden"
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      <div ref={logosContainerRef} className="absolute inset-0 pointer-events-none">
        <div className="service-logo absolute" 
            style={{ top: '30%', left: '20%', width: '60px', height: '60px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-git.png" 
            alt="GitLab" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        <div className="service-logo absolute" 
            style={{ top: '30%', left: '80%', width: '54px', height: '54px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-jen.png" 
            alt="Jenkins" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        <div className="service-logo absolute" 
            style={{ top: '70%', left: '20%', width: '56px', height: '56px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-har.png" 
            alt="Harbor" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        <div className="service-logo absolute" 
            style={{ top: '70%', left: '80%', width: '60px', height: '60px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-soc.png" 
            alt="SonarQube" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        <div className="service-logo absolute" 
            style={{ top: '50%', left: '50%', width: '54px', height: '54px', transform: 'translate(-50%, -40%)' }}>
          <img 
            src="/img/J-gra.png" 
            alt="Grafana" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        <div className="decoration-element absolute top-1/2 left-1/2 w-64 h-64 rounded-full border-2 border-dashed border-purple-400/20 opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="decoration-element absolute top-1/2 left-1/2 w-96 h-96 rounded-full border border-purple-500/10 opacity-50 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="decoration-element absolute" style={{ top: '35%', left: '70%', width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(138, 43, 226, 0.3)' }}></div>
        <div className="decoration-element absolute" style={{ top: '65%', left: '30%', width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(106, 90, 205, 0.3)' }}></div>
        <div className="decoration-element absolute" style={{ top: '25%', left: '40%', width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255, 100, 150, 0.25)' }}></div>
        <div className="decoration-element absolute" style={{ top: '75%', left: '60%', width: '14px', height: '14px', borderRadius: '50%', background: 'rgba(100, 150, 255, 0.25)' }}></div>
      </div>
    </div>
  );
}

export default InfinityLogo;