using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Tino.Application;
namespace Tino.Api.Controllers;

[ApiController]
[Route("api/v1/stories")]
public sealed class StoriesController(IStoryCatalogue catalogue) : ControllerBase
{
    /// <summary>List published stories with bounded pagination. Drafts are excluded.</summary>
    [HttpGet]
    [ProducesResponseType<StoryPage>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<StoryPage>> List(
        CancellationToken cancellationToken,
        [FromQuery, Range(1, 10000)] int page = 1,
        [FromQuery, Range(1, 100)] int pageSize = 20) =>
        Ok(await catalogue.ListPublishedAsync(page, pageSize, cancellationToken));

    /// <summary>Get a published story by slug. Missing and unpublished stories return 404.</summary>
    [HttpGet("{slug}")]
    [ProducesResponseType<StorySummary>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StorySummary>> Get(string slug, CancellationToken cancellationToken)
    {
        var story = await catalogue.FindPublishedAsync(slug, cancellationToken);
        return story is null ? NotFound() : Ok(story);
    }
}
