import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const navbarRef = useRef(null);
  const menuRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power3.out"
      });
      
      gsap.from(".nav-logo", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.7)"
      });
    }, navbarRef);
    
    const handleScroll = () => {
      const navbar = navbarRef.current;
      if (window.scrollY > 10) {
        navbar.classList.add('bg-white/10', 'backdrop-blur-md', 'border-b', 'border-white/10');
        navbar.classList.remove('bg-transparent');
      } else {
        navbar.classList.remove('bg-white/10', 'backdrop-blur-md', 'border-b', 'border-white/10');
        navbar.classList.add('bg-transparent');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      ctx.revert();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.3, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav 
      ref={navbarRef}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 nav-logo">
              <Link to="/" className="group">
                <img className="h-20 transform transition-transform duration-300 group-hover:scale-105" 
                     src="/img/J-logo.png" alt="J-Flow Logo" />
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* 링크 제거됨 */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-white font-medium">{user.name}님</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 border border-white/20 text-white rounded-full hover:bg-white/10 transition-all duration-200"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {/* 비활성화된 로그인 및 회원가입 버튼 */}
                <button
                  disabled
                  className="px-4 py-1.5 bg-white/5 text-white/40 rounded-full border border-white/10 backdrop-blur-sm cursor-not-allowed opacity-50"
                >
                  로그인 및 회원가입
                </button>
              </div>
            )}
          </div>
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-jflow-purple hover:bg-white/10 transition-colors duration-300 focus:outline-none"
              aria-label="Main menu"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={menuRef} 
        className={`md:hidden bg-gray-900/80 backdrop-blur-md border-b border-jflow-purple/20 overflow-hidden transition-all duration-300 ${isOpen ? '' : 'h-0 opacity-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {/* 링크 제거됨 */}
        </div>
        <div className="pt-4 pb-3 border-t border-white/10">
          {user ? (
            <div className="px-2 space-y-1">
              <div className="px-3 py-2 text-base font-medium text-white">
                {user.name}님
              </div>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="px-2 py-2">
              {/* 비활성화된 모바일 로그인 및 회원가입 버튼 */}
              <button
                disabled
                className="w-full px-3 py-2 bg-white/5 text-white/40 rounded-md cursor-not-allowed opacity-50"
              >
                로그인 및 회원가입
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;