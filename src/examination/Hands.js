import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Hands({ token }) {
  const location = useLocation();
  const { patientId } = location.state || {};
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://kwhcclab.com:20757/api/tests/finger?userId=${patientId}`, {
          headers: { "X-Auth-Token": token },
        });
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Error fetching hand exercise data:', error);
      }
    };

    if (patientId) fetchData();
  }, [patientId, token]);

  return (
    <div className="page-container">
      <h1>Hands Exercise</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              검사 ID: {item.id}, 터치 횟수: {item.count}, 손: {item.hand}, 검사 시간: {item.createdAt}
            </li>
          ))}
        </ul>
      ) : (
        <p>운동 데이터를 불러오는 중...</p>
      )}
    </div>
  );
}

export default Hands;
