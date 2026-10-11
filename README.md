# Diploma Registry

A web application for keeping a searchable registry of graduates' diploma works. Records contain the student's name, faculty and specialty, year, a unique diploma number and the attached document. Administrators verify records and invite other users.

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/danylokiri/diploma-registry/assets/screenshots/search.jpg" alt="Search and filters" width="49%">
  <img src="https://raw.githubusercontent.com/danylokiri/diploma-registry/assets/screenshots/admin.jpg" alt="Admin panel with invites and unverified records" width="49%">
</p>
<p align="center">
  <img src="https://raw.githubusercontent.com/danylokiri/diploma-registry/assets/screenshots/diploma-details.jpg" alt="Diploma record" width="49%">
</p>

The screenshots use fictional demo data.

## Features

- Registry of diploma works with a catalogue of faculties and specialties
- Search and filters (faculty, specialty, year, verification status)
- File upload (PDF, JPG, PNG) with type and size validation
- Verification flag and editing of records by administrators
- Registration by invitation: the first registered user becomes the administrator, further users register with invite codes (with optional expiry) or freely if `ALLOW_SELF_REGISTER=true`
- JWT authentication, input validation with Zod, security headers with Helmet
- REST API described with OpenAPI and available as Swagger UI at `/api/docs`
- Structured logging (Winston, daily rotating files)
- Integration tests with Jest and Supertest against a PostgreSQL test database

## Tech stack

| Part | Stack |
|---|---|
| `backend` | Node.js, Express, Prisma, PostgreSQL, Multer, Zod, JWT, Winston |
| `frontend` | React, React Router, Tailwind CSS, Axios (Create React App) |
| Tooling | Docker Compose for the database, Jest, Supertest |

## Getting started

Requirements: Node.js 20+, Docker (for PostgreSQL).

```bash
# database
cd backend
docker compose up -d

# API
cp .env.example .env            # set JWT_SECRET and DATABASE_URL
npm install
npx prisma migrate deploy
npm run dev                     # http://localhost:5000, docs at /api/docs

# web (in another terminal)
cd frontend
npm install
npm start                       # http://localhost:3000
```

Open the web app and register: the first account becomes the administrator. Invite codes for further users are created in the admin panel.

Run the tests:

```bash
cd backend
cp .env.test.example .env.test
npm run test:db:up              # PostgreSQL on port 5433
npm test
```

## Configuration

See [`backend/.env.example`](backend/.env.example).

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | secret for signing tokens; in production the server refuses to start with a missing or weak value |
| `ALLOW_SELF_REGISTER` | allow registration without an invite |
| `INVITE_TTL_MS` | invite lifetime in milliseconds (empty or 0 = no expiry) |
| `UPLOAD_DIR`, `MAX_FILE_MB` | upload directory and maximum file size |

## Project structure

```
backend/
  src/routes/      auth, diplomas, invites, catalog
  src/middleware/  authentication, error handling, request ids
  src/docs/        OpenAPI specification
  prisma/          schema and migrations
  tests/           integration tests
frontend/
  src/pages/       home, search, diploma details, login, registration, admin, add record
  src/components/  table, filters, edit modal, invites bar
```
