import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

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
  }
};

function InfinityLogo() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const logosContainerRef = useRef(null);
  
  useEffect(() => {
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
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;
    let width, height;
    
    const setupCanvas = () => {
      const container = containerRef.current;
      if (!container) return;
      
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
    
    const getPositionOnInfinity = (t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      const safeWidth = width * 0.6;
      const safeHeight = height * 0.85;
      
      const normalizedT = t % 1;
      const angle = normalizedT * Math.PI * 2;
      
      const denominator = 0.6 + 0.4 * Math.sin(angle) * Math.sin(angle);
      
      const x = centerX + Math.cos(angle) * safeWidth * 0.9 / denominator;
      const y = centerY + Math.sin(angle) * Math.cos(angle) * safeHeight * 0.6 / denominator;
      
      return { x, y };
    };
    
    const colors = {
      purple: {
        light: { r: 180, g: 100, b: 255 },
        mid: { r: 150, g: 70, b: 255 },
        deep: { r: 120, g: 40, b: 255 }
      },
      blue: {
        light: { r: 100, g: 150, b: 255 },
        mid: { r: 80, g: 120, b: 255 },
        deep: { r: 60, g: 80, b: 255 }
      },
      pink: {
        light: { r: 255, g: 130, b: 220 },
        mid: { r: 255, g: 80, b: 180 },
        deep: { r: 255, g: 50, b: 140 }
      },
      teal: {
        light: { r: 100, g: 230, b: 255 },
        mid: { r: 70, g: 200, b: 230 },
        deep: { r: 40, g: 170, b: 220 }
      }
    };
    
    const blendColors = (color1, color2, ratio) => {
      return {
        r: Math.round(color1.r * (1 - ratio) + color2.r * ratio),
        g: Math.round(color1.g * (1 - ratio) + color2.g * ratio),
        b: Math.round(color1.b * (1 - ratio) + color2.b * ratio)
      };
    };
    
    class Particle {
      constructor(t) {
        this.t = t;
        this.pos = getPositionOnInfinity(t);
        this.size = 1 + SecureRandom.range(0, 3); // 파티클 크기 다양화
        this.speed = 0.0005 + SecureRandom.range(0, 0.002); // 속도 감소
        this.life = 0;
        this.maxLife = 1.0 + SecureRandom.range(0, 2.0); // 수명 늘림
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
        
        const variance = SecureRandom.range(-20, 20);
        this.color = {
          r: Math.min(255, Math.max(0, resultColor.r + variance)),
          g: Math.min(255, Math.max(0, resultColor.g + variance)),
          b: Math.min(255, Math.max(0, resultColor.b + variance))
        };
      }
      
      update() {
        this.t += this.speed;
        if (this.t > 1) this.t %= 1;
        
        this.pos = getPositionOnInfinity(this.t);
        
        this.life += 0.016;
        
        if (this.life < 0.4) {
          this.alpha = (this.life / 0.4) * (this.life / 0.4); // 이지잉 적용
        } else if (this.life > this.maxLife - 0.4) {
          this.alpha = ((this.maxLife - this.life) / 0.4) * ((this.maxLife - this.life) / 0.4);
        } else {
          this.alpha = 1;
        }
        
        return this.life < this.maxLife;
      }
      
      draw(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha * 0.45; // 투명도 감소
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 8; // 블러 증가
        
        ctx.beginPath();
        
        // 원형 대신 가우시안 형태의 그라데이션으로 파티클 그리기
        const gradient = ctx.createRadialGradient(
          this.pos.x, this.pos.y, 0,
          this.pos.x, this.pos.y, this.size * 2
        );
        
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.3})`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.arc(this.pos.x, this.pos.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    class NeonInfinity {
      constructor() {
        this.outerGlowWidth = 80; // 너비 축소
        this.midGlowWidth = 50; // 너비 축소
        this.mainGlowWidth = 28; // 너비 축소
        this.highlightWidth = 8; // 너비 축소
        
        this.pulsePhase = 0;
        this.pulseFactor = 0;
        
        this.colorFlowPhase = 0;
        
        this.time = 0;
        
        this.segmentCount = 400; // 세그먼트 증가
        
        this.particles = [];
        this.particleSpawnTimer = 0;
        
        this.innerGlowSize = 0;
        this.innerGlowPhase = 0;
      }
      
      update() {
        this.time += 0.016;
        
        this.colorFlowPhase += 0.001; // 속도 감소
        
        this.pulsePhase += 0.008; // 맥동 속도 감소
        this.pulseFactor = 0.94 + 0.06 * Math.sin(this.pulsePhase); // 맥동 범위 감소
        
        this.innerGlowPhase += 0.015; // 내부 글로우 속도 감소
        this.innerGlowSize = 80 + 15 * Math.sin(this.innerGlowPhase); // 내부 글로우 크기 증가
        
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
        
        if (this.particleSpawnTimer > 0.15) { // 파티클 생성 간격 감소
          this.particleSpawnTimer = 0;
          
          const randomT = SecureRandom.random();
          this.particles.push(new Particle(randomT));
          
          if (this.particles.length > 80) { // 파티클 최대 개수 증가
            this.particles.shift();
          }
        }
        
        this.particles = this.particles.filter(p => p.update());
      }
      
      draw() {
        ctx.clearRect(-width * 0.5, 0, width * 2.0, height);
        
        this.drawBackgroundGlow();
        
        this.drawInnerGlow();
        
        this.drawInfinityGlow(this.outerGlowWidth * this.pulseFactor, 0.3, 45); // 투명도 감소, 블러 증가
        
        this.drawInfinityGlow(this.midGlowWidth * this.pulseFactor, 0.5, 25); // 투명도 감소, 블러 증가
        
        this.drawInfinityGlow(this.mainGlowWidth * this.pulseFactor, 0.7, 15); // 투명도 감소, 블러 증가
        
        this.drawInfinityHighlight(this.highlightWidth * this.pulseFactor, 0.7, 6); // 투명도 감소, 블러 증가
        
        this.drawParticles();
      }
      
      drawBackgroundGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.85; // 반경 증가
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        // 더 부드러운 그라데이션을 위한 중간 단계 추가
        gradient.addColorStop(0, 'rgba(150, 100, 255, 0.12)');
        gradient.addColorStop(0.2, 'rgba(140, 110, 255, 0.10)');
        gradient.addColorStop(0.4, 'rgba(120, 120, 255, 0.06)');
        gradient.addColorStop(0.6, 'rgba(180, 100, 220, 0.04)');
        gradient.addColorStop(0.8, 'rgba(200, 80, 200, 0.02)');
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
        
        const gradient1 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        // 더 부드러운 그라데이션
        gradient1.addColorStop(0, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.25)`);
        gradient1.addColorStop(0.3, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.15)`);
        gradient1.addColorStop(0.6, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.08)`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        const gradient2 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        // 더 부드러운 그라데이션
        gradient2.addColorStop(0, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.25)`);
        gradient2.addColorStop(0.3, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.15)`);
        gradient2.addColorStop(0.6, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.08)`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalCompositeOperation = 'screen';
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8 * this.pulseFactor, 0, Math.PI * 2); // 크기 감소
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // 투명도 감소
        ctx.fill();
        
        ctx.globalCompositeOperation = 'source-over';
      }
      
      drawInfinityGlow(lineWidth, opacity, blur) {
        ctx.save();
        
        ctx.beginPath();
        
        const startPos = getPositionOnInfinity(0);
        ctx.moveTo(startPos.x, startPos.y);
        
        const points = [];
        
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
          ctx.shadowColor = `rgba(${centerColor.r}, ${centerColor.g}, ${centerColor.b}, 0.8)`; // 투명도 감소
          ctx.shadowBlur = blur;
        }
        
        ctx.strokeStyle = this.createInfinityGradient(points, opacity);
        ctx.stroke();
        
        ctx.restore();
      }
      
      createInfinityGradient(points, opacity) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        // 더 많은 색상 단계 추가
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
        ctx.shadowColor = `rgba(255, 255, 255, 0.8)`; // 투명도 감소
        ctx.shadowBlur = blur;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
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