namespace Tino.Application;

public sealed record StorySummary(Guid Id, string Title, string Slug, string Synopsis);
public sealed record StoryPage(IReadOnlyList<StorySummary> Items, int Page, int PageSize, int TotalCount);
public interface IStoryCatalogue
{
    Task<StoryPage> ListPublishedAsync(int page, int pageSize, CancellationToken cancellationToken);
    Task<StorySummary?> FindPublishedAsync(string slug, CancellationToken cancellationToken);
}
