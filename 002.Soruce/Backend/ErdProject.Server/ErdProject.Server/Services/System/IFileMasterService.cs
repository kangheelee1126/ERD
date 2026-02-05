using Microsoft.AspNetCore.Http;
using ErdProject.Server.Models.Dtos.System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ErdProject.Server.IServices.System
{
    public interface IFileMasterService
    {
        // 멀티 파일 업로드: 특정 참조 ID(refId)에 여러 파일을 연결하여 저장
        Task<IEnumerable<FileMasterDto>> UploadFilesAsync(string refType, string refId, List<IFormFile> files);

        // 파일 다운로드: 파일 식별 GUID(fileId)로 암호화된 파일 데이터 조회
        Task<(byte[] fileData, string fileName)> DownloadFileAsync(string fileId);

        // 특정 참조 대상의 파일 목록 전체 조회
        Task<IEnumerable<FileMasterDto>> GetFileListByRefAsync(string refType, string refId);

        // 전체 파일 목록 조회 (표준 페이징 처리 포함)
        Task<IEnumerable<FileMasterDto>> GetFileListPagedAsync(int page, int size);

        // 파일 삭제: DB 레코드 삭제 및 물리 파일 제거
        Task<bool> DeleteFileAsync(string fileId);
    }
}