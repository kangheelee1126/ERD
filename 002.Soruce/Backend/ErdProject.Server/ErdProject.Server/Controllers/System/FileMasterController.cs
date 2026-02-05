using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Models.Dtos.System;
using ErdProject.Server.IServices.System;
using Microsoft.AspNetCore.Http;
using System;
using System.Threading.Tasks;
using System.IO;
using System.Collections.Generic;

namespace ErdProject.Server.Controllers.System
{
    [ApiController]
    [Route("api/business/[controller]")]
    public class FileMasterController : ControllerBase
    {
        private readonly IFileMasterService _fileService;

        public FileMasterController(IFileMasterService fileService)
        {
            _fileService = fileService;
        }

        /* 멀티 파일 업로드 (refType 파라미터 추가) */
        [HttpPost("Upload/{refType}/{refId}")]
        public async Task<IActionResult> UploadFiles(string refType, string refId, [FromForm] List<IFormFile> files)
        {
            try
            {
                if (files == null || files.Count == 0)
                    return BadRequest("업로드할 파일이 없습니다.");

                // 서비스의 변경된 시그니처에 맞춰 refType을 함께 전달합니다.
                var result = await _fileService.UploadFilesAsync(refType, refId, files);

                return Ok(result);
            }
            catch (Exception ex)
            {
                // ERD SYSTEM 표준: 예외 발생 시 500 에러와 메시지 반환
                return StatusCode(500, ex.Message);
            }
        }

        /* 참조 ID별 파일 목록 조회 (refType 추가 반영) */
        [HttpGet("List/{refType}/{refId}")]
        public async Task<IActionResult> GetFileList(string refType, string refId)
        {
            try
            {
                // 인터페이스 계약에 따라 2개의 파라미터를 모두 전달합니다.
                var result = await _fileService.GetFileListByRefAsync(refType, refId);

                // 결과가 비어있더라도 표준에 따라 200 OK와 빈 리스트를 반환합니다.
                return Ok(result);
            }
            catch (Exception ex)
            {
                // 예외 발생 시 500 에러와 메시지 반환
                return StatusCode(500, ex.Message);
            }
        }

        /* 전체 파일 목록 조회 (페이징) */
        [HttpGet("PagedList")]
        public async Task<IActionResult> GetPagedList([FromQuery] int page = 1, [FromQuery] int size = 10)
        {
            try
            {
                var result = await _fileService.GetFileListPagedAsync(page, size);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /* 파일 다운로드 (복호화 포함) */
        [HttpGet("Download/{fileId}")]
        public async Task<IActionResult> DownloadFile(string fileId)
        {
            try
            {
                var (fileData, fileName) = await _fileService.DownloadFileAsync(fileId);

                // 브라우저에서 파일 다운로드를 인식하도록 Content-Type 및 파일명 설정
                return File(fileData, "application/octet-stream", fileName);
            }
            catch (FileNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        /* 파일 삭제 API */
        [HttpDelete("Delete/{fileId}")]
        public async Task<IActionResult> DeleteFile(string fileId)
        {
            try
            {
                var result = await _fileService.DeleteFileAsync(fileId);

                if (!result)
                    return NotFound("삭제할 파일 정보를 찾을 수 없습니다.");

                return Ok(new { message = "삭제 성공" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}