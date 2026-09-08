# Digital Business Card

## What this is

A "digital business card" presenting the author as a specialist, built with Git,
TypeScript, Node.js, NestJS, Mongoose, GraphQL, Docker, MongoDB, and S3-compatible
storage. Repo layout is a monorepo: `backend/` holds the NestJS + GraphQL + Mongoose
API (done); `frontend/` holds a React + TypeScript + Vite UI, styled per the design
handoff in `claude_design/`, live-wired to the backend's GraphQL API via `useProfile()`.

The backend is a single NestJS app exposing one GraphQL endpoint, backed by MongoDB
via Mongoose. There is exactly one `Profile` document — the card's owner — with
`ProfileLink`, `Skill`, `Project`, and `Experience` living in their own collections,
referencing it by a plain `profileId` string field (no native Mongo relations —
`ProfileService` fetches and assembles them in parallel), plus a write-only
`ContactMessage` collection for the card's "contact me" mutation. Binary files
(avatar, project images, the CV PDF) go through a plain REST upload endpoint to
S3-compatible storage (MinIO locally); GraphQL only ever sees the resulting URLs.

This file, and the rules in it, are themselves evidence of the "Claude Code" item in
the required stack: the project is set up to be developed with Claude Code, following
these conventions.

## Repo layout

```
backend/     NestJS + GraphQL + Prisma API — see backend structure below
frontend/    React + TypeScript + Vite UI — see frontend structure below
cv/          the CV PDF you drop in (gitignored) — see cv/README.md
docker-compose.yml   root orchestrator: builds ./backend (and, later, ./frontend)
```

### Backend structure

```
backend/src/database/seed.ts     populates the single Profile document (+ its related collections)
backend/src/common/enums/         GraphQL enum registrations (SkillCategory, SkillLevel, ProjectStatus)
backend/src/{profile,skills,projects,experience,contact}/
                                     one module per resource: schemas/*.schema.ts
                                     (@nestjs/mongoose @Schema), models/*.model.ts
                                     (@ObjectType), dto/*.input.ts (@InputType +
                                     class-validator), *.service.ts (Mongoose model
                                     calls), *.resolver.ts (@Query/@Mutation)
backend/src/storage/                 S3Service (AWS SDK v3 client) + StorageController,
                                     a REST POST /uploads/:folder endpoint (folder is
                                     one of avatars/project-images/resumes) — GraphQL
                                     has no native multipart support, so uploads go
                                     through this plain endpoint and the caller passes
                                     the returned URL into a GraphQL mutation
                                     (updateProfile.avatarUrl/resumeUrl,
                                     createProject.imageUrl)
```

`profile` is the read model for the whole card: `ProfileService.findTheProfile()`
fetches the `Profile` document, then queries `ProfileLink`/`Skill`/`Project`/
`Experience` by their `profileId` field in parallel and assembles them onto it,
reusing the other modules' `@ObjectType`s directly — there's no need for
DataLoader/field-resolver machinery at this data volume. Keep it that way unless the
dataset actually grows enough to need it.

### Frontend structure

```
frontend/src/styles/          tokens.css (design tokens as CSS custom properties), global.css
frontend/src/types/content.ts content shapes (HeroContent, SkillsContent, ContactContent, ...)
frontend/src/content/          placeholder copy — replace once wired to the GraphQL API
frontend/src/hooks/            useHotkeyNav (global H/S/C screen-switch hotkeys)
frontend/src/components/
  common/                       shared primitives: StatBar, ArchedPortrait, CornerRivets
  layout/                       persistent chrome: HudFrame, TopResourceBar, TabBar,
                               StatusBar (Minimap + Nameplate + CommandCard), ContentRegion
  screens/{Hero,Skills,Contact}Screen/   one folder per screen, decomposed into its panels
```

Styled per the Warcraft III/Lordaeron HUD design handoff in `claude_design/` (gitignored;
see that folder's `README.md` for the full visual spec). `App.tsx` calls `useProfile()`
(`hooks/useProfile.ts`), which queries the backend's GraphQL API and feeds the real
`Profile` through `content/buildCardContent.ts` into the screens — it is not static
placeholder content. See `frontend/README.md` for the rest.

## Commands

Run from `backend/`:
- `npm run start:dev` — Nest in watch mode.
- `npm run build` — `nest build` (fails the same way CI would).
- `npm run seed` — reseed the one Profile document (+ related collections) from
  `src/database/seed.ts` (needs `MONGODB_URI`).

Run from `frontend/`:
- `npm run dev` — Vite dev server.
- `npm run build` — type-check then production build.

Run from the repo root:
- `docker compose up --build` / `docker compose down` — full stack (MongoDB,
  MinIO + its bucket-init one-shot, API, and later the frontend) via
  `docker-compose.yml`.

## Conventions

- Backend and frontend are separate top-level packages, each with their own
  `package.json`/`node_modules`/`Dockerfile`; nothing under `backend/` should import
  from a sibling `frontend/` or vice versa. `docker-compose.yml` at the root is the
  only place that wires them together.
- GraphQL schema is **code-first**: annotate classes with `@nestjs/graphql`
  decorators; never hand-edit `backend/src/schema.gql` (gitignored, regenerated on
  boot).
- Every mutation input is a `class-validator`-annotated `@InputType` in a `dto/`
  folder next to its resolver — don't accept raw `Partial<Model>` objects.
- One module per resource/collection, mirroring the folder layout above. Add new
  resources the same way rather than growing an existing module across concerns.
- MongoDB has no native FK constraints — cross-collection references (`profileId`)
  are plain string fields, not Mongoose `ref`/populate. Nothing in the app deletes a
  `Profile` today (singleton, no `deleteProfile` mutation), so there's no cascade
  cleanup to maintain; add it if that ever changes.
- Mongoose is the only place query logic lives — resolvers call services, services
  call injected models (`@InjectModel`), never the other way around.
- Commit with Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`), in small
  logical steps — this repo's Git history is itself part of what a reader evaluates.

## CV ingestion rule

The user drops their real CV as a PDF into `cv/` (gitignored — see `cv/README.md`).
When a PDF appears there:
1. Read it with the Read tool (it supports PDF directly — no parsing library needed).
   If a link's target text (e.g. "GitHub") isn't enough, the PDF's `/URI(...)`
   annotations (`grep -a -o '/URI *([^)]*)' cv/<file>.pdf`) usually carry the actual
   URL.
2. Rewrite `backend/src/database/seed.ts` so `fullName`, `title`, `bio`, `email`,
   `location`, `links`, `skills`, `projects`, and `experience` reflect the CV's real
   content.
3. Never invent details not present in the CV — leave a field as a clearly-marked
   placeholder rather than fabricate it.
4. If the CV implies schema changes (e.g. a field the current models don't capture),
   propose the schema change rather than silently dropping the information.
5. CVs rarely list project repo URLs (and often skip a Projects section entirely).
   If the CV names projects without links, or has no Projects section at all, ask the
   user for their GitHub project URLs before writing placeholder/empty `projects`
   entries. Fetch each repo (description, README, `package.json`) to write a real
   `title`/`description`/`techStack` from actual repo content — same "never invent"
   rule as the rest of the CV — and set `repoUrl`.
