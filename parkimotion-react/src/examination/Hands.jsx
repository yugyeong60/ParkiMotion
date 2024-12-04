import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

// Chart.js 등록 (LinearScale 사용)
ChartJS.register(LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function Hands({ token, patientId, patientData }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!patientId) {
        alert('환자 정보가 없습니다.');
        return;
      }

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

  // 데이터가 있을 경우 왼손과 오른손으로 데이터를 분리하고 시간순으로 정렬
  const leftHandData = data.filter(item => item.hand === 'L').sort((a, b) => a.timeAfterTakingMedicine - b.timeAfterTakingMedicine);
  const rightHandData = data.filter(item => item.hand === 'R').sort((a, b) => a.timeAfterTakingMedicine - b.timeAfterTakingMedicine);

  // 두 손의 모든 시간에 대한 유니크한 리스트
  const allTimeLabels = [
    ...new Set([
      ...leftHandData.map(item => item.timeAfterTakingMedicine),
      ...rightHandData.map(item => item.timeAfterTakingMedicine),
    ]),
  ].sort((a, b) => a - b); // 시간 순으로 정렬

  // 각 시간대에 해당하는 터치 횟수 데이터를 생성 (각 손에 대해)
  const leftHandCounts = [];
  const rightHandCounts = [];

  allTimeLabels.forEach((time) => {
    const leftDataAtTime = leftHandData.find(item => item.timeAfterTakingMedicine === time);
    const rightDataAtTime = rightHandData.find(item => item.timeAfterTakingMedicine === time);

    leftHandCounts.push(leftDataAtTime ? leftDataAtTime.count : null);
    rightHandCounts.push(rightDataAtTime ? rightDataAtTime.count : null);
  });

  // 차트 데이터 준비
  const chartData = {
    labels: allTimeLabels,
    datasets: [
      {
        label: '왼손 터치 횟수',
        data: leftHandCounts,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        spanGaps: true,  // 중간에 데이터가 없으면 연결하지 않음
      },
      {
        label: '오른손 터치 횟수',
        data: rightHandCounts,
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        spanGaps: true,  // 중간에 데이터가 없으면 연결하지 않음
      },
    ],
  };

  return (
    <div className="page-container">
      {data.length > 0 ? (
        <div style={{ width: '100%', height: '100%' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              scales: {
                x: {
                  type: 'linear',
                  title: { display: true, text: '약 먹은 뒤 지난 시간(분)', font: { size: 9 }, },
                  ticks: { stepSize: 10, font: { size: 9 } },
                },
                y: {
                  title: { display: true, text: '터치 횟수', font: { size: 9 }, },
                  beginAtZero: true,
                  ticks: {  stepSize: 10, font: { size: 9 } },
                },
              },
              plugins: {
                legend: {
                  position: 'right', // 레전드를 오른쪽에 배치
                  labels: {
                    font: {
                      size: 9, // 레전드 글씨 크기 설정
                    },
                  },
                },
                tooltip: {
                  mode: 'nearest',
                  intersect: false,
                  callbacks: {
                    title: function (tooltipItems) {
                      const time = tooltipItems[0].label;
                      return `시간: ${time}분`;
                    },
                    label: function (tooltipItem) {
                      return `${tooltipItem.dataset.label}: ${tooltipItem.raw} 회`;
                    },
                  },
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

export default Hands;
