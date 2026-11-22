param([string]$BaseUrl = 'http://localhost:5199')
$ErrorActionPreference = 'Stop'
$ui = Invoke-WebRequest "$BaseUrl/swagger/index.html" -UseBasicParsing
if ($ui.StatusCode -ne 200) { throw 'Swagger UI failed.' }
$spec = Invoke-RestMethod "$BaseUrl/swagger/v1/swagger.json"
foreach ($path in @('/api/v1/health/live','/api/v1/health/ready','/api/v1/stories','/api/v1/stories/{slug}')) {
    if (-not $spec.paths.PSObject.Properties[$path]) { throw "Missing OpenAPI path: $path" }
}
if ((Invoke-RestMethod "$BaseUrl/api/v1/health/live").status -ne 'Healthy') { throw 'Liveness failed.' }
try {
    $null = Invoke-WebRequest "$BaseUrl/api/v1/stories?pageSize=101" -UseBasicParsing
    throw 'Expected HTTP 400 for invalid pagination.'
} catch {
    if (-not $_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 400) { throw }
}
Write-Output 'PASS: Swagger UI, OpenAPI paths, liveness and invalid pagination.'
try {
    $ready = Invoke-RestMethod "$BaseUrl/api/v1/health/ready"
    if ($ready.status -ne 'Healthy') { throw 'Unexpected readiness response.' }
    Write-Output 'PASS: SQL connectivity and catalogue schema.'
} catch {
    if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -eq 503) {
        Write-Warning 'SQL is not ready. Database-backed integration remains unverified.'
    } else { throw }
}

