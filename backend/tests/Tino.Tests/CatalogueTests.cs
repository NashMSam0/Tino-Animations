using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Tino.Api.Controllers;
using Tino.Application;
using Tino.Domain;
using Tino.Infrastructure;

namespace Tino.Tests;
public sealed class CatalogueTests
{
    [Fact]
    public async Task UnknownOrDraftSlugReturns404()
    {
        var controller = new StoriesController(new MissingCatalogue());
        var result = await controller.Get("draft", CancellationToken.None);
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public void SqlModelEnforcesUniqueSlugAndBoundedFields()
    {
        using var db = CreateContext();
        var entity = db.Model.FindEntityType(typeof(Story))!;
        Assert.Contains(entity.GetIndexes(), i => i.IsUnique && i.Properties.Single().Name == nameof(Story.Slug));
        Assert.Equal(200, entity.FindProperty(nameof(Story.Title))!.GetMaxLength());
        Assert.Equal(4000, entity.FindProperty(nameof(Story.Synopsis))!.GetMaxLength());
    }

    [Fact]
    public async Task CatalogueRejectsUnboundedPagesBeforeQueryingDatabase()
    {
        using var db = CreateContext();
        var catalogue = new SqlStoryCatalogue(db);
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => catalogue.ListPublishedAsync(0, 20, CancellationToken.None));
        await Assert.ThrowsAsync<ArgumentOutOfRangeException>(() => catalogue.ListPublishedAsync(1, 101, CancellationToken.None));
    }

    private static TinoDbContext CreateContext() =>
        new(new DbContextOptionsBuilder<TinoDbContext>().UseSqlServer("Server=localhost;Database=Unused_Model_Only;Integrated Security=True").Options);

    private sealed class MissingCatalogue : IStoryCatalogue
    {
        public Task<StorySummary?> FindPublishedAsync(string slug, CancellationToken cancellationToken) => Task.FromResult<StorySummary?>(null);
        public Task<StoryPage> ListPublishedAsync(int page, int pageSize, CancellationToken cancellationToken) => throw new NotImplementedException();
    }
}
