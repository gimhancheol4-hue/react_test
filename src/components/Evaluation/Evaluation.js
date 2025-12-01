// components/Evaluation/Evaluation.js
import React, { useEffect, useState } from 'react';
import './Evaluation.css';
import WorkPledgeForm from './WorkPledgeForm';
import HrCommonForm from './HrCommonForm';
// 나중에 ProjectMemberForm, ProjectPmForm 등 추가

const API_BASE =
  'https://ue5d259c495b65fd767b5629d1f4c8d60.apppaas.app';

function Evaluation({ currentUser }) {
  const [formTypes, setFormTypes] = useState([]);
  const [selectedForm, setSelectedForm] = useState('');
  const [selectedStep, setSelectedStep] = useState('');

  useEffect(() => {
    const fetchFormTypes = async () => {
      try {
        const res = await fetch(`${API_BASE}/eval/forms`);
      const json = await res.json();
        const list = Array.isArray(json) ? json : json.data;
        setFormTypes(list || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchFormTypes();
  }, []);

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

  const handleFormSelect = (e) => {
    setSelectedForm(e.target.value);
    setSelectedStep('');
  };

  const handleStepSelect = (e) => {
    setSelectedStep(e.target.value);
  };

  // 선택된 양식에 따라 어떤 컴포넌트를 쓸지 매핑
  const renderFormComponent = () => {
    if (!selectedForm) return null;

    switch (selectedForm) {
      case 'WORK_PLEDGE':
        return (
          <WorkPledgeForm
            apiBase={API_BASE}
            currentUser={currentUser}
          />
        );
      case 'HR_COMMON':
        return (
          <HrCommonForm
            apiBase={API_BASE}
            currentUser={currentUser}
            step={selectedStep}  // SELF/FIRST/SECOND
          />
        );
      // case 'PRJ_MEMBER':
      //   return <ProjectMemberForm ... />
      default:
        return (
          <div style={{ marginTop: '16px', color: '#888' }}>
            아직 전용 화면이 없는 양식입니다. (selectedForm: {selectedForm})
          </div>
        );
    }
  };

  // HR_COMMON일 때만 단계 선택이 의미 있다고 가정
  const needStep =
    selectedForm === 'HR_COMMON'; // 필요하면 다른 formCode도 추가

  return (
    <div className="evaluation-container">
      <h2>문서 작성</h2>

      {/* 문서 선택 */}
      <div className="eval-section">
        <label>문서 선택</label>
        <select value={selectedForm} onChange={handleFormSelect}>
          <option value="">-- 선택 --</option>
          {formTypes.map((form) => (
            <option
              key={form.formCode + (form.positionGroup || '')}
              value={form.formCode}
            >
              {form.positionGroup
                ? `${form.formName} (${form.positionGroup})`
                : form.formName}
            </option>
          ))}
        </select>
      </div>

      {/* 단계 선택 (필요한 양식만) */}
      {needStep && (
        <div className="eval-section">
          <label>평가 단계</label>
          <select value={selectedStep} onChange={handleStepSelect}>
            <option value="">-- 단계 선택 --</option>
            <option value="SELF">자기평가</option>
            <option value="FIRST">1차평가</option>
            <option value="SECOND">2차평가</option>
          </select>
        </div>
      )}

      {/* 여기부터는 양식별 전용 화면 */}
      {renderFormComponent()}
    </div>
  );
}

export default Evaluation;
