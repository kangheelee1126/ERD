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

        public async Task<(IEnumerable<BusinessSiteDto> Items, int TotalCount)> GetSitesAsync(int page, int size, string? siteNm)
        {
            var query = _context.CustSites.AsQueryable();

            // 검색 조건 처리
            if (!string.IsNullOrEmpty(siteNm))
            {
                query = query.Where(x => x.SITE_NM.Contains(siteNm));
            }

            // 전체 건수 조회 (페이징 초기화 및 UI 표시용)
            int totalCount = await query.CountAsync();

            // 페이징 및 DTO 변환 (PascalCase 매핑)
            var items = await query
                .OrderBy(x => x.SORT_NO)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(s => new BusinessSiteDto
                {
                    SiteId = s.SITE_ID,
                    CustomerId = s.CUSTOMER_ID,
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
                    RegDt = s.CREATED_DT, // CreatedDt -> RegDt 매핑
                    CreatedBy = s.CREATED_BY,
                    ModDt = s.UPDATED_DT, // UpdatedDt -> ModDt 매핑
                    UpdatedBy = s.UPDATED_BY
                })
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task<BusinessSiteDto?> GetSiteByIdAsync(long id)
        {
            var s = await _context.CustSites.FindAsync(id);
            if (s == null) return null;

            return new BusinessSiteDto
            {
                SiteId = s.SITE_ID,
                SiteNm = s.SITE_NM,
                // ... 나머지 필드 매핑
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
                CREATED_BY = dto.CreatedBy
            };

            _context.CustSites.Add(entity);
            await _context.SaveChangesAsync();

            dto.SiteId = entity.SITE_ID; // 생성된 Identity ID 반환
            return dto;
        }

        public async Task<bool> UpdateSiteAsync(BusinessSiteDto dto)
        {
            var entity = await _context.CustSites.FindAsync(dto.SiteId);
            if (entity == null) return false;

            // PK 항목(SITE_ID, CUSTOMER_ID)은 수정을 방지함
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
            entity.UPDATED_BY = dto.UpdatedBy;

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