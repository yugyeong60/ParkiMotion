import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Walking({ token }) {
  const location = useLocation();
  const { patientId } = location.state || {};
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://kwhcclab.com:20757/api/tests/gait?userId=${patientId}`, {
          headers: { "X-Auth-Token": token },
        });
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Error fetching walking exercise data:', error);
      }
    };

    if (patientId) fetchData();
  }, [patientId, token]);

  return (
    <div className="page-container">
      <h1>Walking Exercise</h1>
      {data.length > 0 ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>
              검사 ID: {item.id}, 거리: {item.distance}m, 시간: {item.time}분, 보폭: {item.stride}, 발걸음 수: {item.step}
            </li>
          ))}
        </ul>
      ) : (
        <p>운동 데이터를 불러오는 중...</p>
      )}
    </div>
  );
}

export default Walking;
