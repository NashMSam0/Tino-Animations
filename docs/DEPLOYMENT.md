# Free deployment plan

## Proposed services

The project uses Angular, ASP.NET Core 10, Entity Framework Core, and SQL Server. For a no-cost prototype, a possible setup is:

| Component | Hosting service | Purpose |
| --- | --- | --- |
| Angular frontend | Vercel Hobby | Free for personal, non-commercial projects; set the project root to `frontend` |
| ASP.NET Core API | Render Free Web Service with the root Dockerfile | Docker is supported; it sleeps after 15 idle minutes and can take about a minute to wake |
| Database | Neon Free PostgreSQL | Current allowance: 100 CU-hours/month and 1 GB storage per project; compute scales to zero while idle |

This setup is for a prototype/demo with occasional cold starts, not a dependable production service. Recheck current provider terms and limits before relying on free plans. Vercel Hobby is limited to personal, non-commercial use.

## Vercel frontend settings

Set the Vercel project root directory to `frontend`, with install command `npm ci`, build command `npm run build`, and output directory `dist/tino/browser`. `frontend/vercel.json` sets the output and routes Angular client-side URLs back to `index.html`.

After the API is online, set `frontend/public/config.js` to its HTTPS origin without a trailing slash:

```js
window.TINO_API_BASE_URL = 'https://YOUR-API.onrender.com';
```

`config.js` is served at runtime, so the API address can be changed without rebuilding the Angular bundle.

Add the final Vercel origin to the API's allowed origins setting. For Render, use:

```text
Cors__AllowedOrigins__0 = https://YOUR-FRONTEND.vercel.app
```

The API only enables cross-origin access to the exact configured origins. When using a custom frontend domain, add it as another `Cors__AllowedOrigins__N` setting.

## API and database compatibility still needed

The current API uses SQL Server's EF Core provider and its existing migration is SQL Server-specific. Neon provides PostgreSQL, so using this free database requires changing the API to Npgsql/PostgreSQL and creating a PostgreSQL migration before deployment. No hosted database has been created and no data has been migrated.

The root `Dockerfile` builds the ASP.NET Core 10 API for Render. Render supplies a `PORT` value; the API now binds to it. Configure the database connection and exact Vercel origin in Render's environment settings. Never commit database credentials.

Render's free Postgres isn't used here because its free databases expire after 30 days. The API does not automatically apply migrations at startup. Check `/api/v1/health/live` for process health and `/api/v1/health/ready` for database connectivity and schema readiness.

Swagger is currently enabled only in Development. Production API endpoints use HTTPS.

## GitHub deployment

After the source is pushed, Vercel can import this repository and deploy each new commit. Render can deploy the API from the same repository using the root Dockerfile. Keep service secrets in their dashboard settings.

## Current status

- Frontend supports a runtime API base URL through `frontend/public/config.js` and has Vercel SPA routing configuration.
- Backend CORS accepts explicitly configured frontend origins and the API binds to a platform-provided port.
- `.gitignore` excludes build output and ZIP archives.
- The database provider still needs to change from SQL Server to PostgreSQL to use the proposed free Neon database.
