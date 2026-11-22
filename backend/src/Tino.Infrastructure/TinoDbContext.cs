using Microsoft.EntityFrameworkCore;
using Tino.Domain;
namespace Tino.Infrastructure;

public sealed class TinoDbContext(DbContextOptions<TinoDbContext> options) : DbContext(options)
{
    public DbSet<Story> Stories => Set<Story>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var story = modelBuilder.Entity<Story>();
        story.ToTable("Stories", "catalogue");
        story.HasKey(x => x.Id);
        story.Property(x => x.Title).HasMaxLength(200).IsRequired();
        story.Property(x => x.Slug).HasMaxLength(200).IsRequired();
        story.HasIndex(x => x.Slug).IsUnique();
        story.Property(x => x.Synopsis).HasMaxLength(4000).IsRequired();
        story.HasIndex(x => new { x.IsPublished, x.Title, x.Id });
    }
}
