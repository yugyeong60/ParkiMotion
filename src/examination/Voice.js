import React, { useState, useEffect } from 'react';

function Voice() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://kwhcclab.com:20757/api/tests/a-sound', {
          headers: { "X-Auth-Token": "your-token-here" },
        });
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="page-container">
      <h1>Voice Exercise</h1>
      <div>
        {data.length > 0 ? (
          <ul>
            {data.map((item) => (
              <li key={item.id}>
                검사 ID: {item.id}, 시간: {item.createdAt}
              </li>
            ))}
          </ul>
        ) : (
          <p>데이터를 불러오는 중...</p>
        )}
      </div>
    </div>
  );
}

export default Voice;
