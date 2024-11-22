import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Page1.css';

function Page1({ setToken }) {
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      const response = await fetch('https://kwhcclab.com:20757/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'admin',
          birthdate: '1111-11-11',
          password: 'snuhkwu2023',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token); // 토큰 저장
        alert('로그인 성공: ' + data.token);
        navigate('/page2'); // Page2로 이동
      } else {
        alert('로그인 실패: 서버 응답 오류');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('서버 연결 오류: 다시 시도해주세요.');
    }
  };

  return (
    <div className="page1-container">
      <div className="info-card">
        <h1>ParkiMotion</h1>
        <button onClick={handleConnect} className="connect-button">Connect</button>
      </div>
    </div>
  );
}

export default Page1;
