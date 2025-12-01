// components/Evaluation/Evaluation.js
import React, { useEffect, useState } from 'react';
import './Evaluation.css';

const API_BASE =
  'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app';

function Evaluation({ currentUser }) {
  const [formTypes, setFormTypes] = useState([]);   // 문서 종류 목록
  const [selectedForm, setSelectedForm] = useState(''); // 선택된 formCode
  const [selectedStep, setSelectedStep] = useState(''); // SELF / FIRST / ...
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState([]);         // 선택된 문서 레이아웃 필드들
  const [values, setValues] = useState({});         // 입력 값

  // ============================
  // 1) 문서 타입 목록 백엔드에서 불러오기
  // ============================
  useEffect(() => {
    const fetchFormTypes = async () => {
      try {
        const res = await fetch(`${API_BASE}/eval/forms`);
        if (!res.ok) throw new Error('Failed to load form list');

        const json = await res.json();
        console.log('[DEBUG] /eval/forms 응답', json);

        // json이 배열이거나, {data:[...]} 형식이거나, 다른 키일 수도 있어서 방어적으로 처리
        let list = [];
        if (Array.isArray(json)) {
          list = json;
        } else if (Array.isArray(json.data)) {
          list = json.data;
        } else if (Array.isArray(json.result)) {
          list = json.result;
        }

        setFormTypes(list || []);
      } catch (err) {
        console.error(err);
        setFormTypes([]);
      }
    };

    fetchFormTypes();
  }, []);

  // 선택된 formCode 에 해당하는 form 객체
  const selectedFormObj = Array.isArray(formTypes)
    ? formTypes.find((f) => f.formCode === selectedForm || f.form_code === selectedForm)
    : null;

  // 선택된 form 에 대한 단계 목록 (백엔드에서 steps 안 줄 경우 대비 기본값)
  const computedSteps =
    selectedFormObj?.steps ||
    (selectedForm === 'WORK_PLEDGE'
      ? ['PLEDGE']
      : selectedForm === 'HR_COMMON'
      ? ['SELF', 'FIRST', 'SECOND']
      : []);

  // ============================
  // 2) 문서 선택 시 → 해당 문서 레이아웃 조회
  // ============================
  const fetchFormLayout = async (formCode) => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/eval/layout?formCode=${formCode}`
      );
      if (!res.ok) throw new Error('Failed to load layout');

      const json = await res.json();
      console.log('[DEBUG] /eval/layout 응답', json);

      let list = [];
      if (Array.isArray(json)) {
        list = json;
      } else if (Array.isArray(json.data)) {
        list = json.data;
      } else if (Array.isArray(json.result)) {
        list = json.result;
      }

      setFields(list || []);
      setValues({});
    } catch (err) {
      console.error(err);
      setFields([]);
    }

    setLoading(false);
  };

  const handleFormSelect = (e) => {
    const code = e.target.value;
    setSelectedForm(code);
    setSelectedStep('');
    setFields([]);
    setValues({});

    if (code) {
      fetchFormLayout(code);
    }
  };

  const handleStepSelect = (e) => {
    setSelectedStep(e.target.value);
  };

  // ============================
  // 3) 입력 변화
  // ============================
  const handleChange = (fieldCode, value) => {
    setValues((prev) => ({
      ...prev,
      [fieldCode]: value,
    }));
  };

  // ============================
  // 4) 제출
  // ============================
  const handleSubmit = async () => {
    if (!selectedForm || !selectedStep) {
      alert('문서와 단계를 선택해 주세요');
      return;
    }

    const targetEmpNo = currentUser?.EMP_NO || currentUser?.empNo;
    const evaluatorEmpNo = currentUser?.EMP_NO || currentUser?.empNo;

    if (!targetEmpNo) {
      alert('현재 로그인 사용자 사번(EMP_NO)을 찾을 수 없습니다.');
      return;
    }

    const payload = {
      formCode: selectedForm,
      step: selectedStep,
      targetEmpNo,
      evaluatorEmpNo,
      values,
    };

    try {
      const res = await fetch(`${API_BASE}/eval/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Submit failed');

      const json = await res.json().catch(() => null);
      console.log('submit result: ', json);

      alert('저장되었습니다.');
    } catch (err) {
      console.error(err);
      alert('오류가 발생했습니다.');
    }
  };

  // ============================
  // 0) 로그인 안 되어 있으면 안내만
  // ============================
  if (!currentUser) {
    return (
      <div className="evaluation-container">
        <h2>문서 작성</h2>
        <div style={{ color: '#888', marginTop: '8px' }}>
          먼저 상단에서 사원을 선택(로그인)해 주세요.
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-container">
      <h2>문서 작성</h2>

      {/* 문서 선택 */}
      <div className="eval-section">
        <label>문서 선택</label>
        <select value={selectedForm} onChange={handleFormSelect}>
          <option value="">-- 선택 --</option>
          {Array.isArray(formTypes) &&
            formTypes.map((form, idx) => {
              const formCode = form.formCode || form.form_code;
              const formName = form.formName || form.form_name;
              const positionGroup = form.positionGroup || form.position_group;

              return (
                <option
                  key={(formCode || 'code') + (positionGroup || '') + idx}
                  value={formCode}
                >
                  {positionGroup
                    ? `${formName} (${positionGroup})`
                    : formName}
                </option>
              );
            })}
        </select>
      </div>

      {/* 단계 선택 (SELF/FIRST/SECOND 등) */}
      {selectedForm && (
        <div className="eval-section">
          <label>평가 단계</label>
          <select value={selectedStep} onChange={handleStepSelect}>
            <option value="">-- 단계 선택 --</option>
            {computedSteps.map((step) => (
              <option key={step} value={step}>
                {step}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 필드 렌더링 */}
      {loading && <div>불러오는 중...</div>}

      {!loading &&
        selectedForm &&
        Array.isArray(fields) &&
        fields.map((f, idx) => {
          const fieldCode = f.fieldCode || f.field_code;
          const fieldLabel = f.fieldLabel || f.field_label;
          const rawType = f.fieldType || f.field_type || 'TEXT';
          const fieldType = String(rawType).toUpperCase();

          return (
            <div key={(fieldCode || 'field') + idx} className="eval-field">
              <label>{fieldLabel}</label>

              {fieldType === 'TEXT' && (
                <input
                  type="text"
                  value={values[fieldCode] || ''}
                  onChange={(e) =>
                    handleChange(fieldCode, e.target.value)
                  }
                />
              )}

              {fieldType === 'NUMBER' && (
                <input
                  type="number"
                  value={values[fieldCode] || ''}
                  onChange={(e) =>
                    handleChange(fieldCode, e.target.value)
                  }
                />
              )}

              {fieldType === 'TEXTAREA' && (
                <textarea
                  value={values[fieldCode] || ''}
                  onChange={(e) =>
                    handleChange(fieldCode, e.target.value)
                  }
                />
              )}

              {fieldType === 'SELECT' && (
                <select
                  value={values[fieldCode] || ''}
                  onChange={(e) =>
                    handleChange(fieldCode, e.target.value)
                  }
                >
                  <option value="">-- 선택 --</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              )}
            </div>
          );
        })}

      {/* 제출 */}
      {selectedForm && (
        <button className="submit-btn" onClick={handleSubmit}>
          저장하기
        </button>
      )}
    </div>
  );
}

export default Evaluation;
