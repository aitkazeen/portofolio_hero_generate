# Digital Business Card

A digital business card presenting its author as a specialist — a NestJS + GraphQL +
Prisma monolith backend, backed by CockroachDB and S3-compatible storage,
containerized with Docker. The stack itself is the demonstration: Git, TypeScript,
Node.js, NestJS, Prisma, GraphQL, Docker, CockroachDB, S3, and
[Claude Code](https://claude.com/claude-code) (see `CLAUDE.md`).

Monorepo layout: `backend/` (done) is the API; `frontend/` is a React + TypeScript +
Vite UI (structure scaffolded with static placeholder content, not yet wired to the
API — see `frontend/README.md`).

## Stack

- **Git** — this repository, with a conventional-commit history.
- **TypeScript** — strict mode, throughout.
- **Node.js / NestJS** — the app runtime and framework.
- **Prisma** — schema, migrations, and typed client over CockroachDB.
- **GraphQL** — code-first schema (`@nestjs/graphql` + Apollo), the API's main
  interface (binary uploads go through a small REST endpoint instead — GraphQL has
  no native multipart support).
- **Docker** — per-service `Dockerfile` (in `backend/`) + a root `docker-compose.yml`
  orchestrating the API, CockroachDB, and MinIO.
- **CockroachDB** — the database, via Prisma's `cockroachdb` provider (Postgres
  wire-compatible).
- **S3** — file storage for the avatar, project images, and the CV PDF; MinIO
  locally/in Docker, swappable for real AWS S3 via env vars.
- **Claude Code** — the project is developed with it; see `CLAUDE.md` and
  `backend/prisma/CLAUDE.md` for the rules it follows, including how it turns a CV
  dropped into `cv/` into the seeded profile data.

## Data model

One `Profile` (the card's owner) with `ProfileLink`, `Skill`, `Project`, and
`Experience` hanging off it by relation, plus a write-only `ContactMessage` table fed
by the card's "contact me" mutation.

## Running it

### With Docker (recommended)

```bash
docker compose up --build
```

Starts CockroachDB, MinIO (plus a one-shot container that creates and publicizes its
bucket), and the API. The API runs `prisma migrate deploy` on boot, which also
creates the `business_card` database if it doesn't exist yet. Once it's up:

```bash
DATABASE_URL="postgresql://root@localhost:26257/business_card?sslmode=disable" \
S3_ENDPOINT="http://localhost:9000" S3_REGION="us-east-1" S3_BUCKET="business-card" \
S3_ACCESS_KEY_ID="minioadmin" S3_SECRET_ACCESS_KEY="minioadmin" S3_FORCE_PATH_STYLE="true" \
S3_PUBLIC_URL="http://localhost:9000/business-card" \
npm --prefix backend run prisma:seed
```

The API is at `http://localhost:3000/graphql`; the MinIO console is at
`http://localhost:9000` (or `:9001` for its web UI), login `minioadmin`/`minioadmin`.

### Locally

```bash
cd backend
cp .env.example .env      # defaults match `docker compose up` on localhost
npm install
docker compose up -d cockroachdb minio minio-init   # from the repo root
npm run prisma:migrate    # create the schema
npm run prisma:seed       # populate the one Profile row (and upload cv/*.pdf if present)
npm run start:dev
```

## Querying the card

```bash
curl -X POST http://localhost:3000/graphql \
  -H "content-type: application/json" \
  -d '{"query":"{ profile { fullName title bio resumeUrl skills { name category } projects { title techStack imageUrl } experience { role company } } }"}'
```

Or open `http://localhost:3000/graphql` in a browser for Apollo's schema explorer.

Other queries/mutations: `skills`, `projects(featured: Boolean)`, `experience`,
`createSkill`/`removeSkill`, `createProject`/`updateProject`/`removeProject`,
`createExperience`/`removeExperience`, `updateProfile`, and
`submitContactMessage(input: { name, email, message })` for the card's contact form.

## Uploading files

GraphQL doesn't carry binary payloads, so uploads are a plain REST endpoint; pass the
URL it returns into the matching GraphQL mutation:

```bash
curl -X POST http://localhost:3000/uploads/avatars -F "file=@photo.jpg"
# => {"url":"http://localhost:9000/business-card/avatars/<uuid>.jpg"}
# then: mutation { updateProfile(input: { id: "...", avatarUrl: "<that url>" }) { id } }
```

`:folder` is one of `avatars`, `project-images`, or `resumes`.

## Populating it with your real CV

Drop your CV as a PDF into `cv/` (see `cv/README.md`) and ask Claude Code to read it
and rewrite `backend/prisma/seed.ts` with your real profile, skills, projects, and
experience — the exact rule it follows is in `CLAUDE.md`. `prisma:seed` also uploads
the PDF itself to S3/MinIO and sets `Profile.resumeUrl`.
