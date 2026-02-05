using ErdProject.Server.Data;
using ErdProject.Server.IServices.Admin;
using ErdProject.Server.Models.Dtos.Admin;
using ErdProject.Server.Models.Entities.Admin;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Services.Admin
{
    public class EmployeeService : IEmployeeService
    {
        private readonly ErdDbContext _context;

        public EmployeeService(ErdDbContext context)
        {
            _context = context;
        }

        /* ✨ 인터페이스 시그니처와 정확히 일치시켜야 합니다 [cite: 2026-02-03] */
        public async Task<(IEnumerable<EmployeeDto> Items, int TotalCount)> GetEmployeesAsync(int page, int size, string? search)
        {
            try
            {
                // 1. Join 쿼리 작성 (DefaultIfEmpty를 통한 Left Join) [cite: 2026-02-03]
                var rawQuery = from emp in _context.Employees.AsNoTracking()
                               join dept in _context.CodeDetails.AsNoTracking()
                                 on emp.DeptCd equals dept.CodeCd into deptJoin
                               from d in deptJoin.DefaultIfEmpty()
                                   // 부서 공통코드 그룹 조건 (필요 시 추가)
                                   where d == null || d.CodeGrpCd == "SYS_DEPT"
                               select new { emp, d };

                // 2. 검색 필터 적용 (사번, 이름, 부서명 포함)
                if (!string.IsNullOrEmpty(search))
                {
                    rawQuery = rawQuery.Where(x => x.emp.EmpNm.Contains(search) ||
                                                  x.emp.EmpNo.Contains(search) ||
                                                  (x.d != null && x.d.CodeNm.Contains(search)));
                }

                // 3. 전체 데이터 건수 조회
                int totalCount = await rawQuery.CountAsync();

                // 4. 페이징 및 DTO 프로젝션 [cite: 2026-02-03, 2026-02-05]
                var items = await rawQuery
                    .OrderByDescending(x => x.emp.CrtDt)
                    .Skip((page - 1) * size)
                    .Take(size)
                    .Select(x => new EmployeeDto
                    {
                        EmpId = x.emp.EmpId,
                        EmpNo = x.emp.EmpNo,
                        EmpNm = x.emp.EmpNm,
                        Email = x.emp.Email,
                        Phone = x.emp.Phone,
                        DeptCd = x.emp.DeptCd,
                /* ✨ JOIN을 통해 가져온 부서명 매핑 */
                        DeptNm = x.d != null ? x.d.CodeNm : x.emp.DeptCd,
                        PositionNm = x.emp.PositionNm,
                        JobNm = x.emp.JobNm,
                /* [cite: 2026-02-05] 날짜 String형 변환 지침 준수 */
                        HireDt = x.emp.HireDt.HasValue ? x.emp.HireDt.Value.ToString("yyyy-MM-dd") : null,
                        ResignDt = x.emp.ResignDt.HasValue ? x.emp.ResignDt.Value.ToString("yyyy-MM-dd") : null,
                        ActiveYn = x.emp.ActiveYn,
                        SrHandleYn = x.emp.SrHandleYn,
                        Note = x.emp.Note,
                        CrtDt = x.emp.CrtDt.HasValue ? x.emp.CrtDt.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                        CrtBy = x.emp.CrtBy
                    })
                    .ToListAsync();

                return (items, totalCount);
            }
            catch (Exception ex)
            {
                // [cite: 2026-02-05] 컨트롤러/서비스 try-catch 코딩 지침 준수
                Console.WriteLine($"[EmployeeService] GetEmployeesAsync Error: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> SaveEmployeeAsync(EmployeeDto dto)
        {
            try { 
                    var entity = await _context.Employees.FirstOrDefaultAsync(x => x.EmpId == dto.EmpId);

                    if (entity == null) // ✨ 신규 등록 (Insert)
                    {
                        entity = new Employee
                        {
                            EmpNo = dto.EmpNo,
                            EmpNm = dto.EmpNm,
                            Email = dto.Email,
                            Phone = dto.Phone,
                            DeptCd = dto.DeptCd,
                            PositionNm = dto.PositionNm,
                            JobNm = dto.JobNm,
                            HireDt = string.IsNullOrEmpty(dto.HireDt) ? null : DateTime.Parse(dto.HireDt),
                            ResignDt = string.IsNullOrEmpty(dto.ResignDt) ? null : DateTime.Parse(dto.ResignDt),
                            ActiveYn = dto.ActiveYn,
                            SrHandleYn = dto.SrHandleYn,
                            Note = dto.Note,
                            // 지침: 감사 필드 매핑 및 Null 방어 [cite: 2026-02-03, 2026-02-05]
                            CrtBy = dto.CrtBy ?? "SYSTEM",
                            CrtDt = DateTime.Now
                        };
                        _context.Employees.Add(entity);
                    }
                    else // ✨ 기존 수정 (Update)
                    {
                        entity.EmpNm = dto.EmpNm;
                        entity.Email = dto.Email;
                        entity.Phone = dto.Phone;
                        entity.DeptCd = dto.DeptCd;
                        entity.PositionNm = dto.PositionNm;
                        entity.JobNm = dto.JobNm;
                        entity.HireDt = string.IsNullOrEmpty(dto.HireDt) ? null : DateTime.Parse(dto.HireDt);
                        entity.ResignDt = string.IsNullOrEmpty(dto.ResignDt) ? null : DateTime.Parse(dto.ResignDt);
                        entity.ActiveYn = dto.ActiveYn;
                        entity.SrHandleYn = dto.SrHandleYn;
                        entity.Note = dto.Note;

                        // 지침: 수정 시 감사 필드 업데이트 [cite: 2026-02-03]
                        entity.UpdBy = dto.UpdBy ?? "SYSTEM";
                        entity.UpdDt = DateTime.Now;
                    }

                    return await _context.SaveChangesAsync() > 0;

                }
            catch (Exception ex)
            {
                // 로그 기록 (실제 운영 환경에서는 NLog 또는 Serilog 사용 권장) [cite: 2026-02-03]
                Console.WriteLine($"[EmployeeService] SaveEmployeeAsync Error: {ex.Message}");

                // 에러 발생 시 빈 리스트와 0건 반환 또는 예외 다시 던지기
                throw;
            }
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var entity = await _context.Employees.FindAsync(id);
            if (entity == null) return false;

            _context.Employees.Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}