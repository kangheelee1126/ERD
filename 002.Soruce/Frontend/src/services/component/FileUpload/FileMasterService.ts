import api from './../../../api/http';

/**
 * 파일 마스터 서비스 (프론트엔드)
 */
const FileMasterService = {
  /**
   * 참조 ID별 파일 목록 조회
   */
  getFileList: async (refType: string, refId: string) => {
    try {
      const response = await api.get(`/api/business/FileMaster/List/${refType}/${refId}`);
      // 데이터가 직접 배열로 오면 response.data, 
      // DTO로 래핑되어 오면 response.data.data 등을 확인합니다.
      const result = response.data;
      return Array.isArray(result) ? result : (result.data || []); 
    } catch (err) {
      console.error("API 데이터 추출 실패", err);
      return []; // 에러 시 빈 배열 반환하여 map 오류 방지
    }
  },

  /**
   * 멀티 파일 업로드 (Progress Callback 포함)
   */
  uploadFile: async (refType: string, refId: string, file: File, onProgress: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('files', file);

    return await api.post(`/business/FileMaster/Upload/${refType}/${refId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
        onProgress(percent);
      }
    });
  },

  /**
   * 파일 삭제
   */
  deleteFile: async (fileId: string) => {
    return await api.delete(`/business/FileMaster/Delete/${fileId}`);
  },

  /**
   * 파일 다운로드 URL 반환
   */
  getDownloadUrl: (fileId: string) => {
    return `/business/FileMaster/Download/${fileId}`;
  }
};

export default FileMasterService;