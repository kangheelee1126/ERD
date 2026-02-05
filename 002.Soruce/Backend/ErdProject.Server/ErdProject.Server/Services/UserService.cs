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

        /* [cite: 2026-02-03] EF Core 기반 JOIN 조회 및 DTO 프로젝션 */
        public async Task<List<UserDto>> GetUsersAsync()
        {
            // 사용자(u) -> 직원(e) -> 부서공통코드(d) 순차 Join
            var query = from u in _context.Users.AsNoTracking()
                        join e in _context.Employees.AsNoTracking() on u.EmpId equals e.EmpId into eJoin
                        from emp in eJoin.DefaultIfEmpty()
                        join d in _context.CodeDetails.AsNoTracking() on new { Code = emp.DeptCd, Group = "SYS_DEPT" }
                                                                  equals new { Code = d.CodeCd, Group = d.CodeGrpCd } into dJoin
                        from dept in dJoin.DefaultIfEmpty()
                        select new UserDto
                        {
                            UserNo = u.UserNo,
                            UserId = u.UserId,
                            UserName = u.UserName,
                            Email = u.Email,
                            UseYn = u.UseYn,
                            /* [cite: 2026-02-05] DTO 날짜는 String형으로 변환 */
                            RegDt = u.RegDt.HasValue ? u.RegDt.Value.ToString("yyyy-MM-dd") : null,
                            EmpId = u.EmpId,
                            EmpNm = emp != null ? emp.EmpNm : "미매핑",
                            DeptNm = dept != null ? dept.CodeNm : "-"
                        };

            return await query.OrderByDescending(u => u.UserNo).ToListAsync();
        }

        public async Task<UserDto?> GetUserAsync(int id)
        {
            // 단건 조회 시에도 직원 정보를 포함하여 Join 수행
            var u = await (from user in _context.Users
                           join e in _context.Employees on user.EmpId equals e.EmpId into eJoin
                           from emp in eJoin.DefaultIfEmpty()
                           where user.UserNo == id
                           select new UserDto
                           {
                               UserNo = user.UserNo,
                               UserId = user.UserId,
                               UserName = user.UserName,
                               Email = user.Email,
                               UseYn = user.UseYn,
                               RegDt = user.RegDt.HasValue ? user.RegDt.Value.ToString("yyyy-MM-dd") : null,
                               EmpId = user.EmpId,
                               EmpNm = emp != null ? emp.EmpNm : null,
                               UserPwd = "" // 보안상 빈 값 반환
                           }).FirstOrDefaultAsync();

            return u;
        }

        /* [cite: 2026-02-05] 컨트롤러/서비스 생성 시 try-catch 문 적용 지침 준수 */
        public async Task<bool> SaveUserAsync(UserDto dto)
        {
            try
            {
                if (dto.UserNo == 0)
                {
                    // [신규 등록]
                    var entity = new UserAccount
                    {
                        UserId = dto.UserId ?? string.Empty,
                        UserName = dto.UserName ?? string.Empty,
                        Password = dto.UserPwd ?? string.Empty, // 스키마 USER_PWD 매핑
                        Email = dto.Email ?? string.Empty,
                        UseYn = dto.UseYn ?? "Y",
                        EmpId = dto.EmpId, // 직원 매핑 ID 저장
                        RegDt = DateTime.Now
                    };
                    _context.Users.Add(entity);
                }
                else
                {
                    // [수정]
                    var entity = await _context.Users.FindAsync(dto.UserNo);
                    if (entity == null) return false;

                    entity.UserName = dto.UserName ?? entity.UserName;
                    entity.Email = dto.Email ?? entity.Email;
                    entity.UseYn = dto.UseYn ?? entity.UseYn;
                    entity.EmpId = dto.EmpId; // 매핑 직원 수정 허용

                    if (!string.IsNullOrEmpty(dto.UserPwd))
                    {
                        entity.Password = dto.UserPwd;
                    }

                    // [cite: 2026-02-03] Audit 필드 매핑 확인 (UPD_BY 등)
                    // entity.UpdBy = dto.UpdBy; 
                }

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[UserService] SaveUserAsync Error: {ex.Message}");
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