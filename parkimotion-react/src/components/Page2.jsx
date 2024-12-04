import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Page2.css';
import Eyes from '../examination/Eyes';
import Hands from '../examination/Hands';
import Walking from '../examination/Walking';

function Page2({ token }) {
  const [patientId, setPatientId] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(patientId)) {
      alert('올바른 형식의 환자 ID를 입력해주세요.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`https://kwhcclab.com:20757/api/users/${patientId}`, {
        headers: { "X-Auth-Token": token },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientData(data);
      } else if (response.status === 401) {
        alert('인증에 실패했습니다. 다시 로그인해주세요.');
        navigate('/');
      } else if (response.status === 404) {
        alert('해당 환자 정보를 찾을 수 없습니다.');
      } else {
        alert(`오류가 발생했습니다. 상태 코드: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
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
      <h3 id="exercise-dashboard">Exercise Record Dashboard</h3>
      <div className="dashboard">
        {/* 왼쪽 패널 */}
        <div className="left-panel">
          <div className="avatar-container">
            <img
              src={`/img/${patientData?.gender === 'M' ? 'men.png' : 'girl.png'}`}
              alt="Patient Avatar"
              className="avatar-image"
            />
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="환자 ID 입력"
              className="search-input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              aria-label="환자 ID 입력"
            />
            <button
              className="search-button"
              onClick={handleSearch}
              aria-label="검색"
              disabled={isLoading}
            >
              {isLoading ? '⏳' : '🔍'}
            </button>
          </div>
          {patientData && (
            <div className="patient-info">
              <h3>환자 정보</h3>
              <p><strong>ID:</strong> {patientData.id}</p>
              <p><strong>이름:</strong> {patientData.name}</p>
              <p><strong>성별:</strong> {patientData.gender === 'M' ? '남성' : '여성'}</p>
              <p><strong>생년월일:</strong> {patientData.birthdate}</p>
              <p><strong>진단 연도:</strong> {patientData.diagnosis}</p>
            </div>
          )}
        </div>

        {/* 오른쪽 패널 */}
        <div className="right-panel">
          {/* 1층: 1번 컨테이너 */}
          <div className="floor" id="floor-1">
              <div className="button-container">
                <div
                  className="button-item"
                  onClick={() => handleExerciseClick('eyes')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="button-icon">👀</div>
                  <p>Eyes</p>
                </div>
                <div
                  className="button-item"
                  onClick={() => handleExerciseClick('hands')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="button-icon">✋</div>
                  <p>Hands</p>
                </div>
                <div
                  className="button-item"
                  onClick={() => handleExerciseClick('walking')}
                  role="button"
                  tabIndex={0}
                >
                  <div className="button-icon">🚶‍♂️</div>
                  <p>Walking</p>
                </div>
              </div>
          </div>

          {/* 2층: 2번과 3번 컨테이너 */}
          <div className="floor" id="floor-2">
            <div className="container-row">
              <div className="container" id="container-2">
                {patientData && (
                  <Eyes token={token} patientId={patientData.id} patientData={patientData} />
                )}
              </div>
              <div className="container" id="container-3">
                {patientData && (
                  <Hands token={token} patientId={patientData.id} patientData={patientData} />
                )}
              </div>
            </div>
          </div>

          {/* 3층: 4번 컨테이너 */}
          <div className="floor" id="floor-3">
              <p>4번 컨테이너 내용</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page2;
