// components/Evaluation/HrCommonForm.js
import React, { useState } from 'react';
import '../Evaluation/Evaluation.css';

const gradeOptions = [
  { value: 'A', label: 'A (탁월)' },
  { value: 'B', label: 'B (우수)' },
  { value: 'C', label: 'C (보통)' },
  { value: 'D', label: 'D (미흡)' },
];

function HrCommonForm({ apiBase, currentUser, step }) {
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const targetEmpNo = currentUser.EMP_NO || currentUser.empNo;
  const targetUserNm = currentUser.USER_NM || currentUser.userNm || '';

  const stepLabelMap = {
    SELF: '자기평가',
    FIRST: '1차 평가',
    SECOND: '2차 평가',
  };

  const stepLabel = stepLabelMap[step] || step || '';

  const handleChange = (fieldCode, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldCode]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!step) {
      alert('평가 단계를 선택해 주세요.');
      return;
    }
    if (!targetEmpNo) {
      alert('사번 정보를 찾을 수 없습니다.');
      return;
    }

    const payload = {
      formCode: 'HR_COMMON',
      step,
      targetEmpNo,
      evaluatorEmpNo: currentUser.EMP_NO || currentUser.empNo,
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
      alert('인사평가서가 저장되었습니다.');
    } catch (e) {
      console.error(e);
      alert('인사평가서 저장 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderGradeRow = (label, fieldCode) => (
    <div className="eval-grade-row">
      <div className="eval-row">
        <label>{label}</label>
      </div>
      <select
        className="eval-select"
        value={values[fieldCode] || ''}
        onChange={(e) => handleChange(fieldCode, e.target.value)}
      >
        <option value="">선택</option>
        {gradeOptions.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div style={{ marginTop: '18px', marginBottom: '24px' }}>
      {/* 제목 카드 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">
            인사평가 {stepLabel && `(${stepLabel})`}
          </div>
          <div className="eval-card-subtitle">
            평가기간 동안의 역량, 성과, 태도에 대한 종합 평가를 입력합니다.
          </div>
        </div>

        {/* 기본 정보 */}
        <div className="eval-grid-2">
          <div className="eval-row">
            <label>평가년도</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_YEAR || ''}
              onChange={(e) => handleChange('HDR_YEAR', e.target.value)}
              placeholder="예: 2025"
            />
          </div>
          <div className="eval-row">
            <label>피평가자 이름</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_NAME || targetUserNm}
              onChange={(e) => handleChange('HDR_NAME', e.target.value)}
            />
          </div>
          <div className="eval-row">
            <label>부서</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_DEPT || ''}
              onChange={(e) => handleChange('HDR_DEPT', e.target.value)}
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
            <label>평가기간</label>
            <input
              className="eval-input"
              type="text"
              value={values.HDR_TERM || ''}
              onChange={(e) => handleChange('HDR_TERM', e.target.value)}
              placeholder="예: 2024.01 ~ 2024.12"
            />
          </div>
        </div>
      </div>

      {/* 능력 평가 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">능력 평가</div>
          <div className="eval-card-subtitle">
            직무 수행에 필요한 기본 역량과 리더십 역량 등을 평가합니다.
          </div>
        </div>

        <div className="eval-grid-1">
          {renderGradeRow('전문지식 / 직무이해', 'ABILITY_PROF')}
          {renderGradeRow('문제해결능력 / 분석력', 'ABILITY_PROBLEM')}
          {renderGradeRow('의사소통 / 협업능력', 'ABILITY_COMM')}
          {renderGradeRow('리더십 / 조직관리(해당 시)', 'ABILITY_LEAD')}
          {renderGradeRow('자기개발 / 학습의지', 'ABILITY_SELFDEV')}
        </div>
      </div>

      {/* 업무성과 평가 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">업무성과 평가</div>
          <div className="eval-card-subtitle">
            목표달성 수준과 업무 수행 결과를 평가합니다.
          </div>
        </div>

        <div className="eval-grid-1">
          {renderGradeRow('목표달성도', 'RESULT_GOAL')}
          {renderGradeRow('업무의 질(정확성 / 완성도)', 'RESULT_QUALITY')}
          {renderGradeRow('업무량 / 처리속도', 'RESULT_QUANTITY')}
          {renderGradeRow('기한준수 / 일정관리', 'RESULT_DEADLINE')}
        </div>
      </div>

      {/* 태도 평가 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">태도 평가</div>
          <div className="eval-card-subtitle">
            조직 구성원으로서의 태도와 규정 준수 정도를 평가합니다.
          </div>
        </div>

        <div className="eval-grid-1">
          {renderGradeRow('근무태도 / 책임감', 'ATTITUDE_RESP')}
          {renderGradeRow('협조성 / 대인관계', 'ATTITUDE_COOP')}
          {renderGradeRow('규정준수 / 윤리의식', 'ATTITUDE_RULE')}
          {renderGradeRow('창의성 / 개선의지', 'ATTITUDE_CREATIVE')}
        </div>
      </div>

      {/* 종합 의견 */}
      <div className="eval-card">
        <div className="eval-card-header">
          <div className="eval-card-title">종합 의견 및 개발 방향</div>
          <div className="eval-card-subtitle">
            피평가자의 강점/보완점과 향후 육성 방향을 서술합니다.
          </div>
        </div>

        <div className="eval-grid-1">
          <div className="eval-row">
            <label>종합 평가 의견</label>
          </div>
          <textarea
            className="eval-textarea"
            value={values.COMMENT_SUMMARY || ''}
            onChange={(e) =>
              handleChange('COMMENT_SUMMARY', e.target.value)
            }
          />

          <div className="eval-row" style={{ marginTop: 10 }}>
            <label>강점(Strength)</label>
          </div>
          <textarea
            className="eval-textarea"
            value={values.COMMENT_STRENGTH || ''}
            onChange={(e) =>
              handleChange('COMMENT_STRENGTH', e.target.value)
            }
          />

          <div className="eval-row" style={{ marginTop: 10 }}>
            <label>보완 필요 영역(Weakness)</label>
          </div>
          <textarea
            className="eval-textarea"
            value={values.COMMENT_WEAKNESS || ''}
            onChange={(e) =>
              handleChange('COMMENT_WEAKNESS', e.target.value)
            }
          />

          <div className="eval-row" style={{ marginTop: 10 }}>
            <label>능력개발 / 육성방향</label>
          </div>
          <textarea
            className="eval-textarea"
            value={values.COMMENT_DEVELOP || ''}
            onChange={(e) =>
              handleChange('COMMENT_DEVELOP', e.target.value)
            }
          />
        </div>
      </div>

      <button
        className="submit-btn"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? '저장 중...' : '인사평가 저장'}
      </button>
    </div>
  );
}

export default HrCommonForm;
