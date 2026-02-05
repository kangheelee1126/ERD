import React, { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { dataUtils } from './../../utils/dataUtils';
import { CommonCodeService , type CommonCodeDetail} from './../../services/CommonCodeService';
import { EmployeeService } from '../../services/Admin/EmployeeService';

interface EmployeeData {
    empId?: number;
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
    crtBy: string;
    updBy: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void; 
    data?: EmployeeData;
}

const EmployeeModal: React.FC<Props> = ({ isOpen, onClose, onSuccess, data }) => {
    const [formData, setFormData] = useState<EmployeeData>({
        empNo: '', empNm: '', email: '', phone: '',
        deptCd: '', positionNm: '', jobNm: '',
        hireDt: '', resignDt: '', 
        activeYn: 'Y', srHandleYn: 'N', note: '',
        crtBy: '', updBy: ''
    });

    const [deptList, setDeptList] = useState<CommonCodeDetail[]>([]);

    useEffect(() => {
        const initData = async () => {
            try {
                const res = await CommonCodeService.getDetails('SYS_DEPT');
                setDeptList(res);
            } catch (error) {
                console.error("부서 코드 로드 실패:", error);
            }
        };

        if (isOpen) {
            initData();
            if (data) {
                // ✨ [수정 모드 보정] 서버의 null 값을 빈 문자열로 치환하고 날짜 형식을 맞춥니다. [cite: 2026-02-05]
                setFormData({
                    ...data,
                    // hireDt, resignDt가 ISO 형식이면 YYYY-MM-DD로 자릅니다.
                    hireDt: data.hireDt ? data.hireDt.substring(0, 10) : '',
                    resignDt: data.resignDt ? data.resignDt.substring(0, 10) : '',
                    // crtBy가 누락되지 않도록 확실히 바인딩합니다. [cite: 2026-02-05]
                    crtBy: data.crtBy ?? '',
                    email: data.email ?? '',
                    phone: data.phone ?? '',
                    positionNm: data.positionNm ?? '',
                    jobNm: data.jobNm ?? '',
                    note: data.note ?? '',
                });
            } else {
                setFormData({
                    empNo: '', empNm: '', email: '', phone: '', deptCd: '',
                    positionNm: '', jobNm: '', hireDt: '', resignDt: '',
                    activeYn: 'Y', srHandleYn: 'N', note: '',
                    crtBy: '', updBy: ''
                });
            }
        }
    }, [data, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: EmployeeData) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!formData.empNo || !formData.empNm || !formData.deptCd) {
            alert('필수 항목(*)을 모두 입력해주세요.');
            return;
        }
        
        try {
            // ✨ [핵심] 'empId'를 기준으로 신규/수정을 판단하여 감사 필드를 주입합니다. [cite: 2026-01-30]
            const saveData = dataUtils.injectAuditFields(formData, 'empId');
            
            // 400 에러 발생 시 Payload를 확인하기 위한 로그
            console.log("전송 데이터(Payload):", saveData);

            await EmployeeService.saveEmployee(saveData);
            alert('성공적으로 저장되었습니다.');
            onSuccess(); 
            onClose();
        } catch (error: any) {
            // 서버 유효성 검사 에러(400) 상세 출력 [cite: 2026-02-05]
            if (error.response && error.response.data) {
                console.error("서버 에러 상세:", error.response.data);
            }
            alert("저장 중 오류가 발생했습니다. (사유: " + (error.response?.data?.title || "Unknown Error") + ")");
        }
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
                            <col width="15%" /><col width="35%" /><col width="15%" /><col width="35%" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>사번/ID <span className="req">*</span></th>
                                <td>
                                    <input type="text" name="empNo" 
                                           className={`form-input ${data ? "readonly-text" : ""}`} 
                                           readOnly={!!data} value={formData.empNo} onChange={handleInputChange} />
                                </td>
                                <th>직원명 <span className="req">*</span></th>
                                <td><input type="text" name="empNm" className="form-input" value={formData.empNm} onChange={handleInputChange} /></td>
                            </tr>
                            <tr>
                                <th>이메일</th>
                                <td><input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} /></td>
                                <th>전화번호</th>
                                <td><input type="text" name="phone" className="form-input" value={formData.phone} onChange={handleInputChange} /></td>
                            </tr>
                            <tr>
                                <th>부서코드 <span className="req">*</span></th>
                                <td>
                                    <select name="deptCd" className="page-select" style={{ width: '100%' }} value={formData.deptCd} onChange={handleInputChange}>
                                        <option value="">부서 선택</option>
                                        {deptList.map(c => <option key={c.code_cd} value={c.code_cd}>{c.code_nm}</option>)}
                                    </select>
                                </td>
                                <th>직급명</th>
                                <td><input type="text" name="positionNm" className="form-input" value={formData.positionNm} onChange={handleInputChange} /></td>
                            </tr>
                            <tr>
                                <th>직무명</th>
                                <td><input type="text" name="jobNm" className="form-input" value={formData.jobNm} onChange={handleInputChange} /></td>
                                <th>SR 담당 여부 <span className="req">*</span></th>
                                <td>
                                    <select name="srHandleYn" className="page-select" style={{ width: '100%' }} value={formData.srHandleYn} onChange={handleInputChange}>
                                        <option value="N">미대상 (N)</option>
                                        <option value="Y">담당 (Y)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>입사일</th>
                                <td><input type="date" name="hireDt" className="form-input date-input" value={formData.hireDt} onChange={handleInputChange} /></td>
                                <th>퇴사일</th>
                                <td><input type="date" name="resignDt" className="form-input date-input" value={formData.resignDt} onChange={handleInputChange} /></td>
                            </tr>
                            <tr>
                                <th>재직여부 <span className="req">*</span></th>
                                <td colSpan={3} style={{ textAlign: 'left' }}>
                                    <select 
                                        name="activeYn" 
                                        className="page-select" 
                                        style={{ width: '150px' }} 
                                        value={formData.activeYn} 
                                        onChange={handleInputChange}
                                    >
                                        <option value="Y">재직 (Y)</option>
                                        <option value="N">퇴사 (N)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>비고 (NOTE)</th>
                                <td colSpan={3}>
                                    <textarea 
                                        name="note" 
                                        className="form-input" 
                                        style={{ height: '100px', padding: '10px', resize: 'none', width: '100%' }} 
                                        value={formData.note} 
                                        onChange={handleInputChange}
                                        placeholder="추가적인 정보를 입력하세요."
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className="btn-group">
                    <div className="btn-action-group">
                        <button className="btn-primary" onClick={handleSave}><Save size={14} /> 정보 저장</button>
                        <button className="cm-btn" onClick={onClose}><X size={14} /> 취소</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeModal;