using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ErdProject.Server.Models.Entities.System;
using ErdProject.Server.Models.Dtos.System;
using ErdProject.Server.IServices.System;
using System.Security.Cryptography;
using ErdProject.Server.Data;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.IO;
using ErdProject.Server.Utils;

namespace ErdProject.Server.Services.System
{
    public class FileMasterService : IFileMasterService
    {
        private readonly ErdDbContext _context;
        private readonly string _basePath;
        private readonly byte[] _key = Enumerable.Repeat((byte)0x20, 32).ToArray();

        public FileMasterService(ErdDbContext context, IConfiguration configuration)
        {
            _context = context;
            // 환경 설정에서 BasePath를 읽어오고, 없을 경우 기본값 설정
            _basePath = configuration["FileStorage:BasePath"] ?? @"D:\Storage\Uploads";
        }

        public async Task<IEnumerable<FileMasterDto>> UploadFilesAsync(string refType, string refId, List<IFormFile> files)
        {
            try
            {
                var resultList = new List<FileMasterDto>();
                string dateFolder = DateTime.Now.ToString("yyyy/MM/dd");
                string targetDir = Path.Combine(_basePath, dateFolder);

                if (!Directory.Exists(targetDir))
                    Directory.CreateDirectory(targetDir);

                // 특정 업무구분(RefType) 내에서의 최대 순번을 계산합니다.
                int currentMaxSeq = await _context.FileMaster
                    .Where(x => x.RefType == refType && x.RefId == refId)
                    .Select(x => (int?)x.FileSeq)
                    .MaxAsync() ?? 0;

                foreach (var file in files)
                {
                    currentMaxSeq++;
                    string fileId = Guid.NewGuid().ToString();
                    string saveNm = $"{fileId}.enc";
                    string physicalPath = Path.Combine(targetDir, saveNm);

                    using (var aes = Aes.Create())
                    {
                        aes.Key = _key;
                        aes.GenerateIV();
                        using (var fs = new FileStream(physicalPath, FileMode.Create))
                        {
                            fs.Write(aes.IV, 0, aes.IV.Length);
                            using (var cryptoStream = new CryptoStream(fs, aes.CreateEncryptor(), CryptoStreamMode.Write))
                            {
                                await file.CopyToAsync(cryptoStream);
                            }
                        }
                    }

                    var fileMaster = new FileMaster
                    {
                        RefType = refType, // 누락되었던 참조 구분 추가
                        RefId = refId,
                        FileSeq = currentMaxSeq,
                        FileId = fileId,
                        OriginNm = file.FileName,
                        SaveNm = saveNm,
                        FilePath = dateFolder,
                        FileSize = file.Length,
                        FileExt = Path.GetExtension(file.FileName),
                        UseYn = "Y"
                    };

                    dataUtils.injectAuditFields(fileMaster);
                    _context.FileMaster.Add(fileMaster);

                    resultList.Add(new FileMasterDto
                    {
                        FileId = fileId,
                        OriginNm = file.FileName,
                        FileSeq = currentMaxSeq
                    });
                }

                await _context.SaveChangesAsync();
                return resultList;
            }
            catch (Exception ex)
            {
                throw new Exception("파일 업로드 처리 중 오류가 발생했습니다.", ex);
            }
        }

        public async Task<IEnumerable<FileMasterDto>> GetFileListByRefAsync(string refType, string refId)
        {
            try
            {
                return await _context.FileMaster
                    .AsNoTracking()
                    .Where(x => x.RefType == refType && x.RefId == refId && x.UseYn == "Y")
                    .OrderBy(x => x.FileSeq)
                    .Select(x => new FileMasterDto
                    {
                        FileNo = x.FileNo,
                        RefId = x.RefId,
                        FileSeq = x.FileSeq,
                        FileId = x.FileId,
                        OriginNm = x.OriginNm,
                        FileSize = x.FileSize,
                        FileExt = x.FileExt,
                        CrtDt = x.CrtDt.HasValue ? x.CrtDt.Value.ToString("yyyy-MM-dd HH:mm:ss") : string.Empty,
                        CrtBy = x.CrtBy ?? string.Empty,
                        Management = string.Empty
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("참조 대상별 파일 목록 조회 중 오류가 발생했습니다.", ex);
            }
        }

        public async Task<IEnumerable<FileMasterDto>> GetFileListPagedAsync(int page, int size)
        {
            try
            {
                return await _context.FileMaster
                    .Where(x => x.UseYn == "Y")
                    .OrderByDescending(x => x.CrtDt)
                    .Skip((page - 1) * size)
                    .Take(size)
                    .Select(x => new FileMasterDto
                    {
                        FileNo = x.FileNo,
                        RefId = x.RefId,
                        FileSeq = x.FileSeq,
                        FileId = x.FileId,
                        OriginNm = x.OriginNm,
                        FileSize = x.FileSize,
                        FileExt = x.FileExt,
                        CrtDt = x.CrtDt.HasValue ? x.CrtDt.Value.ToString("yyyy-MM-dd HH:mm:ss") : string.Empty,
                        CrtBy = x.CrtBy ?? String.Empty
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("페이징 목록 조회 중 오류 발생", ex);
            }
        }

        public async Task<(byte[] fileData, string fileName)> DownloadFileAsync(string fileId)
        {
            try
            {
                // 1. DB에서 파일 정보 조회
                var fileInfo = await _context.FileMaster
                    .FirstOrDefaultAsync(x => x.FileId == fileId && x.UseYn == "Y");

                if (fileInfo == null)
                    throw new FileNotFoundException("파일 정보를 찾을 수 없습니다.");

                // 2. 물리적 경로 확인
                string physicalPath = Path.Combine(_basePath, fileInfo.FilePath, fileInfo.SaveNm);
                if (!File.Exists(physicalPath))
                    throw new FileNotFoundException("서버에 실제 파일이 존재하지 않습니다.");

                // 3. 파일 읽기 및 복호화
                using (var aes = Aes.Create())
                {
                    aes.Key = _key;
                    using (var fs = new FileStream(physicalPath, FileMode.Open, FileAccess.Read))
                    {
                        // 파일 시작 부분에서 IV(16바이트) 추출
                        byte[] iv = new byte[16];
                        await fs.ReadAsync(iv, 0, iv.Length);
                        aes.IV = iv;

                        using (var decryptor = aes.CreateDecryptor())
                        using (var ms = new MemoryStream())
                        {
                            using (var cryptoStream = new CryptoStream(fs, decryptor, CryptoStreamMode.Read))
                            {
                                await cryptoStream.CopyToAsync(ms);
                            }
                            return (ms.ToArray(), fileInfo.OriginNm);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("파일 복호화 및 다운로드 중 오류가 발생했습니다.", ex);
            }
        }


        public async Task<bool> DeleteFileAsync(string fileId)
        {
            try
            {
                // 1. DB에서 파일 정보 조회
                var fileInfo = await _context.FileMaster
                    .FirstOrDefaultAsync(x => x.FileId == fileId);

                if (fileInfo == null) return false;

                // 2. 물리적 파일 삭제 처리
                string physicalPath = Path.Combine(_basePath, fileInfo.FilePath, fileInfo.SaveNm);
                if (File.Exists(physicalPath))
                {
                    File.Delete(physicalPath);
                }

                // 3. DB 데이터 삭제 (ERD SYSTEM 지침 준수) [cite: 2026-01-29]
                _context.FileMaster.Remove(fileInfo);
                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("파일 삭제 처리 중 오류가 발생했습니다.", ex);
            }
        }
    }
}