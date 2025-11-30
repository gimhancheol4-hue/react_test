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

        {/* ====== 부서 조회 컴포넌트 ====== */}
        <DeptList onDeptSelect={setSelectedDept} />

        {/* ====== 사원 조회 컴포넌트 ====== */}
        <EmployeeList selectedDept={selectedDept} />
      </div>

      {Footer()}
    </div>
  );
}

export default App;
