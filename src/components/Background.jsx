import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import WAVES from 'vanta/dist/vanta.waves.min';

function Background() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  
  useEffect(() => {
    if (!vantaEffect.current && vantaRef.current) {
      // Vanta.js 효과 초기화
      vantaEffect.current = WAVES({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: false,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x4b0082, // 인디고 베이스 색상
        shininess: 150.00,
        waveHeight: 20.00,
        waveSpeed: 0.75,
        zoom: 0.65,
        backgroundColor: 0x0b0c23 // 그라파나 어두운 배경색
      });
      
      // DOM 요소에 CSS 클래스 추가
      if (vantaRef.current) {
        vantaRef.current.classList.add('grafana-bg-overlay');
      }
    }
    
    // 클린업 함수
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
        vantaEffect.current = null;
      }
    };
  }, []);
  
  return (
    <>
      {/* Vanta.js 배경 */}
      <div 
        ref={vantaRef} 
        className="fixed inset-0 w-full h-full z-[-1]"
      ></div>
      
      {/* 추가 그라파나 스타일 오버레이 레이어 */}
      <div className="grafana-wave-overlay fixed inset-0 z-[-1] opacity-50"></div>
      <div className="grafana-gradient-overlay fixed inset-0 z-[-1] opacity-70"></div>
    </>
  );
}

export default Background;