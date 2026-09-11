# Avatar drop folder

Place your avatar photo here, e.g. `avatar/photo.jpg` (`.jpg`/`.jpeg`/`.png`/`.webp`).

The file itself is gitignored — it's a personal photo and isn't committed. Once it's
here, `npm run seed` (from `backend/`) uploads it through the API's own
`POST /uploads/avatars` endpoint (same one a real client would call) and stores the
resulting MinIO URL on the Profile document. Requires the API to be running
(`npm run start:dev` or `docker compose up`) and `ADMIN_TOKEN` set — see
`backend/.env.example`.
