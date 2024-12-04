import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Eyes({ token, patientId }) {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://kwhcclab.com:20757/api/tests/quick-blink?userId=${patientId}`, {
          headers: { "X-Auth-Token": token },
        });
        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error('Error fetching eye exercise data:', error);
      }
    };

    if (patientId) fetchData();
  }, [patientId, token]);

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => a.timeAfterTakingMedicine - b.timeAfterTakingMedicine);

      const timeAfterMedicine = sortedData.map(item => item.timeAfterTakingMedicine);
      const blinkCounts = sortedData.map(item => item.count);

      setChartData({
        labels: timeAfterMedicine,
        datasets: [
          {
            label: '깜빡임 횟수',
            data: blinkCounts,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="page-container">
      {data.length > 0 ? (
        <div style={{ width: '300px', height: '100%' }}>
          <Line
  data={chartData}
  options={{
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: '약 먹은 뒤 지난 시간(분)',
          font: { size: 9 },
        },
        ticks: {
          stepSize: 10,
          font: { size: 9 },
        },
      },
      y: {
        title: {
          display: true,
          text: '깜빡임 횟수',
          font: { size: 9 },
        },
        ticks: {
          font: { size: 9 },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false, // 범례 제거
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        bodyFont: { size: 10 },
        titleFont: { size: 12 },
      },
    },
  }}
/>
        </div>
      ) : (
        <p>운동 데이터를 불러오는 중...</p>
      )}
    </div>
  );
}

export default Eyes;
