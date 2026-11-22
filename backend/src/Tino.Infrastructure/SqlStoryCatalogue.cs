using Microsoft.EntityFrameworkCore;
using Tino.Application;
namespace Tino.Infrastructure;

public sealed class SqlStoryCatalogue(TinoDbContext db) : IStoryCatalogue
{
    public async Task<StoryPage> ListPublishedAsync(int page, int pageSize, CancellationToken cancellationToken)
    {
        if (page is < 1 or > 10000) throw new ArgumentOutOfRangeException(nameof(page));
        if (pageSize is < 1 or > 100) throw new ArgumentOutOfRangeException(nameof(pageSize));
        var query = db.Stories.AsNoTracking().Where(x => x.IsPublished);
        var total = await query.CountAsync(cancellationToken);
        var items = await query.OrderBy(x => x.Title).ThenBy(x => x.Id)
            .Skip((page - 1) * pageSize).Take(pageSize)
            .Select(x => new StorySummary(x.Id, x.Title, x.Slug, x.Synopsis))
            .ToListAsync(cancellationToken);
        return new(items, page, pageSize, total);
    }

    public Task<StorySummary?> FindPublishedAsync(string slug, CancellationToken cancellationToken) =>
        db.Stories.AsNoTracking().Where(x => x.IsPublished && x.Slug == slug)
            .Select(x => new StorySummary(x.Id, x.Title, x.Slug, x.Synopsis))
            .SingleOrDefaultAsync(cancellationToken);
}
