import React, { useEffect, useRef, useState } from 'react';
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

function InfinityLogo() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const logosContainerRef = useRef(null);
  
  const [randomValues, setRandomValues] = useState({
    positions: [],
    animations: [],
    directions: []
  });
  
  useEffect(() => {
    setRandomValues({
      positions: createSecureRandomArray(60),
      animations: createSecureRandomArray(40),
      directions: createSecureRandomArray(40)
    });
  }, []);
  
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
    
    const getSecureRandomValue = (type, index, min = 0, max = 1) => {
      if (!randomValues[type] || randomValues[type].length === 0) return min;
      
      const value = randomValues[type][index % randomValues[type].length];
      return min + value * (max - min);
    };
    
    class Particle {
      constructor(t) {
        this.t = t;
        this.pos = getPositionOnInfinity(t);
        this.size = 1 + getSecureRandomValue('positions', t * 100, 0, 2);
        this.speed = 0.001 + getSecureRandomValue('animations', t * 100, 0, 0.003);
        this.life = 0;
        this.maxLife = 0.5 + getSecureRandomValue('animations', t * 100 + 20, 0, 1.5);
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
        
        const randOffset = getSecureRandomValue('positions', t * 100 + 40, -15, 15);
        this.color = {
          r: Math.min(255, Math.max(0, resultColor.r + randOffset)),
          g: Math.min(255, Math.max(0, resultColor.g + randOffset)),
          b: Math.min(255, Math.max(0, resultColor.b + randOffset))
        };
      }
      
      update() {
        this.t += this.speed;
        if (this.t > 1) this.t %= 1;
        
        this.pos = getPositionOnInfinity(this.t);
        
        this.life += 0.016;
        
        if (this.life < 0.3) {
          this.alpha = this.life / 0.3;
        } else if (this.life > this.maxLife - 0.3) {
          this.alpha = (this.maxLife - this.life) / 0.3;
        } else {
          this.alpha = 1;
        }
        
        return this.life < this.maxLife;
      }
      
      draw(ctx) {
        ctx.save();
        
        ctx.globalAlpha = this.alpha * 0.6;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 5;
        
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.7})`;
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    class NeonInfinity {
      constructor() {
        // 레이어 간 경계를 부드럽게 하기 위한 설정
        this.layerConfig = [
          { width: 110, opacity: 0.40, blur: 35 },
          { width: 90, opacity: 0.50, blur: 30 },
          { width: 70, opacity: 0.65, blur: 25 },
          { width: 50, opacity: 0.75, blur: 20 },
          { width: 30, opacity: 0.85, blur: 15 },
          { width: 15, opacity: 0.90, blur: 8 }
        ];
        
        this.pulsePhase = 0;
        this.pulseFactor = 0;
        
        this.colorFlowPhase = 0;
        this.time = 0;
        
        this.segmentCount = 350;
        
        this.particles = [];
        this.particleSpawnTimer = 0;
        
        this.innerGlowSize = 0;
        this.innerGlowPhase = 0;
      }
      
      update() {
        this.time += 0.016;
        
        this.colorFlowPhase += 0.001;
        
        this.pulsePhase += 0.01;
        this.pulseFactor = 0.95 + 0.05 * Math.sin(this.pulsePhase);
        
        this.innerGlowPhase += 0.02;
        this.innerGlowSize = 70 + 20 * Math.sin(this.innerGlowPhase);
        
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
        
        if (this.particleSpawnTimer > 0.2) {
          this.particleSpawnTimer = 0;
          
          const randomT = getSecureRandomValue('positions', this.time * 100, 0, 1);
          this.particles.push(new Particle(randomT));
          
          if (this.particles.length > 60) {
            this.particles.shift();
          }
        }
        
        this.particles = this.particles.filter(p => p.update());
      }
      
      draw() {
        ctx.clearRect(-width * 0.5, 0, width * 2.0, height);
        
        this.drawBackgroundGlow();
        this.drawInnerGlow();
        
        for (let i = 0; i < this.layerConfig.length; i++) {
          const layer = this.layerConfig[i];
          this.drawInfinityGlow(
            layer.width * this.pulseFactor, 
            layer.opacity, 
            layer.blur
          );
        }
        
        this.drawParticles();
      }
      
      drawBackgroundGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.7;
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        gradient.addColorStop(0, 'rgba(150, 100, 255, 0.15)');
        gradient.addColorStop(0.4, 'rgba(120, 120, 255, 0.08)');
        gradient.addColorStop(0.7, 'rgba(200, 80, 200, 0.03)');
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
        
        gradient1.addColorStop(0, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.3)`);
        gradient1.addColorStop(0.5, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.15)`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        const gradient2 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        gradient2.addColorStop(0, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.3)`);
        gradient2.addColorStop(0.5, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.15)`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.globalCompositeOperation = 'screen';
        
        ctx.fillStyle = gradient1;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10 * this.pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
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
          ctx.shadowColor = `rgba(${centerColor.r}, ${centerColor.g}, ${centerColor.b}, 1)`;
          ctx.shadowBlur = blur;
        }
        
        ctx.strokeStyle = this.createInfinityGradient(points, opacity);
        ctx.stroke();
        
        ctx.restore();
      }
      
      createInfinityGradient(points, opacity) {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        for (let i = 0; i <= 24; i++) {
          const position = i / 24;
          const color = this.getColorForPosition(position);
          
          gradient.addColorStop(position, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
        }
        
        return gradient;
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
  }, [randomValues]);

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