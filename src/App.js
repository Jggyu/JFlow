import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import './styles/grafanaBackground.css'; // 그라파나 배경 스타일 임포트

function App() {
  return (
    <Router>
      {/* 그라파나 스타일 배경 - 기존 색상 + 주황빛 색상 */}
      <div className="grafana-background">
        <div className="grafana-gradient-1"></div> {/* 메인 보라색 */}
        <div className="grafana-gradient-2"></div> {/* 메인 파란색 */}
        <div className="grafana-gradient-3"></div> {/* 메인 핑크색 */}
        <div className="grafana-gradient-4"></div> {/* 주황빛 연보라색 */}
        <div className="grafana-gradient-5"></div> {/* 주황색 */}
        <div className="grafana-stars"></div>      {/* 작은 별들 */}
        <div className="grafana-big-stars"></div>  {/* 큰 별들 */}
        <div className="grafana-overlay"></div>
      </div>
      
      {/* 라우터 내용 */}
      <div className="app-content relative z-10">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* 추가 라우트는 여기에 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;