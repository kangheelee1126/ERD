using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Models.Entities;
using ErdProject.Server.Models;

namespace ErdProject.Server.Services
{

    // 2. 서비스 구현
    public class UserService : IUserService
    {
        private readonly ErdDbContext _context;

        public UserService(ErdDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDto>> GetUsersAsync()
        {
            // Entity -> DTO 변환하여 반환
            // ✨ [수정] ToListAsync() 위치 수정 및 null 처리 강화
            return await _context.Users
                .AsNoTracking()
                .OrderByDescending(u => u.UserNo)
                .Select(u => new UserDto
                {
                    UserNo = u.UserNo,
                    UserId = u.UserId,
                    UserName = u.UserName,
                    Email = u.Email,
                    UseYn = u.UseYn,
                    RegDt = u.RegDt
                    // Password는 목록 조회 시 보안상 제외
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetUserAsync(int id)
        {
            var u = await _context.Users.FindAsync(id);
            if (u == null) return null;

            return new UserDto
            {
                UserNo = u.UserNo,
                UserId = u.UserId,
                UserName = u.UserName,
                Email = u.Email,
                UseYn = u.UseYn,
                // 상세 조회 시 비밀번호 필드는 비워두거나 필요 시 암호화된 문자열 그대로 반환
                // (보통은 보안을 위해 클라이언트로 비밀번호를 내려주지 않습니다)
                Password = "",
                RegDt = u.RegDt
            };
        }

        public async Task<bool> SaveUserAsync(UserDto dto)
        {
            try
            {
                if (dto.UserNo == 0)
                {
                    // [신규 등록]
                    var entity = new UserAccount
                    {
                        // DTO의 Nullable 값을 Entity의 Non-Nullable에 넣을 때 안전하게 처리
                        UserId = dto.UserId ?? string.Empty,
                        UserName = dto.UserName ?? string.Empty,

                        // ✨ [중요] DB 컬럼 USER_PWD에 매핑됨
                        Password = dto.Password ?? string.Empty,

                        Email = dto.Email ?? string.Empty,
                        UseYn = dto.UseYn ?? "Y",
                        RegDt = DateTime.Now

                        // ✨ [제거됨] 제공해주신 SQL 스키마에 REG_ID가 없어서 제거했습니다.
                        // RegId = dto.RegId 
                    };
                    _context.Users.Add(entity);
                }
                else
                {
                    // [수정]
                    var entity = await _context.Users.FindAsync(dto.UserNo);
                    if (entity == null) return false;

                    // 변경된 필드만 업데이트
                    entity.UserName = dto.UserName ?? entity.UserName;
                    entity.Email = dto.Email ?? entity.Email;
                    entity.UseYn = dto.UseYn ?? entity.UseYn;

                    // ✨ [비밀번호 변경 로직]
                    // 입력값이 있을 때만 비밀번호 변경 (빈 값이면 기존 비밀번호 유지)
                    if (!string.IsNullOrEmpty(dto.Password))
                    {
                        entity.Password = dto.Password;
                    }

                    // ✨ [제거됨] SQL 스키마에 MOD_DT, MOD_ID가 없어서 제거했습니다.
                    // entity.ModDt = DateTime.Now;
                    // entity.ModId = dto.ModId;
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                // 에러 로그를 남기면 디버깅에 좋습니다.
                Console.WriteLine($"SaveUserAsync Error: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var entity = await _context.Users.FindAsync(id);
            if (entity == null) return false;

            _context.Users.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}