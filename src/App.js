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

  // 백엔드 연결 테스트 함수
  const test = async () => {
    try {
      const response = await fetch(
        'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/api/test'
      );
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      alert('백엔드 연결 실패');
      setMessage('메시지를 가져오는데 실패했습니다');
    }
  };

  // ✅ EmployeeList에서 유저 선택 시 호출될 함수
  const handleLoginAs = (emp) => {
    // 같은 사람 한 번 더 클릭하면 해제해주고 싶으면 이렇게
    if (currentUser && currentUser.EMP_NO === emp.EMP_NO) {
      setCurrentUser(null);
    } else {
      setCurrentUser(emp);
    }
  };

  return (
    <div className="App">
      {Header()}

      <div className="Main-container">
        {/* ====== 백엔드 테스트 버튼 ====== */}
        <div>
          <p>이 버튼은 어떤 버튼이냐면~ 백엔드랑 연결을 확인하는 버튼이야~</p>
          <input type="button" value="백엔드 확인" onClick={test} />
        </div>

        <div>응답 메시지: {message}</div>

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
          <div style={{ fontSize: '14px', color: '#555' }}>현재 로그인 유저(가정)</div>
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

        {/* ====== 부서 / 사원 영역 나란히 보기 좋게 정렬 ====== */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* ====== 부서 조회 컴포넌트 ====== */}
          <DeptList onDeptSelect={setSelectedDept} />

          {/* ====== 사원 조회 + "로그인 가정" 체크박스 ====== */}
          <EmployeeList
            selectedDept={selectedDept}
            currentUser={currentUser}
            onLoginAs={handleLoginAs}
          />
        </div>
      </div>

      {Footer()}
    </div>
  );
}

export default App;
