/*
    Contexto de base de datos para la api.
*/

using Microsoft.EntityFrameworkCore;
using Models;

namespace Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<CsvFile> CsvFiles { get; set; } = null!; 
        public DbSet<Documento> Documentos { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CsvFile>()
                .HasMany(c => c.Documentos)
                .WithOne(d => d.CsvFile)
                .HasForeignKey(d => d.CsvFileId);
        }
    }
}