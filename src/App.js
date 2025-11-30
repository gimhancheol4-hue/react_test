// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';

function App() {
  const [message, setMessage] = useState('');

  // 부서 목록 상태
  const [deptList, setDeptList] = useState([]);
  
  // 사원 목록 상태
  const [employeeList, setEmployeeList] = useState([]);
  
  // 선택된 부서
  const [selectedDept, setSelectedDept] = useState('');

  // 백엔드 연결 테스트 함수
  const test = async () => {
    try {
      const response = await fetch('https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/api/test');
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      alert('백엔드 연결 실패');
      setMessage('메시지를 가져오는데 실패했습니다');
    }
  };

  // ① 부서 목록 가져오기
  const loadDeptList = async () => {
    try {
      const response = await fetch(
        'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/dept'
      );
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();
      setDeptList(data);
      setEmployeeList([]); // 부서 다시 조회하면 사원 목록 초기화
      setSelectedDept('');
    } catch (error) {
      alert('부서 목록 조회 실패');
    }
  };

  // ② 특정 부서 클릭 → 사원 조회
  const loadEmployeeByDept = async (deptCd) => {
    try {
      setSelectedDept(deptCd);
      const response = await fetch(
        `https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/dept/${deptCd}/employees`
      );
      if (!response.ok) throw new Error(response.status);
      const data = await response.json();
      setEmployeeList(data);
    } catch (error) {
      alert('사원 조회 실패');
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


        {/* ====== 부서 조회 기능 ====== */}
        <hr />
        <h2>부서 조회</h2>
        <input type="button" value="부서 목록 가져오기" onClick={loadDeptList} />

        <ul>
          {deptList.map((dept) => (
            <li key={dept.DEPT_CD}>
              <button onClick={() => loadEmployeeByDept(dept.DEPT_CD)}>
                {dept.DEPT_NM} ({dept.DEPT_CD})
              </button>
            </li>
          ))}
        </ul>


        {/* ====== 사원 목록 출력 ====== */}
        {selectedDept && (
          <>
            <h3>사원 목록 - {selectedDept}</h3>
            <ul>
              {employeeList.map((emp) => (
                <li key={emp.EMP_NO}>
                  {emp.USER_NM} / {emp.EMP_NO} / {emp.USER_EMAIL}
                </li>
              ))}
            </ul>
          </>
        )}

      </div>

      {Footer()}
    </div>
  );
}

export default App;
