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

        public async Task<List<CustomerDto>> GetCustomersAsync(string? keyword)
        {
            var query = _context.Customers.AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                query = query.Where(c => c.CustCd.Contains(keyword) || c.CustNm.Contains(keyword));
            }

            return await query
                .OrderBy(c => c.SortNo)
                .Select(c => new CustomerDto
                {
                    CustomerId = c.CustomerId,
                    CustCd = c.CustCd,
                    CustNm = c.CustNm,
                    CustNmEn = c.CustNmEn,
                    CustTypeCd = c.CustTypeCd,
                    IndustryCd = c.IndustryCd,
                    MfgTypeCd = c.MfgTypeCd,
                    DevCapabilityCd = c.DevCapabilityCd,
                    SourceModYn = c.SourceModYn,
                    BizNo = c.BizNo,
                    TelNo = c.TelNo,
                    ZipCd = c.ZipCd,
                    Addr1 = c.Addr1,
                    Addr2 = c.Addr2,
                    TimezoneCd = c.TimezoneCd,
                    Comments = c.Comments,
                    SortNo = c.SortNo,
                    UseYn = c.UseYn,
                    CreatedBy = c.CreatedBy,
                    UpdatedBy = c.UpdatedBy
                }).ToListAsync();
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