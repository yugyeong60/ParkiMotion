import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page2.css';

function Page2({ token }) {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!token) {
      alert('인증이 필요합니다. 다시 로그인해주세요.');
      navigate('/');
      return;
    }

    if (!patientId.trim()) {
      alert('환자 ID를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`https://kwhcclab.com:20757/api/users/${patientId}`, {
        headers: { "X-Auth-Token": token },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientData(data); // 환자 데이터 저장
      } else if (response.status === 401) {
        alert('인증에 실패했습니다. 다시 로그인해주세요.');
        navigate('/');
      } else {
        alert('환자 정보를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('데이터를 불러오는 중 오류가 발생했습니다.');
    }
  };

  const handleExerciseClick = (exercise) => {
    if (patientData) {
      navigate(`/${exercise}`, { state: { patientId, patientData } });
    } else {
      alert('먼저 환자 정보를 검색해주세요.');
    }
  };

  return (
    <div className="page2-container">
      <h1>Exercise Record Search</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="환자 ID를 입력해주세요"
          className="search-input"
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          <span role="img" aria-label="search">🔍</span>
        </button>
      </div>

      {patientData && (
        <div className="patient-info">
          <h2>환자 정보</h2>
          <p><strong>ID:</strong> {patientData.id}</p>
          <p><strong>이름:</strong> {patientData.name}</p>
          <p><strong>성별:</strong> {patientData.gender === 'M' ? '남성' : '여성'}</p>
          <p><strong>생년월일:</strong> {patientData.birthdate}</p>
          <p><strong>진단 연도:</strong> {patientData.diagnosis}</p>
        </div>
      )}

      <div className="button-container">
        <div className="button-item" onClick={() => handleExerciseClick('eyes')}>
          <div className="button-icon">👀</div>
          <p>Eyes</p>
        </div>
        <div className="button-item" onClick={() => handleExerciseClick('hands')}>
          <div className="button-icon">✋</div>
          <p>Hands</p>
        </div>
        <div className="button-item" onClick={() => handleExerciseClick('walking')}>
          <div className="button-icon">🚶‍♂️</div>
          <p>Walking</p>
        </div>
      </div>
    </div>
  );
}

export default Page2;
