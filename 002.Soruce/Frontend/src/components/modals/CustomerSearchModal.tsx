import React, { useState, useEffect } from 'react';
import { Search, X, Check } from 'lucide-react';
import { CustomerService, type Customer } from '../../services/CustomerService';
import '../../style/common-layout.css'; // 공통 CSS 사용

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (customer: Customer) => void;
}

const CustomerSearchModal: React.FC<Props> = ({ isOpen, onClose, onSelect }) => {
    const [keyword, setKeyword] = useState('');
    const [list, setList] = useState<Customer[]>([]);

    // 팝업 열릴 때 초기화 및 자동 전체 조회
    useEffect(() => {
        if (isOpen) {
            setKeyword('');
            searchCustomers('');
        }
    }, [isOpen]);

    const searchCustomers = async (searchParams: string) => {
        try {
            // 기존 CustomerService 사용 (1페이지, 100건 조회)
            const result: any = await CustomerService.getCustomers(1, 100, searchParams);
            
            if (result.items) {
                setList(result.items);
            } else if (Array.isArray(result)) {
                setList(result);
            } else {
                setList([]);
            }
        } catch (e) {
            console.error("고객사 검색 실패:", e);
            setList([]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '600px', height: '600px' }}>
                {/* 헤더 */}
                <div className="modal-header">
                    <h3>고객사 검색</h3>
                    <button className="modal-close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                {/* 바디 */}
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {/* 검색바 */}
                    <div className="filter-bar" style={{ marginBottom: 0, padding: '10px' }}>
                        <div className="filter-item" style={{ flex: 1 }}>
                            <input 
                                className="filter-input" 
                                placeholder="고객사명 또는 코드 검색" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && searchCustomers(keyword)}
                                style={{ width: '100%' }}
                            />
                        </div>
                        <button className="btn-search" onClick={() => searchCustomers(keyword)}>
                            <Search size={14} /> 조회
                        </button>
                    </div>

                    {/* 리스트 (스크롤 영역) */}
                    <div style={{ flex: 1, overflow: 'auto', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                        <table className="standard-table">
                            <colgroup>
                                <col width="100px" /><col width="*" /><col width="70px" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>코드</th>
                                    <th>고객사명</th>
                                    <th>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((c) => (
                                    <tr key={c.customerId} className="hover-row">
                                        <td className="center">{c.custCd}</td>
                                        <td className="left">{c.custNm}</td>
                                        <td className="center">
                                            <button 
                                                className="btn-primary" 
                                                style={{ padding: '4px 10px', height: '26px' }}
                                                onClick={() => {
                                                    onSelect(c);
                                                    onClose();
                                                }}
                                            >
                                                <Check size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {list.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="center" style={{ padding: '30px', color: 'var(--text-secondary)' }}>
                                            검색 결과가 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerSearchModal;