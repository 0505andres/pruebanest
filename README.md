## Project setup

```bash
$ npm install
```

## PostgreSQL local

Copy `.env.example` to `.env`, then start PostgreSQL with Docker Compose:

```bash
docker compose up -d postgres
npm run start:dev
```

The database is available at `localhost:5432` and its data is stored in the `postgres_data` volume. `DB_SYNCHRONIZE=true` is intended for local development only; schema synchronization is disabled when `NODE_ENV=production`.

Set `CORS_ORIGINS` to a comma-separated list of allowed frontend origins. For Render, configure it with the exact deployed frontend URL, for example `https://your-frontend.onrender.com`.

Also can find the dump database in the repo to use in case of restore with seeded data.

## API documentation

Start the API with `npm run start:dev`, then open `http://localhost:3000/api` to explore and test the endpoints in Swagger UI. The OpenAPI document is available at `http://localhost:3000/api-json`.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

