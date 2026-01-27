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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}