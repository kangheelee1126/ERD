import React, { useState, useEffect, useCallback } from 'react';
import api from './../../api/http'; // 공통 axios 인스턴스 사용
import { Upload, Download, Trash2, Files, FileUp } from 'lucide-react';
import './FileUploader.css'; // 별도 CSS 파일 사용

interface FileUploaderProps {
  refType: string;
  refId: string;
  onRefresh?: () => void;
}

const FileUploader = ({ refType, refId, onRefresh }: FileUploaderProps) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 1. 파일 목록 조회 (방어적 배열 처리)
  const fetchFileList = useCallback(async () => {
    if (!refId) return;
    try {
      // 경로 표준에 맞춰  추가 확인 필요 [cite: 2026-02-03]
      const res = await api.get(`/business/FileMaster/List/${refType}/${refId}`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setFileList(data);
    } catch (err) {
      console.error("파일 목록 조회 오류", err);
      setFileList([]);
    }
  }, [refType, refId]);

  useEffect(() => { fetchFileList(); }, [fetchFileList]);

  // 2. 멀티 파일 업로드 (순차 처리) [cite: 2026-01-30]
  const uploadFiles = async (files: File[]) => {
    for (const file of files) {
      const tempId = Math.random().toString(36).substring(7);
      const formData = new FormData();
      formData.append('files', file); // 백엔드 List<IFormFile> 명칭 일치

      setUploadingFiles(prev => [...prev, { id: tempId, name: file.name, progress: 0 }]);

      try {
        await api.post(`/business/FileMaster/Upload/${refType}/${refId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }, //
          onUploadProgress: (p) => {
            const percent = Math.round((p.loaded * 100) / (p.total ?? p.loaded));
            setUploadingFiles(prev => prev.map(u => u.id === tempId ? { ...u, progress: percent } : u));
          }
        });
        
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(u => u.id !== tempId));
          fetchFileList();
          if (onRefresh) onRefresh();
        }, 500);
      } catch (err) {
        alert(`${file.name} 업로드 중 오류가 발생했습니다.`);
        setUploadingFiles(prev => prev.filter(u => u.id !== tempId));
      }
    }
  };

  // 3. 파일 다운로드 (인증 토큰 포함 방식)
  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await api.get(`/business/FileMaster/Download/${fileId}`, {
        responseType: 'blob', // ✨ 바이너리 데이터 응답 설정 [cite: 2026-02-05]
      });

      // 브라우저 다운로드 트리거
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 실패", err);
      alert("파일 다운로드 권한이 없거나 오류가 발생했습니다.");
    }
  };

  // 4. 드래그 앤 드롭 핸들러
  const handleDrag = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(e.type === "dragover"); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) uploadFiles(Array.from(e.dataTransfer.files));
  };

  // 5. 파일 삭제 (컨펌 지침 준수) [cite: 2026-01-29]
  const handleDelete = async (fileId: string) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await api.delete(`/business/FileMaster/Delete/${fileId}`);
        fetchFileList();
        if (onRefresh) onRefresh();
      } catch (err) {
        alert("삭제 처리에 실패했습니다.");
      }
    }
  };

  return (
    <div className="file-uploader-wrapper">
      <div className="part-header">
        <div className="part-left">
          <Files size={16} />
          <span className="part-title">첨부파일 목록</span>
          {/* ✨ 눈에 띄게 변경된 건수 배지 */}
          <span className={`data-count-badge ${fileList.length > 0 ? 'has-data' : ''}`}>
            전체 <strong>{fileList.length}</strong>건
          </span>
        </div>
        <div className="part-right">
          <input type="file" id="file-input-multi" multiple onChange={(e) => uploadFiles(Array.from(e.target.files || []))} style={{ display: 'none' }} />
          <label htmlFor="file-input-multi" className="cm-btn btn-primary" style={{ cursor: 'pointer' }}>
            <Upload size={14} /> 파일 업로드
          </label>
        </div>
      </div>

      <div 
        className={`drop-zone ${isDragging ? 'active' : ''}`}
        onDragOver={handleDrag} onDragLeave={handleDrag} onDrop={handleDrop}
      >
        <FileUp size={24} style={{ color: isDragging ? 'var(--primary-color)' : '#94a3b8' }} />
        <p>파일을 이 영역으로 드래그하거나 버튼을 클릭하세요.</p>
      </div>

      {uploadingFiles.length > 0 && (
        <div className="upload-progress-container">
          {uploadingFiles.map(u => (
            <div key={u.id} className="progress-row">
              <div className="progress-info">
                <span>{u.name}</span>
                <span>{u.progress}%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${u.progress}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      <table className="standard-table">
        <colgroup>
          <col width="60px" /><col width="*" /><col width="100px" /><col width="160px" /><col width="180px" />
        </colgroup>
        <thead>
          <tr>
            <th>No</th><th>파일명</th><th>크기</th><th>등록일</th><th>관리</th>
          </tr>
        </thead>
        <tbody>
          {(fileList.length === 0 && uploadingFiles.length === 0) ? (
            <tr><td colSpan={5} className="text-center" style={{padding: '40px', color: 'var(--text-secondary)'}}>첨부된 파일이 없습니다.</td></tr>
          ) : (
            fileList.map((f, idx) => (
              <tr key={f.fileId || idx}>
                <td className="text-center">{idx + 1}</td>
                <td className="left">{f.originNm}</td>
                <td className="right">{(f.fileSize / 1024).toFixed(1)} KB</td>
                <td className="text-center">{f.crtDt}</td>
                <td className="text-center">
                  <div className="btn-group-center">
                    <button className="cm-btn edit" onClick={() => handleDownload(f.fileId, f.originNm)}>
                      <Download size={14} /> 다운로드
                    </button>&nbsp;
                    <button className="cm-btn delete" onClick={() => handleDelete(f.fileId)}>
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileUploader;