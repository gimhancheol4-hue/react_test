// components/Mapping/Mapping.js
import React, { useState } from 'react';
import './Mapping.css';

function Mapping({ selectedDept, currentUser }) {
  const [year, setYear] = useState('2025');
  const [useCurrentUser, setUseCurrentUser] = useState(false);

  const [loading, setLoading] = useState(false);
  const [mappings, setMappings] = useState([]);
  const [error, setError] = useState(null);

  const handleFetchMapping = async () => {
    if (!year) {
      alert('평가년도를 입력해주세요.');
      return;
    }

    if (!selectedDept) {
      if (!window.confirm('부서가 선택되지 않았습니다.\n전체 부서 기준으로 조회할까요?')) {
        return;
      }
    }

    const body = {
      instCd: '001',
      year: year,
      deptCd: selectedDept || '',
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
          <div className="mapping-filter-item">
            <label>평가년도</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="예) 2025"
            />
          </div>

          <div className="mapping-filter-item">
            <label>부서</label>
            <div className="mapping-filter-text">
              {selectedDept ? selectedDept : '선택된 부서 없음'}
            </div>
          </div>

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
