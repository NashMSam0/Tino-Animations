namespace Tino.Domain;

public sealed class Story
{
    private Story() { }
    public Guid Id { get; private set; }
    public string Title { get; private set; } = "";
    public string Slug { get; private set; } = "";
    public string Synopsis { get; private set; } = "";
    public bool IsPublished { get; private set; }
    public DateTimeOffset CreatedAt { get; private set; }

    public static Story CreateDraft(string title, string slug, string synopsis)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(slug);
        ArgumentException.ThrowIfNullOrWhiteSpace(synopsis);
        title = title.Trim();
        slug = slug.Trim();
        synopsis = synopsis.Trim();
        if (title.Length > 200) throw new ArgumentException("Title must be at most 200 characters.", nameof(title));
        if (slug.Length > 200 || !System.Text.RegularExpressions.Regex.IsMatch(slug, @"^[a-z0-9]+(?:-[a-z0-9]+)*$"))
            throw new ArgumentException("Slug must use lowercase letters, digits and single hyphens.", nameof(slug));
        if (synopsis.Length > 4000) throw new ArgumentException("Synopsis must be at most 4000 characters.", nameof(synopsis));
        return new Story { Id = Guid.NewGuid(), Title = title, Slug = slug, Synopsis = synopsis, CreatedAt = DateTimeOffset.UtcNow };
    }

    // Publication workflow is not exposed through HTTP until editor authorisation exists.
    public void Publish() => IsPublished = true;
    public void Archive() => IsPublished = false;
}
