import React from 'react';
import { Save, X } from 'lucide-react';


interface Props {
    isOpen: boolean;
    onClose: () => void;
    data?: any;
}

const EmployeeModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '1200px' }}>
                <div className="modal-header">
                    <h3>{data ? '직원 정보 수정' : '신규 직원 등록'}</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="modal-body">
                    <table className="standard-table modal-form">
                        <colgroup>
                            <col width="150px" /><col width="*" />
                            <col width="150px" /><col width="*" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>사번 (ID)</th>
                                <td>
                                    {/* 수정 시 사번은 readonly-text 적용 [cite: 2026-01-29] */}
                                    <input 
                                        type="text" 
                                        className={data ? "readonly-text" : ""} 
                                        readOnly={!!data} 
                                        defaultValue={data?.empNo} 
                                    />
                                </td>
                                <th>성명</th>
                                <td><input type="text" /></td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td><input type="email" /></td>
                                <th>전화번호</th>
                                <td><input type="text" /></td>
                            </tr>
                            <tr>
                                <th>부서코드</th>
                                <td>
                                    <select className="page-select" style={{ width: '100%' }}>
                                        <option value="">부서 선택</option>
                                    </select>
                                </td>
                                <th>직급명</th>
                                <td><input type="text" /></td>
                            </tr>
                            <tr>
                                <th>입사일</th>
                                <td><input type="date" style={{ width: '100%' }} /></td>
                                <th>재직여부</th>
                                <td>
                                    <select className="page-select" style={{ width: '100%' }}>
                                        <option value="Y">재직</option>
                                        <option value="N">퇴직</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>비고 (NOTE)</th>
                                <td colSpan={3}>
                                    {/* 비고란 가변 너비(*) 확보 지침 준수 [cite: 2026-02-03] */}
                                    <textarea style={{ width: '100%', height: '80px' }}></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="modal-footer flex-center gap-3">
                    <button className="cm-btn edit" style={{ height: '40px', padding: '0 20px' }}>
                        <Save size={16} /> 정보 저장
                    </button>
                    <button className="cm-btn" onClick={onClose} style={{ height: '40px', padding: '0 20px' }}>
                        <X size={16} /> 취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;