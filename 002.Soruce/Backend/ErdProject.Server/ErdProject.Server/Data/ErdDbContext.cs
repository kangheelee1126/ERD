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


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ✨ RoleMenu는 복합키이므로 프로그램 구동을 위해 이 설정이 반드시 필요합니다.
            modelBuilder.Entity<RoleMenu>().HasKey(rm => new { rm.RoleId, rm.MenuId });
        }
    }
}