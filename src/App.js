// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import DeptList from './components/Dept/DeptList';
import EmployeeList from './components/Employee/EmployeeList';

function App() {
  const [message, setMessage] = useState('');

  // 선택된 부서코드
  const [selectedDept, setSelectedDept] = useState('');

  // ✅ 현재 "로그인했다고 가정"할 유저
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ 부서/사원 조회 영역 보여줄지 여부
  const [showOrgArea, setShowOrgArea] = useState(false);

  // ✅ EmployeeList에서 유저 선택 시 호출될 함수
  const handleLoginAs = (emp) => {
    if (currentUser && currentUser.EMP_NO === emp.EMP_NO) {
      setCurrentUser(null);
    } else {
      setCurrentUser(emp);
    }
  };

    const handleCreateEvalMapping = async () => {
    try {
      const response = await fetch(
        'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/api/eval/mapping/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            year: '2025',
            evalType: 'INS',
            instCd: '001',           // 필요 없으면 null 보내도 됨
            selfDueDate: '2025-12-10',
            firstDueDate: '2025-12-15',
            secondDueDate: '2025-12-20',
          }),
        }
      );

      if (!response.ok) {
        throw new Error('서버 응답이 올바르지 않습니다. ' + response.status);
      }

      const data = await response.json();

      // 응답 구조: { success, insertedCount, message }
      alert(`${data.message}\n생성 건수: ${data.insertedCount}건`);
    } catch (error) {
      console.error(error);
      alert('인사평가 매핑 생성 중 오류가 발생했습니다.');
    }
  };


  return (
    <div className="App">
      {Header()}

      <div className="Main-container">
        <hr />

        {/* ✅ 현재 선택된(로그인 가정) 유저 표시 */}
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: '#f5f7ff',
            border: '1px solid #d1d9ff',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '14px', color: '#555' }}>
            현재 로그인 유저
          </div>
          {currentUser ? (
            <div style={{ marginTop: '4px', fontWeight: '600' }}>
              {currentUser.USER_NM} ({currentUser.EMP_NO})
            </div>
          ) : (
            <div style={{ marginTop: '4px', color: '#888' }}>
              선택된 유저가 없습니다. 사원 목록에서 체크해주세요.
            </div>
          )}
        </div>

        {/* ✅ 부서/사원 영역 토글 버튼 */}
        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
          <button
            onClick={() => setShowOrgArea((prev) => !prev)}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {showOrgArea ? '유저 선택 닫기' : '유저 선택 보기'}
          </button>
          <button
            onClick={handleCreateEvalMapping}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              marginLeft: '10px',
              border: '1px solid #ccc',
              background: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            인사평가 매핑
          </button>
        </div>

        {/* ====== 부서 / 사원 영역 ====== */}
        {showOrgArea && (
          <div
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            {/* 부서 조회 컴포넌트 */}
            <DeptList onDeptSelect={setSelectedDept} />

            {/* 사원 조회 + "로그인 가정" 체크박스 */}
            <EmployeeList
              selectedDept={selectedDept}
              currentUser={currentUser}
              onLoginAs={handleLoginAs}
            />
          </div>
        )}
      </div>

      {Footer()}
    </div>
  );
}

export default App;
