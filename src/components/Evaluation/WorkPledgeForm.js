// components/Evaluation/WorkPledgeForm.js
import React, { useState } from 'react';
import '../Evaluation/Evaluation.css';

function WorkPledgeForm({ apiBase, currentUser }) {
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const targetEmpNo = currentUser.EMP_NO || currentUser.empNo;
  const targetUserNm = currentUser.USER_NM || currentUser.userNm || '';

  const handleChange = (fieldCode, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldCode]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!targetEmpNo) {
      alert('사번 정보를 찾을 수 없습니다.');
      return;
    }

    const payload = {
      formCode: 'WORK_PLEDGE',
      step: 'PLEDGE',
      targetEmpNo,
      evaluatorEmpNo: targetEmpNo,
      values,
    };

    try {
      setSubmitting(true);
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
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ marginTop: '18px', marginBottom: '24px' }}>
      {/* 제목 영역 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">업무서약서</div>
          <div className="eval-card-subtitle">
            연초에 한 해의 주요 직무 및 자기개발 계획을 서약합니다.
          </div>
        </div>

        {/* 1. 기본정보 */}
        <div className="eval-grid-2">
          <div className="eval-row">
            <label>년도</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_YEAR || ''}
              onChange={(e) => handleChange('HDR_YEAR', e.target.value)}
              placeholder="예: 2025"
            />
          </div>

          <div className="eval-row">
            <label>이름</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_NAME || targetUserNm}
              onChange={(e) => handleChange('HDR_NAME', e.target.value)}
            />
          </div>

          <div className="eval-row">
            <label>사업부</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_DEPT || ''}
              onChange={(e) => handleChange('HDR_DEPT', e.target.value)}
            />
          </div>

          <div className="eval-row">
            <label>소속팀</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_TEAM || ''}
              onChange={(e) => handleChange('HDR_TEAM', e.target.value)}
            />
          </div>

          <div className="eval-row">
            <label>직급</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_POSITION || ''}
              onChange={(e) => handleChange('HDR_POSITION', e.target.value)}
            />
          </div>

          <div className="eval-row">
            <label>직군</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_JOB_GROUP || ''}
              onChange={(e) => handleChange('HDR_JOB_GROUP', e.target.value)}
            />
          </div>

          <div className="eval-row">
            <label>현 직급 기간</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_CURR_TERM || ''}
              onChange={(e) => handleChange('HDR_CURR_TERM', e.target.value)}
              placeholder="예: 2023.03 ~ 2025.02"
            />
          </div>

          <div className="eval-row">
            <label>업무서약 기간</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_PLEDGE_TERM || ''}
              onChange={(e) => handleChange('HDR_PLEDGE_TERM', e.target.value)}
              placeholder="예: 2025.01 ~ 2025.12"
            />
          </div>
        </div>
      </div>

      {/* 2. 담당 직무 부문 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">담당 직무 부문</div>
          <div className="eval-card-subtitle">
            올해 수행할 주요 직무와 목표, 비중 및 기간을 입력합니다.
          </div>
        </div>

        <div className="eval-section-caption">
          최대 3개까지 등록 가능합니다. (필요 시 더 늘릴 수 있음)
        </div>

        {/* 1번 직무 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">1. 주요 직무</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>업무명</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY1_NAME || ''}
                onChange={(e) => handleChange('DUTY1_NAME', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>비중(%)</label>
              <input
                className="eval-input"
                type="number"
                value={values.DUTY1_RATIO || ''}
                onChange={(e) => handleChange('DUTY1_RATIO', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY1_TERM || ''}
                onChange={(e) => handleChange('DUTY1_TERM', e.target.value)}
              />
            </div>
          </div>
          <div className="eval-row" style={{ marginTop: 8 }}>
            <label>업무목표</label>
            <textarea
              className="eval-textarea"
              value={values.DUTY1_GOAL || ''}
              onChange={(e) => handleChange('DUTY1_GOAL', e.target.value)}
              placeholder="구체적인 정량/정성 목표를 입력해 주세요."
            />
          </div>
        </div>

        {/* 2번 직무 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">2. 주요 직무</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>업무명</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY2_NAME || ''}
                onChange={(e) => handleChange('DUTY2_NAME', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>비중(%)</label>
              <input
                className="eval-input"
                type="number"
                value={values.DUTY2_RATIO || ''}
                onChange={(e) => handleChange('DUTY2_RATIO', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY2_TERM || ''}
                onChange={(e) => handleChange('DUTY2_TERM', e.target.value)}
              />
            </div>
          </div>
          <div className="eval-row" style={{ marginTop: 8 }}>
            <label>업무목표</label>
            <textarea
              className="eval-textarea"
              value={values.DUTY2_GOAL || ''}
              onChange={(e) => handleChange('DUTY2_GOAL', e.target.value)}
            />
          </div>
        </div>

        {/* 3번 직무 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">3. 주요 직무</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>업무명</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY3_NAME || ''}
                onChange={(e) => handleChange('DUTY3_NAME', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>비중(%)</label>
              <input
                className="eval-input"
                type="number"
                value={values.DUTY3_RATIO || ''}
                onChange={(e) => handleChange('DUTY3_RATIO', e.target.value)}
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.DUTY3_TERM || ''}
                onChange={(e) => handleChange('DUTY3_TERM', e.target.value)}
              />
            </div>
          </div>
          <div className="eval-row" style={{ marginTop: 8 }}>
            <label>업무목표</label>
            <textarea
              className="eval-textarea"
              value={values.DUTY3_GOAL || ''}
              onChange={(e) => handleChange('DUTY3_GOAL', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* 3. 능력개발/자기개발 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">능력개발 및 자기개발 계획</div>
          <div className="eval-card-subtitle">
            직무 전문성 및 개인 역량 강화를 위한 연간 계획을 작성합니다.
          </div>
        </div>

        {/* IT 직무능력 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">IT 직무능력</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>내용</label>
              <textarea
                className="eval-textarea"
                value={values.SELF_IT_CONTENT || ''}
                onChange={(e) =>
                  handleChange('SELF_IT_CONTENT', e.target.value)
                }
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.SELF_IT_TERM || ''}
                onChange={(e) => handleChange('SELF_IT_TERM', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 업무 직무능력 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">업무 직무능력</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>내용</label>
              <textarea
                className="eval-textarea"
                value={values.SELF_JOB_CONTENT || ''}
                onChange={(e) =>
                  handleChange('SELF_JOB_CONTENT', e.target.value)
                }
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.SELF_JOB_TERM || ''}
                onChange={(e) => handleChange('SELF_JOB_TERM', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 자기계발 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">자기계발</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>내용</label>
              <textarea
                className="eval-textarea"
                value={values.SELF_SELFDEV_CONTENT || ''}
                onChange={(e) =>
                  handleChange('SELF_SELFDEV_CONTENT', e.target.value)
                }
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.SELF_SELFDEV_TERM || ''}
                onChange={(e) =>
                  handleChange('SELF_SELFDEV_TERM', e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* 기타 자기개발 */}
        <div className="eval-duty-block">
          <div className="eval-duty-title">기타 자기개발</div>
          <div className="eval-grid-2">
            <div className="eval-row">
              <label>내용</label>
              <textarea
                className="eval-textarea"
                value={values.SELF_ETC_CONTENT || ''}
                onChange={(e) =>
                  handleChange('SELF_ETC_CONTENT', e.target.value)
                }
              />
            </div>
            <div className="eval-row">
              <label>기간</label>
              <input
                className="eval-input"
                type="text"
                value={values.SELF_ETC_TERM || ''}
                onChange={(e) => handleChange('SELF_ETC_TERM', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? '저장 중...' : '업무서약서 저장'}
      </button>
    </div>
  );
}

export default WorkPledgeForm;
