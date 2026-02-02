import React, { useState, useEffect } from 'react';
import { X, Save, UserCheck, Loader2 } from 'lucide-react';
import { CommonCodeService } from '../../services/CommonCodeService';
import { ContactService } from '../../services/ContactService';
import { dataUtils } from '../../utils/dataUtils';

export interface ContactRole {
    roleCd: string;
    roleNm: string;
    isSelected: boolean;
    isPrimary: string;
    startDt: string;
    endDt: string;
    note?: string | null;
}

interface ContactRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactId: number | null;
    contactName: string;
}

const ContactRoleModal: React.FC<ContactRoleModalProps> = ({ isOpen, onClose, contactId, contactName }) => {
    const [roles, setRoles] = useState<ContactRole[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        if (!contactId) return;
        setIsLoading(true);

        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(today.getMonth() + 6); // ✨ 시작일 오늘, 종료일 6개월 뒤 계산 

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        try {
            const [allCodes, myRoles] = await Promise.all([
                CommonCodeService.getDetails('CONTACT_ROLE'),
                ContactService.getContactRoles(contactId)
            ]);

            const rawList = Array.isArray(allCodes) ? allCodes : (allCodes as any).items || [];
            const assignedRoles = myRoles || [];

            const merged = rawList.map((c: any) => {
                const myRole = assignedRoles.find((r: any) => r.roleCd === c.code_cd);
                return {
                    roleCd: c.code_cd,
                    roleNm: c.code_nm,
                    isSelected: !!myRole,
                    isPrimary: myRole?.isPrimary || 'N',
                    // ✨ 기본값 적용 로직 
                    startDt: myRole?.startDt?.split('T')[0] || formatDate(today),
                    endDt: myRole?.endDt?.split('T')[0] || formatDate(sixMonthsLater),
                    note: myRole?.note || ''
                };
            });

            setRoles(merged);
        } catch (e) {
            console.error("데이터 로드 중 오류 발생:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && contactId) loadData();
    }, [isOpen, contactId]);

    const toggleRole = (roleCd: string) => {
        setRoles(prev => prev.map(r => 
            r.roleCd === roleCd ? { ...r, isSelected: !r.isSelected, isPrimary: !r.isSelected ? r.isPrimary : 'N' } : r
        ));
    };

    const setPrimary = (roleCd: string) => {
        setRoles(prev => prev.map(r => ({
            ...r,
            isPrimary: r.roleCd === roleCd && r.isSelected ? 'Y' : 'N'
        })));
    };

    const updateRoleField = (roleCd: string, field: string, value: any) => {
        setRoles(prev => prev.map(r => r.roleCd === roleCd ? { ...r, [field]: value } : r));
    };

    const handleSave = async () => {
        const selectedData = roles.filter(r => r.isSelected);
        if (selectedData.length > 0 && !selectedData.some(r => r.isPrimary === 'Y')) {
            alert("선택된 역할 중 하나를 '대표'로 지정해 주세요.");
            return;
        }

        try {
            const saveData = dataUtils.injectAuditFields(selectedData, 'contactId');
            await ContactService.saveContactRoles(contactId!, saveData);
            alert("역할 설정이 저장되었습니다.");
            onClose();
        } catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            {/* ✨ 팝업 전체 너비를 1200px로 대폭 확장 */}
            <div className="modal-content" style={{ width: '1200px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <UserCheck size={20} color="var(--primary-color)" />
                        <h3 style={{ margin: 0 }}>
                            역할 설정 <span style={{fontSize:'0.9rem', color:'var(--text-secondary)', marginLeft:'4px'}}>- {contactName} 님</span>
                        </h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <p className="description-text" style={{ marginBottom: '15px' }}>
                        담당자에게 부여할 역할을 선택하고 기간과 상세 메모를 입력해 주세요. [cite: 2026-01-30]
                    </p>

                    <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
                        <table className="standard-table">
                            <colgroup>
                                <col width="50px" />   {/* 선택 */}
                                <col width="120px" />  {/* 역할명 */}
                                <col width="50px" />   {/* 대표 */}
                                <col width="80px" />  {/* 시작일 */}
                                <col width="80px" />  {/* 종료일 */}
                                <col width="180px" />      {/* 비고: 남은 모든 공간(약 660px) 할당 */}
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>선택</th><th>역할명</th><th>대표</th>
                                    <th>시작일</th><th>종료일</th><th>비고(상세 메모)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="center" style={{ padding: '40px' }}>
                                            <Loader2 size={24} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
                                            <div style={{ marginTop: '10px' }}>데이터 로딩 중... </div>
                                        </td>
                                    </tr>
                                ) : (
                                    roles.map((role) => (
                                        <tr key={role.roleCd}>
                                            <td className="center">
                                                <input type="checkbox" checked={role.isSelected} onChange={() => toggleRole(role.roleCd)} />
                                            </td>
                                            <td className="left highlight-text">{role.roleNm}</td>
                                            <td className="center">
                                                <input type="radio" name="primary-role" checked={role.isPrimary === 'Y'} 
                                                       disabled={!role.isSelected} onChange={() => setPrimary(role.roleCd)} />
                                            </td>
                                            <td>
                                                <input type="date" className="form-input" value={role.startDt} 
                                                       onChange={(e) => updateRoleField(role.roleCd, 'startDt', e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="date" className="form-input" value={role.endDt} 
                                                       onChange={(e) => updateRoleField(role.roleCd, 'endDt', e.target.value)} />
                                            </td>
                                            <td>
                                                {/* ✨ 입력창 너비를 100%로 설정하여 확장된 셀 전체 활용 */}
                                                <input 
                                                    type="text" 
                                                    className="form-input" 
                                                    style={{ width: '100%' }}
                                                    placeholder="역할에 대한 상세 메모를 입력해 주세요." 
                                                    value={role.note || ''} 
                                                    onChange={(e) => updateRoleField(role.roleCd, 'note', e.target.value)} 
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="btn-group">
                    <div className="btn-action-group">
                        <button className="cm-btn" onClick={onClose}><X size={14} /> 취소</button>
                        <button className="cm-btn edit" onClick={handleSave}><Save size={14} /> 설정 저장</button>
                    </div>
                </div>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default ContactRoleModal;