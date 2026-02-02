using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Models;
using ErdProject.Server.Models.Entities;

namespace ErdProject.Server.Data
{
    public class ErdDbContext : DbContext
    {
        public ErdDbContext(DbContextOptions<ErdDbContext> options) : base(options)
        {
        }

        // ✨ = null!; 를 추가하여 컴파일러에게 경고를 무시하도록 합니다.
        public DbSet<UserAccount> Users { get; set; } = null!;

        public DbSet<SysMenu> SysMenus { get; set; } = null!;

        // ✨ 추가: 권한 및 권한-메뉴 매핑 테이블
        // 컨트롤러에서 .Roles 로 접근하므로 이름을 Roles로 지정합니다.
        public DbSet<Role> Roles { get; set; } = null!; // ✨ 이 부분도 경고 방지를 위해 추가했습니다.
        public DbSet<RoleMenu> RoleMenus { get; set; } = null!;

        // ✨ UserRoles DbSet 추가 [cite: 2026-01-28]
        public DbSet<UserRole> UserRoles { get; set; } = null!;


        // --- 공통코드 관련 테이블 ✨ 에러 해결을 위해 추가된 부분 ---

        /// <summary> 공통코드 그룹 마스터 테이블 (COM_CODE_GRP_MST) </summary>
        public DbSet<CodeGroup> CodeGroups { get; set; } = null!;

        /// <summary> 공통코드 상세 내역 테이블 (COM_CODE_DTL_MST) </summary>
        public DbSet<CodeDetail> CodeDetails { get; set; } = null!;

        // 고객사 정보 관련 (추가된 부분)
        public DbSet<Customer> Customers { get; set; } = null!;

        // ✨ [추가] 담당자 테이블 등록
        public DbSet<ErdProject.Server.Models.Entities.Contact> Contacts { get; set; } = null!;

        /// <summary> 사업장 마스터 테이블 (CUST_SITE_MST) </summary>
        public DbSet<CustSite> CustSites { get; set; } = null!;

        // 리턴 타입(DbSet) 정의
        public DbSet<CustContactRoleMap> CustContactRoleMaps { get; set; } = default!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // 1. UserRole 복합 키 설정 (UserNo + RoleId) [cite: 2026-01-28]
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserNo, ur.RoleId });

            // ✨ RoleMenu는 복합키이므로 프로그램 구동을 위해 이 설정이 반드시 필요합니다.
            modelBuilder.Entity<RoleMenu>().HasKey(rm => new { rm.RoleId, rm.MenuId });

            // 3. 공통코드 상세 복합키 설정 (그룹코드 + 상세코드) ✨ 반드시 필요
            modelBuilder.Entity<CodeDetail>()
                .HasKey(cd => new { cd.CodeGrpCd, cd.CodeCd });
        }
    }
}