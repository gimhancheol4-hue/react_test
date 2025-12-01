// components/Evaluation/HrCommonForm.js
import React, { useState } from 'react';

function HrCommonForm({ apiBase, currentUser, step }) {
  const [values, setValues] = useState({});

  const targetEmpNo = currentUser.EMP_NO || currentUser.empNo;

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!step) {
      alert('평가 단계를 선택해 주세요.');
      return;
    }

    const payload = {
      formCode: 'HR_COMMON',
      step,               // SELF/FIRST/SECOND
      targetEmpNo,
      evaluatorEmpNo: currentUser.EMP_NO || currentUser.empNo,
      values,
    };

    try {
      const res = await fetch(`${apiBase}/eval/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');
      alert('인사평가서가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('인사평가서 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ marginTop: '24px' }}>
      <h3>인사평가 ({step})</h3>

      {/* 여기부터는 실제 인사평가 양식에 맞게 섹션화 */}
      <section className="hr-section">
        <h4>능력 평가</h4>
        <div className="eval-field">
          <label>전문지식</label>
          <select
            value={values.ABILITY_PRO || ''}
            onChange={(e) => handleChange('ABILITY_PRO', e.target.value)}
          >
            <option value="">-- 선택 --</option>
            <option value="A">탁월</option>
            <option value="B">우수</option>
            <option value="C">보통</option>
            <option value="D">미흡</option>
          </select>
        </div>
        {/* 다른 항목들 쭉… */}
      </section>

      {/* 업적 / 태도 / 종합 의견 칸 등도 섹션 나눠서 구성 */}

      <button className="submit-btn" onClick={handleSubmit}>
        인사평가 저장
      </button>
    </div>
  );
}

export default HrCommonForm;
