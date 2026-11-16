# medix.

Precision clinic scheduling, simplified. A MERN clinic appointment system with three role based workspaces (patient, doctor, admin).

**Stack:** MongoDB, Express, React (Vite), Node, Tailwind CSS v4, GSAP, JWT, bcrypt.

## Folder structure

```
medix/
  server/   models, middleware, controllers, routes, seed.js
  client/   src/ pages, components, context, api.js, anim.js
```

## Quick setup (about 5 minutes)

You need Node 18 or newer and a MongoDB connection (local, or a free MongoDB Atlas cluster).

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # then edit the values below
npm run seed                # creates admin, 3 doctors and 1 patient
npm run dev                 # API on http://localhost:5000
```

`server/.env`

| Variable | Example | Notes |
|---|---|---|
| PORT | 5000 | API port |
| MONGO_URI | mongodb://127.0.0.1:27017/medix | Or your Atlas connection string |
| JWT_SECRET | a long random string | Never commit the real one |
| JWT_EXPIRES | 7d | Token lifetime |
| CLIENT_URL | http://localhost:5173 | CORS origin. Comma separate several |

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

In development Vite proxies `/api` to `localhost:5000`, so `client/.env` can stay empty.
For production set `VITE_API_URL=https://your-api-host/api` before `npm run build`.

## Seeded accounts

| Role | Email | Password |
|---|---|---|
| Admin | admin@medix.com | Admin@123 |
| Doctor | ahmed@medix.com | Doctor@123 |
| Doctor | sara@medix.com | Doctor@123 |
| Doctor | ali@medix.com | Doctor@123 |
| Patient | patient@medix.com | Patient@123 |

The login page also has quick access buttons for Admin, Doctor and Patient. Remove that block from `client/src/pages/Login.jsx` before a real launch.

## Test the full workflow

1. Log in as **Admin**, open Manage users, add a doctor (for example Dr. Ahmed, Cardiologist, 5 years).
2. Log in as **Patient**, search "Ahmed", book a future date and time with a reason.
3. Try booking the same doctor, date and time again. It is rejected.
4. Log in as **Dr. Ahmed**, open Appointment requests, approve it.
5. Log back in as **Patient**. My appointments shows **Approved**.
6. Log in as **Admin**. All appointments and Manage users show everything. Try Deactivate on a user, then try logging in as them.

## API

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public (always creates a patient) |
| POST | /api/auth/login | Public |
| GET | /api/auth/me | Authenticated |
| GET | /api/doctors?search= | Authenticated |
| GET | /api/doctors/:id | Authenticated |
| POST | /api/appointments | Patient |
| GET | /api/appointments/my | Patient |
| GET | /api/appointments/doctor | Doctor |
| PATCH | /api/appointments/:id/status | Doctor (own appointments only) |
| PATCH | /api/appointments/:id/cancel | Patient (own and pending only) |
| GET | /api/admin/users | Admin |
| POST | /api/admin/doctors | Admin |
| PATCH | /api/admin/users/:id/toggle-status | Admin |
| DELETE | /api/admin/users/:id | Admin |
| GET | /api/admin/appointments | Admin |
| GET | /api/admin/stats | Admin |

## Business rules and where they live

| Rule | File |
|---|---|
| Passwords hashed with bcrypt | server/models/User.js |
| JWT check, deactivated users blocked | server/middleware/auth.js (protect) |
| Role gates | server/middleware/auth.js (authorizeRoles) and the routes files |
| No double booking, no past dates | server/controllers/appointmentController.js (create) |
| Doctor can only decide their own appointments | appointmentController.js (setStatus) |
| Patient cancels only own pending appointments | appointmentController.js (cancel) |
| Admin accounts cannot be deleted or deactivated | adminController.js |
| Frontend route guards by role | client/src/components/ProtectedRoute.jsx |

## Deployment notes

* **Database:** MongoDB Atlas free tier. Allow your host's IP (or 0.0.0.0/0 for a demo).
* **API:** Render or Railway. Root `server`, start command `npm start`, add the env variables above and set `CLIENT_URL` to your frontend URL. Run `npm run seed` once against the production database.
* **Client:** Vercel or Netlify. Root `client`, build `npm run build`, output `dist`, set `VITE_API_URL`. Add a rewrite of all paths to `/index.html` so deep links work.
