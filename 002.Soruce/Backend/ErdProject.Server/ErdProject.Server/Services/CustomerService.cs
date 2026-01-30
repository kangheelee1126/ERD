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
    public class CustomerService : ICustomerService
    {
        private readonly ErdDbContext _context;

        public CustomerService(ErdDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<CustomerDto>> GetCustomersAsync(int page, int size, string? keyword)
        {
            // 1. 쿼리 준비 (아직 실행 안 됨)
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(c => c.CustNm.Contains(keyword) || c.CustCd.Contains(keyword));
            }

            // 2. 전체 개수 조회 (페이징 계산용)
            var totalCount = await query.CountAsync();

            // 3. 데이터 조회 (Skip & Take)
            var items = await query
                .OrderByDescending(c => c.SortNo) // 정렬 기준
                .ThenByDescending(c => c.CustomerId)
                .Skip((page - 1) * size)
                .Take(size)
                .Select(c => new CustomerDto
                {
            // ... 기존 매핑 로직 유지 ...
            CustomerId = c.CustomerId,
                    CustCd = c.CustCd,
                    CustNm = c.CustNm,
                    CustTypeCd = c.CustTypeCd,
                    IndustryCd = c.IndustryCd,
                    DevCapabilityCd = c.DevCapabilityCd,
                    UseYn = c.UseYn,
            // ... 나머지 필드들
        })
                .ToListAsync();

            // 4. 결과 반환
            return new PagedResult<CustomerDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = size,
                TotalPages = (int)Math.Ceiling(totalCount / (double)size)
            };
        }

        public async Task SaveCustomersAsync(List<CustomerDto> dtos)
        {
            foreach (var dto in dtos)
            {
                // 고객사 코드(업무키) 필수 체크 [cite: 2026-01-29]
                if (string.IsNullOrWhiteSpace(dto.CustCd)) continue;

                Customer? entity;
                if (dto.CustomerId > 0)
                {
                    entity = await _context.Customers.FindAsync(dto.CustomerId);
                }
                else
                {
                    entity = new Customer { CreatedDt = DateTime.Now, CreatedBy = dto.CreatedBy };
                    _context.Customers.Add(entity);
                }

                if (entity != null)
                {
                    entity.CustCd = dto.CustCd;
                    entity.CustNm = dto.CustNm!;
                    entity.CustNmEn = dto.CustNmEn;
                    entity.CustTypeCd = dto.CustTypeCd;
                    entity.IndustryCd = dto.IndustryCd;
                    entity.MfgTypeCd = dto.MfgTypeCd;
                    entity.DevCapabilityCd = dto.DevCapabilityCd;
                    entity.SourceModYn = dto.SourceModYn ?? "N";
                    entity.BizNo = dto.BizNo;
                    entity.TelNo = dto.TelNo;
                    entity.ZipCd = dto.ZipCd;
                    entity.Addr1 = dto.Addr1;
                    entity.Addr2 = dto.Addr2;
                    entity.TimezoneCd = dto.TimezoneCd;
                    entity.Comments = dto.Comments;
                    entity.SortNo = dto.SortNo;
                    entity.UseYn = dto.UseYn ?? "Y";
                    entity.UpdatedDt = DateTime.Now;
                    entity.UpdatedBy = dto.UpdatedBy;
                }
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCustomerAsync(long customerId)
        {
            var entity = await _context.Customers.FindAsync(customerId);
            if (entity != null)
            {
                _context.Customers.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}