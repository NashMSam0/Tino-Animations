# Run from any directory after building the solution.
# Example: .\scripts\Invoke-Ef.ps1 migrations list
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Push-Location $root
try {
    $tool = Join-Path $env:USERPROFILE '.nuget\packages\microsoft.entityframeworkcore.tools\10.0.14\tools\net8.0\any\ef.dll'
    if (Test-Path -LiteralPath $tool) {
        & dotnet exec --depsfile backend/src/Tino.Api/bin/Debug/net10.0/Tino.Api.deps.json --runtimeconfig backend/src/Tino.Api/bin/Debug/net10.0/Tino.Api.runtimeconfig.json $tool @args --assembly backend/src/Tino.Infrastructure/bin/Debug/net10.0/Tino.Infrastructure.dll --startup-assembly backend/src/Tino.Api/bin/Debug/net10.0/Tino.Api.dll --project backend/src/Tino.Infrastructure/Tino.Infrastructure.csproj --startup-project backend/src/Tino.Api/Tino.Api.csproj --project-dir backend/src/Tino.Infrastructure -- --contentRoot (Join-Path $root 'backend/src/Tino.Api') --environment Development
    } else {
        & dotnet tool run dotnet-ef @args --project backend/src/Tino.Infrastructure --startup-project backend/src/Tino.Api -- --environment Development
    }
    if ($LASTEXITCODE -ne 0) { throw "Entity Framework command failed with exit code $LASTEXITCODE." }
} finally { Pop-Location }


