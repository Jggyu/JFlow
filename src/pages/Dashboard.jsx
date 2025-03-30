import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  CogIcon, 
  CloudIcon,
  ChartBarSquareIcon,
  CodeBracketSquareIcon,
  CircleStackIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServiceCard from '../components/ServiceCard';
import ProcessDiagram from '../components/ProcessDiagram';

gsap.registerPlugin(ScrollTrigger);

const ALLOWED_SERVICES = [
  '/j-gitlab',
  '/j-jenkins',
  '/j-harbor',
  '/j-sonarqube',
  '/j-grafana'
];

const services = [
  { 
    name: 'GitLab', 
    icon: CodeBracketSquareIcon, 
    status: '정상',
    description: '버전 관리와 협업을 위한 통합 개발 플랫폼',
    image: '/img/J-git.png',
    path: '/j-gitlab',
  },
  { 
    name: 'Jenkins', 
    icon: CogIcon, 
    status: '정상', 
    description: 'CI/CD 파이프라인을 통한 자동화된 빌드, 배포 서비스',
    image: '/img/J-jen.png',
    path: '/j-jenkins',
  },
  { 
    name: 'Harbor', 
    icon: CloudIcon, 
    status: '정상',
    description: '안전하고 효율적인 컨테이너 이미지 저장 및 관리',
    image: '/img/J-har.png',
    path: '/j-harbor',
  },
  { 
    name: 'SonarQube', 
    icon: CircleStackIcon, 
    status: '정상',
    description: '지속적인 코드 품질 관리 및 보안 취약점 분석',
    image: '/img/J-soc.png',
    path: '/j-sonarqube',
  },
  { 
    name: 'Grafana', 
    icon: ChartBarSquareIcon, 
    status: '정상',
    description: '실시간 모니터링 및 데이터 시각화 도구',
    image: '/img/J-gra.png',
    path: '/j-grafana',
  },
];

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const servicesRef = useRef(null);
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr && token) {
      try {
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);
        
        // 백엔드 연동 토큰 검증
        // validateToken(token);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    const ctx = gsap.context(() => {
      gsap.from(".services-title", {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      });
      
      const serviceCards = servicesRef.current.querySelectorAll('.service-card');
      gsap.from(serviceCards, {
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "back.out(1.5)"
      });
    });
    
    return () => ctx.revert();
  }, []);

  const validateToken = async (token) => {
    try {
      setLoading(true);
      // 백엔드 API 
      // const response = await fetch('/api/auth/validate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${token}`
      //   }
      // });
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const handleServiceClick = (path) => {
    if (!ALLOWED_SERVICES.includes(path)) {
      navigate('/404');
      return;
    }
    
    if (!user) {
      const tl = gsap.timeline();
      tl.to('.login-alert', {
        autoAlpha: 1, 
        y: 0, 
        duration: 0.3,
        ease: "power3.out"
      });
      
      tl.to('.login-alert', {
        autoAlpha: 0,
        y: -20,
        delay: 3,
        duration: 0.3,
        ease: "power3.in"
      });
      
      return;
    }
    
    navigate(path);
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-10">
        <Navbar user={user} />
        
        <div className="login-alert fixed top-20 left-1/2 transform -translate-x-1/2 -translate-y-full bg-jflow-purple text-white px-6 py-4 rounded-lg shadow-2xl z-50 opacity-0 invisible flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          <span>서비스 이용을 위해 로그인이 필요합니다.</span>
        </div>
        
        <HeroSection user={user} />
        
        <ProcessDiagram />
        
        <section id="services-section" ref={servicesRef} className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="services-title inline-block text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-400 bg-[length:200%_auto] text-transparent bg-clip-text">
              서비스 소개
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              J-Flow 통합 플랫폼에서 제공하는 모든 서비스를 이용해보세요. 
              DevOps 워크플로우를 완성하기 위한 최고의 도구들을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
            {services.map((service) => (
              <div key={service.name} className="service-card h-full">
                <ServiceCard 
                  service={service}
                  onClick={() => handleServiceClick(service.path)}
                />
              </div>
            ))}
          </div>
        </section>
        
        <footer className="bg-gray-900 py-10 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <img src="/img/J-logo.png" alt="J-Flow Logo" className="h-10" />
              </div>
              <div className="text-center md:text-right">
                <p className="text-gray-300">© 2025 J-Flow Platform</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;