using ErdProject.Server.Data;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    /// <summary>
    /// 공통코드의 조회 및 저장 로직을 담당하는 클래스 (비즈니스 레이어)
    /// </summary>
    public class CommonCodeService : ICommonCodeService
    {
        private readonly ErdDbContext _context;

        public CommonCodeService(ErdDbContext context)
        {
            _context = context; // 생성자 주입을 통한 DbContext 확보
        }

        /// <summary>
        /// 모든 코드 그룹 리스트를 정렬 순서에 맞춰 조회합니다.
        /// </summary>
        public async Task<List<CodeGroupDto>> GetGroupsAsync()
        {
            return await _context.CodeGroups
                .OrderBy(g => g.SortNo)
                .Select(g => new CodeGroupDto
                {
                    CodeGrpCd = g.CodeGrpCd,
                    CodeGrpNm = g.CodeGrpNm,
                    CodeGrpDesc = g.CodeGrpDesc,
                    UseYn = g.UseYn,
                    SortNo = g.SortNo
                }).ToListAsync();
        }

        /// <summary>
        /// 그룹 리스트를 다건 저장(Upsert) 처리합니다.
        /// </summary>
        public async Task SaveGroupsAsync(List<CodeGroupDto> dtos)
        {
            foreach (var dto in dtos)
            {
                // PK가 비어있으면 EF Core가 추적할 수 없으므로 스킵합니다. [cite: 2026-01-29]
                if (string.IsNullOrWhiteSpace(dto.CodeGrpCd)) continue;

                var entity = await _context.CodeGroups.FindAsync(dto.CodeGrpCd);

                if (entity == null)
                {
                    entity = new CodeGroup
                    {
                        CodeGrpCd = dto.CodeGrpCd,
                        CreatedBy = dto.CreatedBy, // 신규 저장 시 생성자 기록
                        CreatedDt = DateTime.Now
                    };
                    _context.CodeGroups.Add(entity);
                }

                // null 병합 연산자를 사용하여 필수값 누락 방어
                entity.CodeGrpNm = dto.CodeGrpNm ?? "이름 없음";
                entity.CodeGrpDesc = dto.CodeGrpDesc;
                entity.UseYn = dto.UseYn ?? "Y";
                entity.SortNo = dto.SortNo;
                entity.UpdatedBy = dto.UpdatedBy; // 수정 시 수정자 기록
                entity.UpdatedDt = DateTime.Now;
            }
            await _context.SaveChangesAsync();
        }

        // --- [그룹 즉시 삭제 구현] ---
        public async Task DeleteGroupAsync(string groupCd)
        {
            var entity = await _context.CodeGroups.FindAsync(groupCd);
            if (entity != null)
            {
                _context.CodeGroups.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        /// <summary>
        /// 특정 그룹에 속한 상세 코드 리스트를 조회합니다.
        /// </summary>
        public async Task<List<CodeDetailDto>> GetDetailsAsync(string groupCd)
        {
            return await _context.CodeDetails
                .Where(d => d.CodeGrpCd == groupCd)
                .OrderBy(d => d.SortNo)
                .Select(d => new CodeDetailDto
                {
                    CodeGrpCd = d.CodeGrpCd,
                    CodeCd = d.CodeCd,
                    CodeNm = d.CodeNm,
                    CodeDesc = d.CodeDesc,
                    SortNo = d.SortNo,
                    ExtVal1 = d.ExtVal1,
                    ExtVal2 = d.ExtVal2,
                    UseYn = d.UseYn
                }).ToListAsync();
        }

        /// <summary>
        /// 상세 코드 리스트를 다건 저장(Upsert) 처리합니다.
        /// </summary>
        public async Task SaveDetailsAsync(List<CodeDetailDto> dtos)
        {
            foreach (var dto in dtos)
            {
                // 복합 키 구성 요소 중 하나라도 없으면 저장 불가 [cite: 2026-01-29]
                if (string.IsNullOrWhiteSpace(dto.CodeGrpCd) || string.IsNullOrWhiteSpace(dto.CodeCd)) continue;

                var entity = await _context.CodeDetails.FindAsync(dto.CodeGrpCd, dto.CodeCd);

                if (entity == null)
                {
                    entity = new CodeDetail
                    {
                        CodeGrpCd = dto.CodeGrpCd,
                        CodeCd = dto.CodeCd,
                        CreatedBy = dto.CreatedBy, // 신규 저장 시 생성자 기록
                        CreatedDt = DateTime.Now
                    };
                    _context.CodeDetails.Add(entity);
                }

                entity.CodeNm = dto.CodeNm ?? "이름 없음";
                entity.CodeDesc = dto.CodeDesc;
                entity.SortNo = dto.SortNo;
                entity.ExtVal1 = dto.ExtVal1;
                entity.ExtVal2 = dto.ExtVal2;
                entity.UseYn = dto.UseYn ?? "Y";
                entity.UpdatedBy = dto.UpdatedBy; // 수정 시 수정자 기록
                entity.UpdatedDt = DateTime.Now;
            }
            await _context.SaveChangesAsync();
        }

        // --- [상세 즉시 삭제 구현] ---
        public async Task DeleteDetailAsync(string groupCd, string codeCd)
        {
            var entity = await _context.CodeDetails.FindAsync(groupCd, codeCd);
            if (entity != null)
            {
                _context.CodeDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<CodeGroupDto>> GetGroupsAsync(string? keyword)
        {
            var query = _context.CodeGroups.AsQueryable();

            // [추가] 검색어가 있을 경우 필터링 [cite: 2026-01-29]
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(g => g.CodeGrpCd.Contains(keyword) ||
                                         g.CodeGrpNm.Contains(keyword));
            }

            return await query
                .OrderBy(g => g.SortNo)
                .Select(g => new CodeGroupDto
                {
                    CodeGrpCd = g.CodeGrpCd,
                    CodeGrpNm = g.CodeGrpNm,
                    CodeGrpDesc = g.CodeGrpDesc,
                    UseYn = g.UseYn,
                    SortNo = g.SortNo,
                    CreatedBy = g.CreatedBy,
                    UpdatedBy = g.UpdatedBy
                }).ToListAsync();
        }
    }

}