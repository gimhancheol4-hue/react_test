// components/Evaluation/WorkPledgeForm.js
import React, { useEffect, useState } from 'react';

function WorkPledgeForm({ apiBase, currentUser }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const targetEmpNo = currentUser.EMP_NO || currentUser.empNo;

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // formCode/step은 업무서약서 고정
    const payload = {
      formCode: 'WORK_PLEDGE',
      step: 'PLEDGE',
      targetEmpNo,
      evaluatorEmpNo: targetEmpNo, // 본인이 작성
      values,
    };

    try {
      const res = await fetch(`${apiBase}/eval/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      alert('업무서약서가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('업무서약서 저장 중 오류가 발생했습니다.');
    }
  };

  // 필드코드는 eval_layout에 넣어둔 코드와 맞춰서!
  return (
    <div style={{ marginTop: '24px' }}>
      <h3>업무서약서</h3>

      <section className="wp-section">
        <h4>기본 정보</h4>
        <div className="eval-field">
          <label>년도</label>
          <input
            type="text"
            value={values.HDR_YEAR || ''}
            onChange={(e) => handleChange('HDR_YEAR', e.target.value)}
          />
        </div>
        <div className="eval-field">
          <label>이름</label>
          <input
            type="text"
            value={values.HDR_NAME || currentUser.USER_NM || ''}
            onChange={(e) => handleChange('HDR_NAME', e.target.value)}
          />
        </div>
        {/* 사업부, 소속팀, 직급 등도 같은 방식으로 */}
      </section>

      <section className="wp-section">
        <h4>담당 직무 부문</h4>

        <div className="eval-field">
          <label>1. 업무명</label>
          <input
            type="text"
            value={values.DUTY1_NAME || ''}
            onChange={(e) => handleChange('DUTY1_NAME', e.target.value)}
          />
        </div>
        <div className="eval-field">
          <label>1. 업무목표</label>
          <textarea
            value={values.DUTY1_GOAL || ''}
            onChange={(e) => handleChange('DUTY1_GOAL', e.target.value)}
          />
        </div>
        <div className="eval-field">
          <label>1. 비중(%)</label>
          <input
            type="number"
            value={values.DUTY1_RATIO || ''}
            onChange={(e) => handleChange('DUTY1_RATIO', e.target.value)}
          />
        </div>
        <div className="eval-field">
          <label>1. 기간</label>
          <input
            type="text"
            value={values.DUTY1_TERM || ''}
            onChange={(e) => handleChange('DUTY1_TERM', e.target.value)}
          />
        </div>

        {/* DUTY2_*, DUTY3_* ... 필요 만큼 추가 */}
      </section>

      {/* 능력개발 / 기타 자기개발 섹션도 같은 패턴으로 */}

      <button className="submit-btn" onClick={handleSubmit}>
        업무서약서 저장
      </button>
    </div>
  );
}

export default WorkPledgeForm;
