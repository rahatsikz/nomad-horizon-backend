## Nomad Horizon - Backend

It is a backend repository for the [Nomad Horizon](https://github.com/rahatsikz/nomad-horizon) Project. It is a project which gives service to Digital nomads around the world. They can view the available service and book a schedule to avail the service. This project highlights basic CRUD operation, authentication, authorization, data validation and transaction.

## Deployed Link

[https://nomad-horizon-backend.vercel.app](https://nomad-horizon-backend.vercel.app)

## Technology Used

- Node.js
- Express
- TypeScript
- Prisma (as ORM)
- Postgresql (as Database)
- Zod (for data validation)

## ERD Diagram

![ERD_Diagram](https://i.ibb.co.com/4Jmbnvg/image.png)

## Procedure to run the project

At First, Clone the Repository

```bash
git clone https://github.com/rahatsikz/nomad-horizon-backend.git
```

Then, install the dependencies

```bash
npm install
```

after that, add the `.env` file in the root folder and add these environment variables with additional values

```bash
DATABASE_URL= "Your database url"

PORT=5000
NODE_ENV=development

BCRYPT_SALT_ROUNDS= "Integer value like 8 or 10 or 12"
JWT_SECRET= "Secret for Access Token"
JWT_EXPIRES_IN= "Access Token expire time"
JWT_REFRESH_SECRET= "Secret for Refresh Token"
JWT_REFRESH_EXPIRES_IN= "Refresh Token expire time"
```

Then, Create table in your database with this command

```bash
npx prisma migrate dev
```

Finally, run the development server

```bash
npm run dev
```

Server will run in your desired port number mentioned above.
You can check [http://localhost:5000](http://localhost:5000) to see the result.

## Testing

The project uses Vitest, Supertest, Prisma, and PostgreSQL for automated tests.
Unit tests run without a database. API and integration tests require a separate
PostgreSQL database and must never use the development or production database.

Create a test environment file from the committed template:

```bash
Copy-Item .env.test.example .env.test
```

Update `DATABASE_URL` so it points to a dedicated database whose name includes
`test`, for example `nomad_horizon_test`. Then apply the existing migrations:

```bash
$env:DATABASE_URL = "postgresql://postgres:password@localhost:5432/nomad_horizon_test?schema=public"
npx prisma migrate deploy
```

The Prisma CLI reads `DATABASE_URL` from the process environment. Do not replace
your normal `.env` with test credentials.

Run the test suites with:

```bash
npm run test:unit
npm run test:api
npm run test:coverage
npm run typecheck:test
```

The API test helpers refuse to run unless the database name contains `test`.
Tests reset their own data and use the exported Express app from `src/app.ts`,
so they do not open a listening server.
