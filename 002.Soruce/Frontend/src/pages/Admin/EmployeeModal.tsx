import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { dataUtils } from './../../utils/dataUtils'; // 감사 필드 주입 유틸 [cite: 2026-01-30]

/* 직원 마스터 데이터 인터페이스 정의 (image_a8f193.png 기준) [cite: 2026-02-03] */
interface EmployeeData {
    empNo: string;
    empNm: string;
    email: string;
    phone: string;
    deptCd: string;
    positionNm: string;
    jobNm: string;
    hireDt: string;
    resignDt: string;
    activeYn: 'Y' | 'N';
    srHandleYn: 'Y' | 'N';
    note: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    data?: EmployeeData;
}

const EmployeeModal: React.FC<Props> = ({ isOpen, onClose, data }) => {
    /* 1. 로컬 상태 관리 (그룹코드 삭제 반영) [cite: 2026-02-03] */
    const [formData, setFormData] = useState<EmployeeData>({
        empNo: '', empNm: '', email: '', phone: '',
        deptCd: '', positionNm: '', jobNm: '',
        hireDt: '', resignDt: '', activeYn: 'Y',
        srHandleYn: 'N', note: ''
    });

    /* 2. 데이터 초기화 (Controlled Component) [cite: 2026-01-30] */
    useEffect(() => {
        if (data) {
            setFormData({ ...data });
        } else {
            setFormData({
                empNo: '', empNm: '', email: '', phone: '', deptCd: '',
                positionNm: '', jobNm: '', hireDt: '', resignDt: '',
                activeYn: 'Y', srHandleYn: 'N', note: ''
            });
        }
    }, [data, isOpen]);

    /* 3. 통합 입력 핸들러 (TS7006 'prev' 형식 에러 해결) [cite: 2026-01-30] */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: EmployeeData) => ({
            ...prev,
            [name]: value
        }));
    };

    /* 4. 정보 저장 로직 (Audit Fields 주입) [cite: 2026-01-30, 2026-02-03] */
    const handleSave = () => {
        if (!formData.empNo || !formData.empNm || !formData.deptCd) {
            alert('필수 항목(*)을 모두 입력해주세요.');
            return;
        }
        
        // CRT_BY, UPD_BY 등 감사 필드 주입 [cite: 2026-01-30]
        const saveData = dataUtils.injectAuditFields(formData);
        console.log('최종 저장 데이터:', saveData);
        
        // TODO: EmployeeService.saveEmployee(saveData) 연동
        alert('성공적으로 저장되었습니다.');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '1100px' }}>
                <div className="modal-header">
                    <h3>{data ? '직원 정보 수정' : '신규 직원 등록'}</h3>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>
                
                <div className="modal-body">
                    <table className="standard-table" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                            <col width="15%" /><col width="35%" />
                            <col width="15%" /><col width="35%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>사번 (ID) <span className="req">*</span></th>
                                <td>
                                    <input 
                                        type="text" name="empNo"
                                        className={`form-input ${data ? "readonly-text" : ""}`} 
                                        readOnly={!!data} // PK 수정 방지 [cite: 2026-01-29]
                                        value={formData.empNo || ''}
                                        onChange={handleInputChange}
                                        placeholder="사번 입력"
                                    />
                                </td>
                                <th>성명 <span className="req">*</span></th>
                                <td>
                                    <input 
                                        type="text" name="empNm" className="form-input" 
                                        value={formData.empNm || ''} onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td>
                                    <input 
                                        type="email" name="email" className="form-input" 
                                        value={formData.email || ''} onChange={handleInputChange}
                                    />
                                </td>
                                <th>전화번호</th>
                                <td>
                                    <input 
                                        type="text" name="phone" className="form-input" 
                                        value={formData.phone || ''} onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>부서 (DEPT) <span className="req">*</span></th>
                                <td>
                                    <select 
                                        name="deptCd" className="page-select" style={{ width: '100%' }}
                                        value={formData.deptCd || ''} onChange={handleInputChange}
                                    >
                                        <option value="">부서 선택</option>
                                        <option value="DEPT_01">개발팀</option>
                                        <option value="DEPT_02">경영지원팀</option>
                                        <option value="DEPT_03">영업팀</option>
                                    </select>
                                </td>
                                <th>직급명</th>
                                <td>
                                    <input 
                                        type="text" name="positionNm" className="form-input" 
                                        value={formData.positionNm || ''} onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <th>직무명</th>
                                <td>
                                    <input 
                                        type="text" name="jobNm" className="form-input" 
                                        value={formData.jobNm || ''} onChange={handleInputChange}
                                    />
                                </td>
                                <th>SR 처리 담당</th>
                                <td>
                                    <select 
                                        name="srHandleYn" className="page-select" style={{ width: '100%' }}
                                        value={formData.srHandleYn || 'N'} onChange={handleInputChange}
                                    >
                                        <option value="N">미대상</option>
                                        <option value="Y">담당</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>입사일</th>
                                <td>
                                    <input 
                                        type="date" name="hireDt" className="form-input date-input" 
                                        value={formData.hireDt || ''} onChange={handleInputChange}
                                    />
                                </td>
                                <th>퇴사일</th>
                                <td>
                                    <input 
                                        type="date" name="resignDt" className="form-input date-input" 
                                        value={formData.resignDt || ''} onChange={handleInputChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                {/* ✨ 재직여부: 콤보박스로 변경 및 왼쪽 정렬 레이아웃 적용 [cite: 2026-02-03] */}
                                <th>재직여부 <span className="req">*</span></th>
                                <td style={{ textAlign: 'left' }}>
                                    <select 
                                        name="activeYn" 
                                        className="page-select" 
                                        style={{ width: '150px' }} // 적절한 너비로 왼쪽 배치
                                        value={formData.activeYn || 'Y'} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="Y">재직</option>
                                        <option value="N">퇴사</option>
                                    </select>
                                </td>
                                <td colSpan={2}></td> {/* 줄 맞춤을 위한 빈 칸 */}
                            </tr>
                            <tr>
                                <th>비고 (NOTE)</th>
                                <td colSpan={3}>
                                    <textarea 
                                        name="note" className="form-input" 
                                        style={{ height: '80px', padding: '10px' }}
                                        value={formData.note || ''} onChange={handleInputChange}
                                    ></textarea>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="btn-group">
                    <div className="btn-action-group">
                        <button className="btn-primary" onClick={handleSave}>
                            <Save size={16} /> 정보 저장
                        </button>
                        <button className="btn-secondary" onClick={onClose}>
                            <X size={16} /> 취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;