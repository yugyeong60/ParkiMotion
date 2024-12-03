import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Eyes({ token, setData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        alert('인증이 필요합니다.');
        navigate('/');
        return;
      }

      if (!patientId) {
        alert('환자 ID가 없습니다.');
        navigate('/page2');
        return;
      }

      try {
        const response = await fetch(`https://kwhcclab.com:20757/api/tests/quick-blink?userId=${patientId}`, {
          headers: { 'X-Auth-Token': token },
        });

        if (!response.ok) {
          alert(`API 호출 실패: ${response.status}`);
          return;
        }

        const result = await response.json();
        if (result && result.data) {
          setData(result.data);
        } else {
          alert('눈 검사 데이터를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('Error fetching eye exercise data:', error);
        alert('데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [patientId, token, navigate, setData]);

  return (
    <div>
      <h1>Eyes Exercise</h1>
      <p>눈 검사 데이터를 가져오는 중...</p>
    </div>
  );
}

export default Eyes;
