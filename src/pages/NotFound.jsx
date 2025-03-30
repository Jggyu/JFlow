import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-20">
        <div className="glass-card rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-5xl font-bold mb-4 gradient-text">404</div>
          <h1 className="text-2xl font-semibold mb-4 text-white">페이지를 찾을 수 없습니다</h1>
          <p className="text-gray-300 mb-8">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;