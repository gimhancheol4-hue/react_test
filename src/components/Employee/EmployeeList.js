// components/Employee/EmployeeList.js
import React, { useEffect, useState } from 'react';
import './EmployeeList.css';

function EmployeeList({ selectedDept, currentUser, onLoginAs }) {
  const [employeeList, setEmployeeList] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!selectedDept) {
        setEmployeeList([]);
        return;
      }

      try {
        const response = await fetch(
          `https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/dept/${selectedDept}/employees`
        );
        if (!response.ok) throw new Error(response.status);
        const data = await response.json();
        setEmployeeList(data);
      } catch (error) {
        alert('사원 조회 실패');
      }
    };

    fetchEmployees();
  }, [selectedDept]);

  return (
    <div className="emp-container">
      <h2>사원 목록</h2>

      {!selectedDept && (
        <div className="emp-empty">부서를 먼저 선택해주세요.</div>
      )}

      {selectedDept && (
        <>
          <div className="emp-selected">
            선택된 부서: <b>{selectedDept}</b>
          </div>

          <ul className="emp-list">
            {employeeList.map((emp) => {
              const isChecked =
                currentUser && currentUser.EMP_NO === emp.EMP_NO;

              return (
                <li key={emp.EMP_NO} className="emp-item">
                  <label className="emp-row">
                    {/* ✅ 로그인 가정 체크박스 */}
                    <input
                      type="checkbox"
                      checked={!!isChecked}
                      onChange={() => onLoginAs(emp)}
                    />
                    <div className="emp-info">
                      <div className="emp-name">{emp.USER_NM}</div>
                      <div className="emp-meta">
                        {emp.EMP_NO} | {emp.USER_EMAIL}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

export default EmployeeList;
