# Gwino Backend

Express backend for file uploads to Cloudinary and storing metadata in MongoDB.

Quickstart

1. Install dependencies

```bash
cd backend
npm install
```

2. Copy `.env.example` to `.env` and fill values

3. Run in development

```bash
npm run dev
```

Endpoints

- `POST /api/uploads` - multipart form, field `file` (single file). Optional `title`, `description`, `tags` (comma-separated), `folder`.
- `GET /api/uploads` - list images
- `GET /api/uploads/:id` - get image metadata
- `DELETE /api/uploads/:id` - delete image (removes from Cloudinary and DB)

Seed data

- To seed tours and destinations from the frontend locales and upload images to Cloudinary:

```bash
cd backend
cp .env.example .env
# fill env values (MONGO_URI, CLOUDINARY_*, SMTP_* if desired)
npm install
npm run seed
```

Email notifications

- Contact and booking submissions will send an email to `ADMIN_CONTACT_EMAIL` if SMTP details are set in `.env`.

Creating the first admin user

- Option A (recommended during development): enable registration temporarily by setting `ALLOW_REGISTRATION=true` in `backend/.env` and call `POST /api/auth/register` with `{ email, password, name }`.
- Option B (script): set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env` and run:

```bash
npm run create-admin
```

This will create the initial admin user directly in the database.


Notes

- Uses multer memory storage and Cloudinary upload streams.
- Secure your Cloudinary keys and Mongo URI in environment variables.
