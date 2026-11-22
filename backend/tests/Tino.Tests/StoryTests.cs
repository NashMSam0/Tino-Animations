using Tino.Domain;
namespace Tino.Tests;
public sealed class StoryTests
{
    [Fact]
    public void NewStoryIsDraftAndNormalisesText()
    {
        var story = Story.CreateDraft(" Test ", "test-story", " Summary ");
        Assert.False(story.IsPublished);
        Assert.Equal("Test", story.Title);
        Assert.Equal("Summary", story.Synopsis);
        Assert.NotEqual(Guid.Empty, story.Id);
    }
    [Theory]
    [InlineData("Uppercase")]
    [InlineData("two words")]
    [InlineData("double--dash")]
    [InlineData("-start")]
    public void InvalidSlugsAreRejected(string slug) =>
        Assert.Throws<ArgumentException>(() => Story.CreateDraft("Title", slug, "Summary"));

    [Fact]
    public void ArchivedStoryIsNoLongerPublished()
    {
        var story = Story.CreateDraft("Title", "title", "Summary");
        story.Publish();
        Assert.True(story.IsPublished);
        story.Archive();
        Assert.False(story.IsPublished);
    }
}
