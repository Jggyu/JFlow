import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function InfinityLogo() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const logosContainerRef = useRef(null);
  
  useEffect(() => {
    // GSAP 애니메이션 - 서비스 로고 효과
    const logosCtx = gsap.context(() => {
      // 초기 애니메이션
      gsap.from(".service-logo", {
        y: "random(-30, 30)",
        x: "random(-30, 30)",
        opacity: 0,
        scale: 0.5,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      });
      
      // 플로팅 애니메이션
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
      
      // 장식 요소 애니메이션
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
    
    // 고해상도 디스플레이 지원 및 여백 추가
    const setupCanvas = () => {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // 컨테이너 크기 측정
      width = rect.width;
      height = 580; // 높이 조정
      
      // 캔버스 크기 설정 - 이미 HTML에서 설정된 크기 유지
      canvas.width = width * 2.0 * dpr;  // 가로 공간 확보
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      // 캔버스의 내용을 오른쪽으로 이동 (가로 중앙 정렬)
      ctx.scale(dpr, dpr);
      ctx.translate(width * 0.5, 0); // 50% 이동하여 가운데 정렬
    };
    
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    
    // 무한대 경로상의 위치 계산
    const getPositionOnInfinity = (t) => {
      const centerX = width / 2;
      const centerY = height / 2;
      
      // 화면 비율과 여백을 고려한 안전한 크기 계산
      const safeWidth = width * 0.6;
      const safeHeight = height * 0.85;
      
      const normalizedT = t % 1;
      const angle = normalizedT * Math.PI * 2;
      
      // 무한대 수식 변경
      const denominator = 0.6 + 0.4 * Math.sin(angle) * Math.sin(angle);
      
      const x = centerX + Math.cos(angle) * safeWidth * 0.9 / denominator;
      const y = centerY + Math.sin(angle) * Math.cos(angle) * safeHeight * 0.6 / denominator;
      
      return { x, y };
    };
    
    // 색상 팔레트 - 부드러운 그라데이션을 위한 확장된 색상들
    const colors = {
      // 보라색 계열
      purple: {
        light: { r: 180, g: 100, b: 255 },
        mid: { r: 150, g: 70, b: 255 },
        deep: { r: 120, g: 40, b: 255 }
      },
      // 파란색 계열
      blue: {
        light: { r: 100, g: 150, b: 255 },
        mid: { r: 80, g: 120, b: 255 },
        deep: { r: 60, g: 80, b: 255 }
      },
      // 핑크색 계열
      pink: {
        light: { r: 255, g: 130, b: 220 },
        mid: { r: 255, g: 80, b: 180 },
        deep: { r: 255, g: 50, b: 140 }
      },
      // 청록색 계열 (중간 혼합용)
      teal: {
        light: { r: 100, g: 230, b: 255 },
        mid: { r: 70, g: 200, b: 230 },
        deep: { r: 40, g: 170, b: 220 }
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
    
    // 파티클 클래스 - 더 부드러운 움직임과 줄어든 밝기
    class Particle {
      constructor(t) {
        this.t = t;
        this.pos = getPositionOnInfinity(t);
        this.size = 1 + Math.random() * 2; // 크기 감소
        this.speed = 0.001 + Math.random() * 0.003; // 속도 감소
        this.life = 0;
        this.maxLife = 0.5 + Math.random() * 1.5;
        this.alpha = 0;
        
        // 색상 설정 - t값에 따라 부드럽게 변화하는 색상
        const colorProgress = t; // 0~1 사이 값
        
        // 4가지 색상 간의 그라데이션 계산
        let resultColor;
        if (colorProgress < 0.25) {
          // 보라 -> 파랑 (0 ~ 0.25)
          resultColor = blendColors(colors.purple.mid, colors.blue.mid, colorProgress * 4);
        } else if (colorProgress < 0.5) {
          // 파랑 -> 청록 (0.25 ~ 0.5)
          resultColor = blendColors(colors.blue.mid, colors.teal.mid, (colorProgress - 0.25) * 4);
        } else if (colorProgress < 0.75) {
          // 청록 -> 핑크 (0.5 ~ 0.75)
          resultColor = blendColors(colors.teal.mid, colors.pink.mid, (colorProgress - 0.5) * 4);
        } else {
          // 핑크 -> 보라 (0.75 ~ 1.0)
          resultColor = blendColors(colors.pink.mid, colors.purple.mid, (colorProgress - 0.75) * 4);
        }
        
        // 약간의 랜덤 변화 추가
        this.color = {
          r: Math.min(255, Math.max(0, resultColor.r + Math.random() * 30 - 15)),
          g: Math.min(255, Math.max(0, resultColor.g + Math.random() * 30 - 15)),
          b: Math.min(255, Math.max(0, resultColor.b + Math.random() * 30 - 15))
        };
      }
      
      update() {
        // t 위치 업데이트
        this.t += this.speed;
        if (this.t > 1) this.t %= 1;
        
        // 새 위치 계산
        this.pos = getPositionOnInfinity(this.t);
        
        // 수명 업데이트
        this.life += 0.016;
        
        // 페이드 인/아웃
        if (this.life < 0.3) {
          this.alpha = this.life / 0.3; // 페이드 인
        } else if (this.life > this.maxLife - 0.3) {
          this.alpha = (this.maxLife - this.life) / 0.3; // 페이드 아웃
        } else {
          this.alpha = 1;
        }
        
        // 수명 체크
        return this.life < this.maxLife;
      }
      
      draw(ctx) {
        ctx.save();
        
        // 글로우 효과 - 감소된 밝기
        ctx.globalAlpha = this.alpha * 0.6; // 투명도 감소
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.shadowBlur = 5; // 블러 감소
        
        // 파티클 그리기
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.alpha * 0.7})`;
        ctx.fill();
        
        ctx.restore();
      }
    }
    
    // 네온 무한대 클래스
    class NeonInfinity {
      constructor() {
        // 네온 효과 설정
        this.outerGlowWidth = 110; // 약간 줄임
        this.midGlowWidth = 75;   // 약간 줄임
        this.mainGlowWidth = 40;  // 약간 줄임
        this.highlightWidth = 12;  // 약간 줄임
        
        // 맥동 효과 설정
        this.pulsePhase = 0;
        this.pulseFactor = 0;
        
        // 색상 흐름 위상
        this.colorFlowPhase = 0;

        // 시간 변수 추가 - 여기에 추가
        this.time = 0;
        
        // 선명한 부분의 수
        this.segmentCount = 300;
        
        // 파티클
        this.particles = [];
        this.particleSpawnTimer = 0;
        
        // 내부 글로우 효과
        this.innerGlowSize = 0;
        this.innerGlowPhase = 0;
      }
      
      update() {
        // 시간 업데이트
        this.time += 0.016;
        
        // 색상 흐름 위상
        this.colorFlowPhase += 0.002; // 속도 감소
        
        // 맥동 효과 업데이트
        this.pulsePhase += 0.01; // 속도 감소
        this.pulseFactor = 0.92 + 0.08 * Math.sin(this.pulsePhase); // 진폭 감소
        
        // 내부 글로우 효과 업데이트
        this.innerGlowPhase += 0.02; // 속도 감소
        this.innerGlowSize = 70 + 20 * Math.sin(this.innerGlowPhase); // 진폭 감소
        
        // 파티클 업데이트
        this.updateParticles();
      }
      
      // 색상 t 값에 따른 그라데이션 색상 가져오기
      getColorForPosition(t) {
        // t값에 흐름 위상을 더해 시간에 따라 색상이 이동하게 함
        const adjustedT = (t + this.colorFlowPhase) % 1;
        
        // 4가지 색상 간의 원형 그라데이션
        let resultColor;
        if (adjustedT < 0.25) {
          // 보라 -> 파랑 (0 ~ 0.25)
          resultColor = blendColors(colors.purple.mid, colors.blue.mid, adjustedT * 4);
        } else if (adjustedT < 0.5) {
          // 파랑 -> 청록 (0.25 ~ 0.5)
          resultColor = blendColors(colors.blue.mid, colors.teal.mid, (adjustedT - 0.25) * 4);
        } else if (adjustedT < 0.75) {
          // 청록 -> 핑크 (0.5 ~ 0.75)
          resultColor = blendColors(colors.teal.mid, colors.pink.mid, (adjustedT - 0.5) * 4);
        } else {
          // 핑크 -> 보라 (0.75 ~ 1.0)
          resultColor = blendColors(colors.pink.mid, colors.purple.mid, (adjustedT - 0.75) * 4);
        }
        
        return resultColor;
      }
      
      // 파티클 업데이트 - 생성 빈도 감소
      updateParticles() {
        this.particleSpawnTimer += 0.016;
        
        // 파티클 생성 빈도 감소 (0.05초 -> 0.2초마다)
        if (this.particleSpawnTimer > 0.2) {
          this.particleSpawnTimer = 0;
          
          // 랜덤 위치에 파티클 생성
          const randomT = Math.random();
          this.particles.push(new Particle(randomT));
          
          // 파티클 제한 감소 (성능을 위해)
          if (this.particles.length > 60) { // 120 -> 60으로 감소
            this.particles.shift();
          }
        }
        
        // 기존 파티클 업데이트 및 만료된 파티클 제거
        this.particles = this.particles.filter(p => p.update());
      }
      
      draw() {
        // 배경 지우기
        ctx.clearRect(-width * 0.5, 0, width * 2.0, height);
        
        // 배경 글로우 - 밝기 감소
        this.drawBackgroundGlow();
        
        // 내부 글로우 효과
        this.drawInnerGlow();
        
        // 외부 글로우
        this.drawInfinityGlow(this.outerGlowWidth * this.pulseFactor, 0.5, 35); // 불투명도 감소
        
        // 중간 글로우
        this.drawInfinityGlow(this.midGlowWidth * this.pulseFactor, 0.7, 20);
        
        // 메인 선
        this.drawInfinityGlow(this.mainGlowWidth * this.pulseFactor, 0.9, 12);
        
        // 하이라이트
        this.drawInfinityHighlight(this.highlightWidth * this.pulseFactor, 0.9, 4);
        
        // 파티클 그리기
        this.drawParticles();
      }
      
      // 배경 글로우 효과 - 밝기 감소
      drawBackgroundGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.7;
        
        const gradient = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, radius
        );
        
        // 더 약한 배경 글로우
        gradient.addColorStop(0, 'rgba(150, 100, 255, 0.15)'); // 밝기 감소
        gradient.addColorStop(0.4, 'rgba(120, 120, 255, 0.08)');
        gradient.addColorStop(0.7, 'rgba(200, 80, 200, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(-width * 0.5, 0, width * 2.0, height);
      }
      
      // 내부 글로우 효과 - 밝기 감소
      drawInnerGlow() {
        const centerX = width / 2;
        const centerY = height / 2;
        
        // 교차점 글로우 크기
        const glowSize = this.innerGlowSize;
        
        // 중앙 색상 단계적 변화
        const centerColor1 = this.getColorForPosition(0.25); // 파란색 계열
        const centerColor2 = this.getColorForPosition(0.75); // 핑크색 계열
        
        // 첫 번째 그라데이션
        const gradient1 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        gradient1.addColorStop(0, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.3)`); // 밝기 감소
        gradient1.addColorStop(0.5, `rgba(${centerColor1.r}, ${centerColor1.g}, ${centerColor1.b}, 0.15)`);
        gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // 두 번째 그라데이션
        const gradient2 = ctx.createRadialGradient(
          centerX, centerY, 0,
          centerX, centerY, glowSize
        );
        
        gradient2.addColorStop(0, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.3)`); // 밝기 감소
        gradient2.addColorStop(0.5, `rgba(${centerColor2.r}, ${centerColor2.g}, ${centerColor2.b}, 0.15)`);
        gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // 합성 모드 설정
        ctx.globalCompositeOperation = 'screen';
        
        // 그라데이션 그리기
        ctx.fillStyle = gradient1;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        ctx.fillStyle = gradient2;
        ctx.fillRect(centerX - glowSize, centerY - glowSize, glowSize * 2, glowSize * 2);
        
        // 중앙 밝은 점 - 밝기 감소
        ctx.beginPath();
        ctx.arc(centerX, centerY, 10 * this.pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'; // 밝기 감소
        ctx.fill();
        
        // 합성 모드 복원
        ctx.globalCompositeOperation = 'source-over';
      }
      
      // 무한대 글로우 효과
      drawInfinityGlow(lineWidth, opacity, blur) {
        // 전체 무한대 경로 그리기 (파라메트릭 방정식 사용)
        ctx.save();
        
        ctx.beginPath();
        
        // 첫 점 위치
        const startPos = getPositionOnInfinity(0);
        ctx.moveTo(startPos.x, startPos.y);
        
        // 색상 그라데이션용 포인트 추적
        const points = [];
        
        // 모든 점 순회하며 경로 그리기
        for (let i = 1; i <= this.segmentCount; i++) {
          const t = i / this.segmentCount;
          const pos = getPositionOnInfinity(t);
          ctx.lineTo(pos.x, pos.y);
          
          // 그라데이션용 포인트 저장
          points.push({ t, x: pos.x, y: pos.y });
        }
        
        // 경로 닫기
        ctx.lineTo(startPos.x, startPos.y);
        
        // 라인 스타일 설정
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // 블러 효과 적용하여 글로우 생성
        if (blur > 0) {
          ctx.globalAlpha = opacity;
          // 중앙 컬러 사용
          const centerColor = this.getColorForPosition(0.5);
          ctx.shadowColor = `rgba(${centerColor.r}, ${centerColor.g}, ${centerColor.b}, 1)`;
          ctx.shadowBlur = blur;
        }
        
        // 무한대 전체 그라데이션
        // 선 그라데이션 적용을 위한 캔버스 설정
        ctx.strokeStyle = this.createInfinityGradient(points, opacity);
        ctx.stroke();
        
        ctx.restore();
      }
      
      // 무한대 경로 전체에 대한 그라데이션 생성
      createInfinityGradient(points, opacity) {
        // 캔버스 전체 크기의 그라데이션 생성
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        
        // 그라데이션 단계 정의 - 전체 무한대 경로를 따라 색상 변화
        for (let i = 0; i <= 16; i++) {
          const position = i / 16;
          const color = this.getColorForPosition(position);
          
          gradient.addColorStop(position, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
        }
        
        return gradient;
      }
      
      // 하이라이트 효과 (흰색 선)
      drawInfinityHighlight(lineWidth, opacity, blur) {
        ctx.save();
        
        ctx.beginPath();
        
        // 전체 무한대 곡선 그리기
        const startPos = getPositionOnInfinity(0);
        ctx.moveTo(startPos.x, startPos.y);
        
        for (let i = 1; i <= this.segmentCount; i++) {
          const t = i / this.segmentCount;
          const pos = getPositionOnInfinity(t);
          ctx.lineTo(pos.x, pos.y);
        }
        
        // 곡선 닫기
        ctx.lineTo(startPos.x, startPos.y);
        
        // 라인 스타일 설정
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = opacity;
        ctx.shadowColor = `rgba(255, 255, 255, 1)`;
        ctx.shadowBlur = blur;
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.stroke();
        
        ctx.restore();
      }
      
      // 파티클 그리기
      drawParticles() {
        ctx.save();
        ctx.globalCompositeOperation = 'screen'; // 색상 혼합 모드
        
        // 모든 파티클 그리기
        for (const particle of this.particles) {
          particle.draw(ctx);
        }
        
        ctx.restore();
      }
    }
    
    // 네온 무한대 인스턴스 생성
    const neonInfinity = new NeonInfinity();
    
    // 애니메이션 루프
    function animate() {
      neonInfinity.update();
      neonInfinity.draw();
      
      animationId = requestAnimationFrame(animate);
    }
    
    // 애니메이션 시작
    animate();
    
    // 클린업
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
      {/* Canvas 엘리먼트 */}
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
      
      {/* 떠다니는 서비스 로고들 */}
      <div ref={logosContainerRef} className="absolute inset-0 pointer-events-none">
        {/* GitLab 아이콘 */}
        <div className="service-logo absolute" 
            style={{ top: '30%', left: '20%', width: '60px', height: '60px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-git.png" 
            alt="GitLab" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Jenkins 아이콘 */}
        <div className="service-logo absolute" 
            style={{ top: '30%', left: '80%', width: '54px', height: '54px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-jen.png" 
            alt="Jenkins" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Harbor 아이콘 */}
        <div className="service-logo absolute" 
            style={{ top: '70%', left: '20%', width: '56px', height: '56px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-har.png" 
            alt="Harbor" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* SonarQube 아이콘 */}
        <div className="service-logo absolute" 
            style={{ top: '70%', left: '80%', width: '60px', height: '60px', transform: 'translate(-50%, -50%)' }}>
          <img 
            src="/img/J-soc.png" 
            alt="SonarQube" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* Grafana 아이콘 */}
        <div className="service-logo absolute" 
            style={{ top: '50%', left: '50%', width: '54px', height: '54px', transform: 'translate(-50%, -40%)' }}>
          <img 
            src="/img/J-gra.png" 
            alt="Grafana" 
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
        
        {/* 장식 요소들 */}
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