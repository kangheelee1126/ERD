using ErdProject.Server.Data;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public class ContactService : IContactService
    {
        private readonly ErdDbContext _context;

        public ContactService(ErdDbContext context)
        {
            _context = context;
        }

        // 1. 목록 조회 (Join 포함)
        public async Task<PagedResult<ContactDto>> GetContactsAsync(int page, int size, int? CustomerId, string? keyword)
        {
            // [방어 로직] page가 0이나 음수로 들어오면 에러 나므로 1로 보정
            if (page < 1) page = 1;
            if (size < 1) size = 10;

            // ✨ [수정 1] Inner Join -> Left Join으로 변경
            // (고객사 정보가 없거나, 삭제된 고객사의 담당자라도 리스트에는 나와야 함)
            var query = from c in _context.Contacts
                        join cust in _context.Customers on c.CustomerId equals cust.CustomerId into custGroup
                        from subCust in custGroup.DefaultIfEmpty() // Left Join 처리
                        select new
                        {
                            c,
                            CustNm = subCust != null ? subCust.CustNm : "-" // 고객사가 없으면 "-" 처리
                        };

            // 필터 1: 고객사 ID (특정 고객사만 볼 때)
            if (CustomerId.HasValue && CustomerId.Value > 0)
            {
                query = query.Where(x => x.c.CustomerId == CustomerId.Value);
            }

            // 필터 2: 키워드 (담당자명, 이메일, 휴대폰)
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                // DB에 따라 대소문자 구분할 수 있으므로 안전하게 처리하려면 ToLower() 사용 가능하지만,
                // 성능을 위해 일단 기존 로직 유지하되 Null 처리만 확실히
                query = query.Where(x => x.c.ContactNm.Contains(keyword) ||
                         (x.c.Email != null && x.c.Email.Contains(keyword)) ||
                         (x.c.MobileNo != null && x.c.MobileNo.Contains(keyword)));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderByDescending(x => x.c.IsMain) // 대표 담당자(Y) 우선
                .ThenBy(x => x.c.ContactNm)         // 이름순
                .Skip((page - 1) * size)
                .Take(size)
                .Select(x => new ContactDto
                {
                    ContactId = x.c.ContactId,
                    CustomerId = x.c.CustomerId,
                    CustNm = x.CustNm, // Left Join 결과 매핑
            ContactCd = x.c.ContactCd,
                    ContactNm = x.c.ContactNm,
                    DeptNm = x.c.DeptNm,
                    DutyNm = x.c.DutyNm,
                    TelNo = x.c.TelNo,
                    MobileNo = x.c.MobileNo,
                    Email = x.c.Email,
                    IsMain = x.c.IsMain,
                    IsActive = x.c.IsActive,
                    StartDt = x.c.StartDt,
                    EndDt = x.c.EndDt,
                    Note = x.c.Note
                })
                .ToListAsync();

            return new PagedResult<ContactDto>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = size,
                TotalPages = (int)Math.Ceiling(totalCount / (double)size)
            };
        }

        // 2. 단건 조회
        public async Task<ContactDto?> GetContactAsync(int id)
        {
            var entity = await _context.Contacts.FindAsync(id);
            if (entity == null) return null;

            // 고객사명 가져오기 (필요 시)
            var custNm = await _context.Customers
                .Where(c => c.CustomerId == entity.CustomerId)
                .Select(c => c.CustNm)
                .FirstOrDefaultAsync();

            return new ContactDto
            {
                ContactId = entity.ContactId,
                CustomerId = entity.CustomerId,
                CustNm = custNm, // 상세 조회 시에도 고객사명 있으면 좋음
                ContactCd = entity.ContactCd,
                ContactNm = entity.ContactNm,
                DeptNm = entity.DeptNm,
                DutyNm = entity.DutyNm,
                TelNo = entity.TelNo,
                MobileNo = entity.MobileNo,
                Email = entity.Email,
                IsMain = entity.IsMain,
                IsActive = entity.IsActive,
                StartDt = entity.StartDt,
                EndDt = entity.EndDt,
                Note = entity.Note
            };
        }

        // 3. 저장 (신규/수정 + 대표담당자 로직)
        public async Task SaveContactAsync(ContactDto dto)
        {
            Contact entity;

            // [중요 로직] 만약 이 사람을 '대표(Y)'로 설정했다면?
            // 같은 회사(CustId)의 다른 대표 담당자들을 모두 'N'으로 변경해야 함
            if (dto.IsMain == "Y")
            {
                var otherMains = await _context.Contacts
                    .Where(c => c.CustomerId == dto.CustomerId && c.IsMain == "Y" && c.ContactId != dto.ContactId)
                    .ToListAsync();

                foreach (var other in otherMains)
                {
                    other.IsMain = "N"; // 해제
                }
            }

            if (dto.ContactId == 0) // 신규
            {
                entity = new Contact
                {
                    CustomerId = dto.CustomerId,
                    CrtBy = dto.CrtBy, // 생성자
                    CrtDt = DateTime.Now
                };
                _context.Contacts.Add(entity);
            }
            else // 수정
            {
                entity = await _context.Contacts.FindAsync(dto.ContactId);
                if (entity == null) throw new Exception("데이터가 없습니다.");

                entity.UpdBy = dto.UpdBy; // 수정자
                entity.UpdDt = DateTime.Now;
            }

            // 공통 필드 매핑
            entity.ContactCd = dto.ContactCd;
            entity.ContactNm = dto.ContactNm ?? "";
            entity.DeptNm = dto.DeptNm;
            entity.DutyNm = dto.DutyNm;
            entity.TelNo = dto.TelNo;
            entity.MobileNo = dto.MobileNo;
            entity.Email = dto.Email;
            entity.IsMain = dto.IsMain ?? "N";
            entity.IsActive = dto.IsActive ?? "Y";
            entity.StartDt = dto.StartDt;
            entity.EndDt = dto.EndDt;
            entity.Note = dto.Note;

            await _context.SaveChangesAsync();
        }

        // 4. 삭제
        public async Task DeleteContactAsync(int id)
        {
            var entity = await _context.Contacts.FindAsync(id);
            if (entity != null)
            {
                _context.Contacts.Remove(entity);
                await _context.SaveChangesAsync();
            }
        }
    }
}