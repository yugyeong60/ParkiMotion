import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard({ token }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { patientId } = location.state || {};

  const [patientData, setPatientData] = useState(null);
  const [walkingData, setWalkingData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(1); // 기본값을 1로 설정 (2번째 데이터부터 표시)
  const [fingerData, setFingerData] = useState([]);

  useEffect(() => {
    if (!token) {
      alert('인증이 필요합니다.');
      navigate('/');
      return;
    }

    if (!patientId) {
      alert('환자 ID가 필요합니다.');
      navigate('/page2');
      return;
    }

    const fetchData = async () => {
      try {
        //환자 데이터 가져오기
        const patientResponse = await fetch(`https://kwhcclab.com:20757/api/users/${patientId}`, {
          headers: { 'X-Auth-Token': token },
        });
        const patient = await patientResponse.json();
        setPatientData(patient);

        // 걷기 데이터 가져오기
        const walkingResponse = await fetch(`https://kwhcclab.com:20757/api/tests/gait?userId=${patientId}`, {
          headers: { 'X-Auth-Token': token },
        });
        const walkingData = await walkingResponse.json();

        // 속도 계산 추가
        const processedWalkingData = walkingData.data.map((item) => ({
          ...item,
          speed: item.distance / item.time, // 속도 계산
        }));

        setWalkingData(processedWalkingData || []);

        // 손 터치 데이터 가져오기
        const fingerResponse = await fetch(`https://kwhcclab.com:20757/api/tests/finger?userId=${patientId}`, {
          headers: { 'X-Auth-Token': token },
        });
        const fingerData = await fingerResponse.json();
        setFingerData(fingerData.data || []);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류:', error);
        alert('데이터를 가져오는 중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [patientId, token, navigate]);


  const calculateChange = (current, previous, field) => {
    const difference = current[field] - previous[field];
    let percentage = previous[field] !== 0
    ? ((difference / previous[field]) * 100).toFixed(2)
    : 0; // 이전 값이 0이면 0% 반환
    percentage = Math.min(percentage, 100);
    return { difference, percentage };
  };

  const handleFirst = () => setCurrentIndex(1);
  const handleLast = () => setCurrentIndex(walkingData.length - 1);
  const handleNext = () => {
    if (currentIndex < walkingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handlePrevious = () => {
    if (currentIndex > 1) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const current = walkingData[currentIndex];
  const previous = currentIndex > 0 ? walkingData[currentIndex - 1] : null;

  const stepChange = previous
    ? calculateChange(current, previous, 'step')
    : { difference: 0, percentage: 0 };

  const speedChange = previous
    ? calculateChange(current, previous, 'speed')
    : { difference: 0, percentage: 0 };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h2>환자 정보</h2>
        {patientData ? (
          <div>
            <p><strong>ID:</strong> {patientData.id}</p>
            <p><strong>이름:</strong> {patientData.name}</p>
            <p><strong>성별:</strong> {patientData.gender === 'M' ? '남성' : '여성'}</p>
            <p><strong>생년월일:</strong> {patientData.birthdate}</p>
            <p><strong>진단 연도:</strong> {patientData.diagnosis}</p>
          </div>
        ) : (
          <p>환자 정보를 불러오는 중...</p>
        )}
      </div>
      <div className="main-panel">
        <h1>걷기 데이터 변화</h1>
        {current && (
          <div className="walking-group">
            <h2>데이터 ID: {current.id}</h2>
            <p>걸음걸이 수 변화: {stepChange.difference} ({stepChange.percentage}%)</p>
            <p>속도 변화: {speedChange.difference.toFixed(2)} m/s ({speedChange.percentage}%)</p>

            <div className="thermometer">
              {/* 걸음 변화 바 */}
              <div
                className={`thermometer-bar step ${stepChange.difference < 0 ? 'green' : 'red'}`}
                style={{
                  height: `${Math.abs(stepChange.percentage)}%`,
                }}
              ></div>

              {/* 속도 변화 바 */}
              <div
                className={`thermometer-bar speed ${speedChange.difference < 0 ? 'blue' : 'orange'}`}
                style={{
                  height: `${Math.abs(speedChange.percentage)}%`,
                }}
              ></div>
            </div>

            <div className="walking-data">
              <p><strong>이전 데이터:</strong> {previous ? previous.step : '없음'}걸음</p>
              <p><strong>현재 데이터:</strong> {current.step}걸음</p>
              <p><strong>현재 속도:</strong> {current.speed.toFixed(2)} m/s</p>
            </div>
          </div>
        )}

        <div className="navigation-buttons">
          <button onClick={handleFirst} disabled={currentIndex <= 1}>처음으로 가기</button>
          <button onClick={handlePrevious} disabled={currentIndex <= 1}>이전으로 돌아가기</button>
          <button onClick={handleNext} disabled={currentIndex === walkingData.length - 1}>다음으로 넘어가기</button>
          <button onClick={handleLast} disabled={currentIndex === walkingData.length - 1}>마지막으로 가기</button>
        </div>

        {/* 걷기 데이터 그래프 */}
        <div className="chart-container">
          <h2>전체 걷기 데이터 그래프</h2>
          <Line
            data={{
              labels: walkingData.map((item) => item.createdAt),
              datasets: [
                {
                  label: '걸음수',
                  data: walkingData.map((item) => item.step),
                  borderColor: 'rgba(0, 0, 255, 0.5)',
                  backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  yAxisID: 'y',
                },
                {
                  label: '속도 (m/s)',
                  data: walkingData.map((item) => item.speed),
                  borderColor: 'red',
                  backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  yAxisID: 'y1',
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: '걸음수 및 속도 데이터 변화',
                },
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: '걸음수',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: '속도 (m/s)',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </div>
    </div>
    <div className='dashboard2'>
        <div className="finger-chart">
          <h1>손 터치 횟수</h1>
            <Line
              data={{
                labels: fingerData.filter((item) => item.hand === 'L').map((item) => item.createdAt),
                datasets: [
                  {
                    label: '왼손',
                    data: fingerData
                      .filter((item) => item.hand === 'L')
                      .map((item) => item.count),
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  }
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '왼손 터치 데이터',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: '왼손 터치 횟수',
                    },
                  },
                },
              }}
            />
            <Line
              data={{
                labels: fingerData.filter((item) => item.hand === 'R').map((item) => item.createdAt),
                datasets: [
                  {
                    label: '오른손',
                    data: fingerData
                      .filter((item) => item.hand === 'R')
                      .map((item) => item.count),
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.1)',
                  }
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: '오른손 터치 데이터',
                  },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                      display: true,
                      text: '오른손터치 횟수',
                    },
                  },
                },
              }}
            />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
