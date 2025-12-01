// App.js
import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header.js';
import Footer from './components/Footer/Footer.js';
import DeptList from './components/Dept/DeptList';
import EmployeeList from './components/Employee/EmployeeList';
import Mapping from './components/Mapping/Mapping';
import Evaluation from './components/Evaluation/Evaluation';

function App() {
  const [message, setMessage] = useState('');

  // 선택된 부서코드
  const [selectedDept, setSelectedDept] = useState('');

  // ✅ 현재 "로그인했다고 가정"할 유저
  const [currentUser, setCurrentUser] = useState(null);

  // ✅ 어떤 화면이 열려 있는지 ('login' | 'mapping' | ... | null)
  const [activeView, setActiveView] = useState(null);

  // ✅ EmployeeList에서 유저 선택 시 호출될 함수
  const handleLoginAs = (emp) => {
    if (currentUser && currentUser.EMP_NO === emp.EMP_NO) {
      setCurrentUser(null);
    } else {
      setCurrentUser(emp);
    }
  };

  // ✅ 공통 토글 함수: 같은 버튼 한 번 더 누르면 닫힘
  const toggleView = (viewName) => {
    setActiveView((prev) => (prev === viewName ? null : viewName));
  };

  const handleCreateEvalMapping = async () => {
    try {
      const response = await fetch(
        'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/mapping/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            year: '2025',
            instCd: '001',
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
            border: '1px solid',
            textAlign: 'left',
          }}
        >
          <div style={{ fontSize: '14px', color: '#555' }}>현재 로그인 유저</div>
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

        {/* ✅ 화면 토글 버튼 영역 */}
        <div style={{ marginBottom: '10px', textAlign: 'left' }}>
          {/* 로그인(부서/사원) 영역 토글 */}
          <button
            onClick={() => toggleView('login')}
            style={{
              padding: '8px 14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#ffffff',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
             로그인 닫기
          </button>

          {/* 인사평가 매핑 생성 (순수 액션 버튼이므로 토글과 무관) */}
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
            인사평가 매핑 생성(관리자)
          </button>

          {/* 매핑 조회 영역 토글 */}
          <button
            onClick={() => toggleView('mapping')}
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
             매핑 조회(관리자)
          </button>

          <button 
          onClick={() => toggleView('Evaluation')}
          style={{
          padding: '8px 14px',
          borderRadius: '6px',
          marginLeft: '10px',
          border: '1px solid #ccc',
          background: '#ffffff',
          cursor: 'pointer', 
          fontSize: '13px',
          }}>인사평가</button>

          {/* 나중에 다른 화면 추가하면 이런 식으로 확장하면 됨 */}
          {/* <button onClick={() => toggleView('projectEval')}>프로젝트 평가</button> */}
        </div>

        {/* ====== 부서 / 사원(로그인) 영역 ====== */}
        {activeView === 'login' && (
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

        {/* ====== 매핑 조회 영역 ====== */}
        {activeView === 'mapping' && (
          <Mapping selectedDept={selectedDept} currentUser={currentUser} />
        )}

        {/* ====== 인사평가(문서 입력) 영역 ====== */}
        {activeView === 'Evaluation' && (
          <Evaluation currentUser={currentUser} />
        )}
      </div>

      {Footer()}
    </div>
  );
}

export default App;
