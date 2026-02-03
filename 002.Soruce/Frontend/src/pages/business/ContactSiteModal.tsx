import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import { ContactService } from '../../services/ContactService';
import { CustomerService } from '../../services/CustomerService';
import SiteSearchModal from './../../components/modals/SiteSearchModal';
import { dataUtils } from '../../utils/dataUtils';

interface ContactSiteMap {
    contactSiteMapId: number;
    contactId: number;
    siteId: number;
    siteNm: string;
    roleCd: string;
    isPrimary: string;
    startDt: string;
    endDt: string;
    note: string;
}

interface ContactSiteModalProps {
    isOpen: boolean;
    onClose: () => void;
    contactId: number | null;
    contactName: string;
    customerId: number | null; // 이 부분이 추가되어야 2322 에러가 사라집니다.
}

const ContactSiteModal: React.FC<ContactSiteModalProps> = ({ isOpen, onClose, contactId, contactName , customerId}) => {
    const [mappingList, setMappingList] = useState<ContactSiteMap[]>([]);
    const [roles, setRoles] = useState<any[]>([]); // SITE_ROLE 공통코드
    const [isLoading, setIsLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // 데이터 로드: 연결 내역 및 공통코드 동시 조회
    const loadInitialData = async () => {
        if (!contactId) return;
        setIsLoading(true);
        try {
            const [mappingRes, roleData]: any = await Promise.all([
                ContactService.getContactSiteMaps(contactId),
                CustomerService.getCommonCodes('SITE_ROLE')
            ]);
            
            // AxiosResponse 객체에서 데이터 추출
            setMappingList(mappingRes.data || []);
            setRoles(roleData || []);
        } catch (e) {
            alert("데이터 로드 실패:");
            console.error("데이터 로드 실패:", e);
            setMappingList([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && contactId) loadInitialData();
    }, [isOpen, contactId]);

    // 검색 팝업에서 선택한 사업장 추가 (대문자 스키마 매핑)
    const handleSiteSelect = (selectedSites: any[]) => {
        const today = new Date();
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(today.getMonth() + 6);
        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const newMappings = selectedSites
            .filter(site => !mappingList.some(m => m.siteId === site.SITE_ID))
            .map(site => ({
                contactSiteMapId: 0,
                contactId: contactId!,
                siteId: site.siteId, // DB 스키마 대문자 대응
                siteNm: site.siteNm, // DB 스키마 대문자 대응
                roleCd: '',
                isPrimary: 'N',
                startDt: formatDate(today),
                endDt: formatDate(sixMonthsLater),
                note: ''
            }));

        setMappingList([...mappingList, ...newMappings]);
    };

    const updateField = (siteId: number, field: keyof ContactSiteMap, value: any) => {
        setMappingList(prev => prev.map(m => m.siteId === siteId ? { ...m, [field]: value } : m));
    };

    const removeRow = (siteId: number) => {
        if (window.confirm("선택한 사업장 연결을 삭제하시겠습니까?")) {
            setMappingList(prev => prev.filter(m => m.siteId !== siteId));
        }
    };

    const handleSave = async () => {
        if (mappingList.length > 0 && !mappingList.some(m => m.isPrimary === 'Y')) {
            alert("최소 한 개의 사업장은 '대표'로 지정되어야 합니다.");
            return;
        }

        try {
            // Audit 필드 주입 (CRT_BY, UPD_BY 등)
            const saveData = dataUtils.injectAuditFields(mappingList, 'contactSiteMapId');
            await ContactService.saveContactSiteMaps(contactId!, saveData);
            alert("사업장 연결 정보가 성공적으로 저장되었습니다.");
            onClose();
        } catch (e) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '1200px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <MapPin size={20} color="var(--primary-color)" />
                        <h3 style={{ margin: 0 }}>
                            사업장 연결 관리 <span className="sub-title">- {contactName} 님</span>
                        </h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div className="part-header" style={{ marginBottom: '10px' }}>
                        <div className="header-left">
                            <span className="description-text">* 담당자가 관리하는 사업장을 선택하고 역할을 설정하세요.</span>
                        </div>
                        <div className="header-right">
                            <button className="cm-btn edit" onClick={() => setShowSearch(true)}>
                                <Plus size={14} /> 사업장 선택 추가
                            </button>
                        </div>
                    </div>

                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                        <table className="standard-table">
                            <colgroup>
                                <col width="220px" />
                                <col width="160px" />
                                <col width="70px" />
                                <col width="140px" />
                                <col width="140px" />
                                <col width="*" />
                                <col width="100px" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>사업장 명칭</th><th>역할</th><th>대표</th>
                                    <th>시작일</th><th>종료일</th><th>비고</th><th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={7} className="center" style={{ padding: '40px' }}>
                                            <Loader2 size={24} className="spinner" />
                                            <div style={{ marginTop: '10px' }}>데이터 로딩 중...</div>
                                        </td>
                                    </tr>
                                ) : mappingList.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                                            연결된 사업장이 없습니다. '사업장 선택 추가'를 클릭하세요.
                                        </td>
                                    </tr>
                                ) : (
                                    mappingList.map((item) => (
                                        <tr key={item.siteId}>
                                            <td className="left highlight-text">{item.siteNm}</td>
                                            <td>
                                                <select 
                                                    className="page-select" 
                                                    style={{ width: '100%', height: '32px' }}
                                                    value={item.roleCd} 
                                                    onChange={(e) => updateField(item.siteId, 'roleCd', e.target.value)}
                                                >
                                                    <option value="">역할 선택</option>
                                                    {roles.map((r: any) => (
                                                        <option key={r.code} value={r.code}>{r.name}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="center">
                                                <input 
                                                    type="radio" 
                                                    name={`primary-site-${contactId}`} // ✨ 담당자별 고유 name 부여
                                                    checked={item.isPrimary === 'Y'} 
                                                    onChange={() => {
                                                        // ✨ 전체 리스트를 순회하며 선택된 행만 'Y', 나머지는 'N' 처리
                                                        setMappingList(prev => prev.map(m => ({
                                                            ...m,
                                                            isPrimary: m.siteId === item.siteId ? 'Y' : 'N'
                                                        })));
                                                    }} 
                                                />
                                            </td>
                                            <td>
                                                <input type="date" className="form-input" value={item.startDt} onChange={(e) => updateField(item.siteId, 'startDt', e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="date" className="form-input" value={item.endDt} onChange={(e) => updateField(item.siteId, 'endDt', e.target.value)} />
                                            </td>
                                            <td>
                                                <input type="text" className="form-input" style={{ width: '100%' }} value={item.note || ''} onChange={(e) => updateField(item.siteId, 'note', e.target.value)} />
                                            </td>
                                            <td className="center">
                                                <button className="cm-btn delete" onClick={() => removeRow(item.siteId)}>
                                                    <Trash2 size={14} /> 삭제
                                                </button>
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

            <SiteSearchModal 
                isOpen={showSearch} 
                onClose={() => setShowSearch(false)} 
                onSelect={handleSiteSelect} 
                customerId={customerId}
            />
        </div>
    );
};

export default ContactSiteModal;