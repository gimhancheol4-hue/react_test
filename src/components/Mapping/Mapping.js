// components/Mapping/Mapping.js
import React, { useState, useEffect } from 'react';
import './Mapping.css';

function Mapping({ selectedDept, currentUser }) {
  const currentYear = new Date().getFullYear();
  const yearList = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const [year, setYear] = useState(String(currentYear));
  const [dept, setDept] = useState(selectedDept || '');
  const [useCurrentUser, setUseCurrentUser] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState([]);
  const [error, setError] = useState(null);

  const [deptList, setDeptList] = useState([]);

  // 🔹 부서 목록 조회 (처음 한번 + 필요시)
  useEffect(() => {
    const fetchDeptList = async () => {
      try {
        const res = await fetch(
          'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/dept'
        );
        if (!res.ok) {
          throw new Error('부서 목록 조회 실패: ' + res.status);
        }
        const data = await res.json();
        // data가 배열이라 가정: [{ DEPT_CD, DEPT_NM, ... }, ...]
        setDeptList(data || []);
      } catch (e) {
        console.error(e);
      }
    };

    fetchDeptList();
  }, []);

  // 🔹 상위에서 선택한 부서(selectedDept)가 바뀌면 내부 선택값도 맞춰줌
  useEffect(() => {
    if (selectedDept) {
      setDept(selectedDept);
    }
  }, [selectedDept]);

  const handleFetchMapping = async () => {
    if (!year) {
      alert('평가년도를 선택해주세요.');
      return;
    }

    const body = {
      instCd: '001',
      year: year,
      deptCd: dept || '',
      targetEmpNo: useCurrentUser && currentUser ? currentUser.EMP_NO : '',
      evaluatorEmpNo: '',
    };

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app/eval/mapping/select',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error('서버 오류: ' + response.status);
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || '조회에 실패했습니다.');
      }

      setMappings(data.data || []);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setMappings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mapping-container">
      <div className="mapping-header">
        <h2>인사평가 매핑 조회</h2>
        <div className="mapping-filter-row">
          {/* 평가년도 선택 */}
          <div className="mapping-filter-item">
            <label>평가년도</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mapping-select"
            >
              <option value="">선택</option>
              {yearList.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* 부서 선택 (전체 + 모든 부서) */}
          <div className="mapping-filter-item">
            <label>부서</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="mapping-select"
            >
              <option value="">전체</option>
              {deptList.map((d) => (
                <option key={d.DEPT_CD} value={d.DEPT_CD}>
                  {d.DEPT_CD} - {d.DEPT_NM}
                </option>
              ))}
            </select>
          </div>

          {/* 현재 로그인 유저 기준 체크 */}
          <div className="mapping-filter-item">
            <label>
              <input
                type="checkbox"
                checked={useCurrentUser}
                onChange={(e) => setUseCurrentUser(e.target.checked)}
                disabled={!currentUser}
              />
              &nbsp;현재 로그인 유저 기준만
            </label>
            <div className="mapping-filter-text small">
              {currentUser
                ? `${currentUser.USER_NM} (${currentUser.EMP_NO})`
                : '선택된 유저 없음'}
            </div>
          </div>

          {/* 조회 버튼 */}
          <div className="mapping-filter-item">
            <button onClick={handleFetchMapping}>매핑 조회</button>
          </div>
        </div>
      </div>

      {loading && <div className="mapping-status">조회 중...</div>}
      {error && <div className="mapping-status error">에러: {error}</div>}

      {!loading && !error && mappings.length === 0 && (
        <div className="mapping-status">조회된 매핑 데이터가 없습니다.</div>
      )}

      {!loading && !error && mappings.length > 0 && (
        <div className="mapping-table-wrapper">
          <table className="mapping-table">
            <thead>
              <tr>
                <th>부서</th>
                <th>피평가자</th>
                <th>직급코드</th>
                <th>업무서약서</th>
                <th>자기평가</th>
                <th>1차 평가자</th>
                <th>1차 제출</th>
                <th>2차 평가자</th>
                <th>2차 제출</th>
              </tr>
            </thead>
            <tbody>
              {mappings.map((row) => (
                <tr key={row.ID}>
                  <td>
                    {row.TARGET_DEPT_CD}
                    <br />
                    <span className="sub-text">{row.TARGET_DEPT_NM}</span>
                  </td>
                  <td>
                    {row.TARGET_USER_NM}
                    <br />
                    <span className="sub-text">{row.TARGET_EMP_NO}</span>
                  </td>
                  <td>{row.TARGET_DUTY_CD}</td>
                  <td>{row.SWEAR_SUBMIT_YN === 'Y' ? '제출' : '미제출'}</td>
                  <td>
                    {row.SELF_EVAL_SUBMIT_YN === 'Y'
                      ? '제출'
                      : row.SELF_EVAL_YN === 'Y'
                      ? '대상(미제출)'
                      : '대상 아님'}
                  </td>
                  <td>
                    {row.FIRST_EVALUATOR_USER_NM
                      ? `${row.FIRST_EVALUATOR_USER_NM} (${row.FIRST_EVALUATOR_EMP_NO})`
                      : '-'}
                  </td>
                  <td>
                    {row.FIRST_EVAL_SUBMIT_YN === 'Y'
                      ? '제출'
                      : row.FIRST_EVALUATOR_EMP_NO
                      ? '미제출'
                      : '-'}
                  </td>
                  <td>
                    {row.SECOND_EVALUATOR_USER_NM
                      ? `${row.SECOND_EVALUATOR_USER_NM} (${row.SECOND_EVALUATOR_EMP_NO})`
                      : '-'}
                  </td>
                  <td>
                    {row.SECOND_EVAL_SUBMIT_YN === 'Y'
                      ? '제출'
                      : row.SECOND_EVALUATOR_EMP_NO
                      ? '미제출'
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Mapping;
