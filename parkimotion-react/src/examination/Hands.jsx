import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function Hands({ token, setData }) {
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

      try {
        const response = await fetch(`https://kwhcclab.com:20757/api/tests/finger?userId=${patientId}`, {
          headers: { 'X-Auth-Token': token },
        });
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Error fetching hand exercise data:', error);
      }
    };

    if (patientId) fetchData();
  }, [patientId, token, navigate, setData]);

  return (
    <div>
      <h1>Hands Exercise</h1>
      <button onClick={() => navigate('/result')}>결과 보기</button>
    </div>
  );
}

export default Hands;
