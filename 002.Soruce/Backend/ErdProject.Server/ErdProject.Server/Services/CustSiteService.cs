using ErdProject.Server.Models.Entities;
using ErdProject.Server.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ErdProject.Server.Services
{
    public class CustSiteService : ICustSiteService
    {
        private readonly ErdDbContext _context;

        public CustSiteService(ErdDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 사업장 리스트 조회 (고객사 필터 및 통합 키워드 검색 포함)
        /// </summary>
        public async Task<(IEnumerable<BusinessSiteDto> Items, int TotalCount)> GetSitesAsync(int page, int size, string? keyword, long? customerId = null)
        {
            // 1. 고객사 정보를 포함하여 기본 쿼리 구성 [cite: 2026-01-30]
            var query = _context.CustSites
                .Include(x => x.customer)
                .AsQueryable();

            // 2. 고객사 코드(ID) 필터 처리 [cite: 2026-01-30]
            if (customerId.HasValue && customerId.Value > 0)
            {
                query = query.Where(x => x.CUSTOMER_ID == customerId.Value);
            }

            // 3. 통합 키워드 검색 처리 (ID 또는 사업장명) [cite: 2026-01-30]
            // 2. 검색어 필터링 (SiteId -> SiteCd로 변경) [cite: 2026-01-30]
            if (!string.IsNullOrEmpty(keyword))
            {
                // ✨ 기존 x.SiteId.ToString() 대신 x.SiteCd를 검색 조건에 포함합니다. [cite: 2026-01-30]
                query = query.Where(x => x.SITE_CD.Contains(keyword) || x.SITE_NM.Contains(keyword));
            }

            // 4. 전체 건수 조회 (페이징 초기화용) [cite: 2026-01-30]
            int totalCount = await query.CountAsync();

            // 5. 페이징 및 DTO 변환 [cite: 2026-01-30]
            var items = await query
                .OrderBy(x => x.SORT_NO)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(s => new BusinessSiteDto
                {
                    SiteId = s.SITE_ID,
                    CustomerId = s.CUSTOMER_ID,
                    // 고객사명 매핑 (Include 필수) [cite: 2026-01-30]
                    CustNm = s.customer != null ? s.customer.CustNm: string.Empty,
                    SiteCd = s.SITE_CD,
                    SiteNm = s.SITE_NM,
                    SiteNmEn = s.SITE_NM_EN,
                    SiteTypeCd = s.SITE_TYPE_CD,
                    TelNo = s.TEL_NO,
                    FaxNo = s.FAX_NO,
                    ZipCd = s.ZIP_CD,
                    Addr1 = s.ADDR1,
                    Addr2 = s.ADDR2,
                    TimezoneCd = s.TIMEZONE_CD,
                    IsMain = s.IS_MAIN,
                    Comments = s.COMMENTS,
                    SortNo = s.SORT_NO,
                    UseYn = s.USE_YN,
                    RegDt = s.CREATED_DT,
                    CreatedBy = s.CREATED_BY,
                    ModDt = s.UPDATED_DT,
                    UpdatedBy = s.UPDATED_BY
                })
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<BusinessSiteDto?> GetSiteByIdAsync(long id)
        {
            var s = await _context.CustSites
                .Include(x => x.customer)
                .FirstOrDefaultAsync(x => x.SITE_ID == id);

            if (s == null) return null;

            return new BusinessSiteDto
            {
                SiteId = s.SITE_ID,
                CustomerId = s.CUSTOMER_ID,
                CustNm = s.customer != null ? s.customer.CustNm : string.Empty,
                SiteCd = s.SITE_CD,
                SiteNm = s.SITE_NM,
                SiteNmEn = s.SITE_NM_EN,
                SiteTypeCd = s.SITE_TYPE_CD,
                TelNo = s.TEL_NO,
                FaxNo = s.FAX_NO,
                ZipCd = s.ZIP_CD,
                Addr1 = s.ADDR1,
                Addr2 = s.ADDR2,
                TimezoneCd = s.TIMEZONE_CD,
                IsMain = s.IS_MAIN,
                UseYn = s.USE_YN,
                SortNo = s.SORT_NO,
                Comments = s.COMMENTS,
                RegDt = s.CREATED_DT,
                CreatedBy = s.CREATED_BY,
                ModDt = s.UPDATED_DT,
                UpdatedBy = s.UPDATED_BY
            };
        }

        public async Task<BusinessSiteDto> CreateSiteAsync(BusinessSiteDto dto)
        {
            var entity = new CustSite
            {
                CUSTOMER_ID = dto.CustomerId,
                SITE_CD = dto.SiteCd ?? string.Empty,
                SITE_NM = dto.SiteNm ?? string.Empty,
                SITE_NM_EN = dto.SiteNmEn,
                SITE_TYPE_CD = dto.SiteTypeCd,
                TEL_NO = dto.TelNo,
                FAX_NO = dto.FaxNo,
                ZIP_CD = dto.ZipCd,
                ADDR1 = dto.Addr1,
                ADDR2 = dto.Addr2,
                TIMEZONE_CD = dto.TimezoneCd,
                IS_MAIN = dto.IsMain ?? "N",
                COMMENTS = dto.Comments,
                SORT_NO = dto.SortNo,
                USE_YN = dto.UseYn ?? "Y",
                CREATED_DT = DateTime.Now,
                CREATED_BY = dto.CreatedBy // 프론트에서 넘어온 userId 자동 주입 [cite: 2026-01-30]
            };

            _context.CustSites.Add(entity);
            await _context.SaveChangesAsync();

            dto.SiteId = entity.SITE_ID;
            return dto;
        }

        public async Task<bool> UpdateSiteAsync(BusinessSiteDto dto)
        {
            var entity = await _context.CustSites.FindAsync(dto.SiteId);
            if (entity == null) return false;

            // PK 항목 및 중요 키(SITE_ID, CUSTOMER_ID)는 수정을 방지함 [cite: 2026-01-30]
            entity.SITE_CD = dto.SiteCd ?? entity.SITE_CD;
            entity.SITE_NM = dto.SiteNm ?? entity.SITE_NM;
            entity.SITE_NM_EN = dto.SiteNmEn;
            entity.SITE_TYPE_CD = dto.SiteTypeCd;
            entity.TEL_NO = dto.TelNo;
            entity.FAX_NO = dto.FaxNo;
            entity.ZIP_CD = dto.ZipCd;
            entity.ADDR1 = dto.Addr1;
            entity.ADDR2 = dto.Addr2;
            entity.TIMEZONE_CD = dto.TimezoneCd;
            entity.IS_MAIN = dto.IsMain ?? "N";
            entity.COMMENTS = dto.Comments;
            entity.SORT_NO = dto.SortNo;
            entity.USE_YN = dto.UseYn ?? "Y";
            entity.UPDATED_DT = DateTime.Now;
            entity.UPDATED_BY = dto.UpdatedBy; // 수정자 ID 자동 주입 [cite: 2026-01-30]

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteSiteAsync(long id)
        {
            var entity = await _context.CustSites.FindAsync(id);
            if (entity == null) return false;

            _context.CustSites.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}