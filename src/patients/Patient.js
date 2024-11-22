import React from 'react';
import { useLocation } from 'react-router-dom';

function Patient() {
  const location = useLocation();
  const { patientId, patientData } = location.state || {};

  return (
    <div className="patient-page-container">
      <h1>환자 정보</h1>
      {patientData ? (
        <div>
          <p><strong>환자 ID:</strong> {patientId}</p>
          <p><strong>이름:</strong> {patientData.name}</p>
          <p><strong>성별:</strong> {patientData.gender === 'M' ? '남성' : '여성'}</p>
          <p><strong>생년월일:</strong> {patientData.birthdate}</p>
          <p><strong>진단 연도:</strong> {patientData.diagnosis}</p>
        </div>
      ) : (
        <p>환자 정보를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}

export default Patient;
