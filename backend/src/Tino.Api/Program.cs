using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Tino.Application;
using Tino.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
if (int.TryParse(Environment.GetEnvironmentVariable("PORT"), out var platformPort))
{
    builder.WebHost.UseUrls($"http://0.0.0.0:{platformPort}");
}
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
if (allowedOrigins.Length > 0)
{
    builder.Services.AddCors(options => options.AddDefaultPolicy(policy =>
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod()));
}
builder.Services.AddControllers();
builder.Services.AddProblemDetails();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Tino — African Stories API",
        Version = "v1",
        Description = "Backend foundation: health checks and published story catalogue. Authentication, purchasing and media are planned."
    });
    options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml"));
});
var connection = builder.Configuration.GetConnectionString("Tino")
    ?? throw new InvalidOperationException("Configure ConnectionStrings:Tino before starting the API.");
builder.Services.AddDbContext<TinoDbContext>(options => options.UseSqlServer(connection));
builder.Services.AddScoped<IStoryCatalogue, SqlStoryCatalogue>();

var app = builder.Build();
app.UseExceptionHandler();
if (allowedOrigins.Length > 0) app.UseCors();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "Tino API v1"));
    app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();
}
else
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
app.MapControllers();
app.Run();

public partial class Program { }


