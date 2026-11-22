using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tino.Infrastructure;
namespace Tino.Api.Controllers;

[ApiController]
[Route("api/v1/health")]
public sealed class HealthController(TinoDbContext db, ILogger<HealthController> logger) : ControllerBase
{
    /// <summary>Check whether the API process is responding; does not require SQL Server.</summary>
    [HttpGet("live")]
    [ProducesResponseType<HealthStatus>(StatusCodes.Status200OK)]
    public ActionResult<HealthStatus> Live() => Ok(new HealthStatus("Healthy"));

    /// <summary>Check SQL connectivity and the initial catalogue schema.</summary>
    [HttpGet("ready")]
    [ProducesResponseType<HealthStatus>(StatusCodes.Status200OK)]
    [ProducesResponseType<HealthStatus>(StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthStatus>> Ready(CancellationToken cancellationToken)
    {
        try
        {
            _ = await db.Stories.AsNoTracking().OrderBy(x => x.Id).Select(x => x.Id).Take(1).ToListAsync(cancellationToken);
            return Ok(new HealthStatus("Healthy"));
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "SQL readiness check failed.");
            return StatusCode(503, new HealthStatus("Unavailable"));
        }
    }
}
public sealed record HealthStatus(string Status);

