# Ara API

Backend API for Ara, a social network application. It provides authentication, users, posts, replies, follows, likes, notifications, image uploads, and real-time events through Socket.IO. The application source is written in TypeScript and is compiled to `dist/` for production execution.

## Stack

- Node.js and Express
- PostgreSQL with Sequelize
- JWT and bcrypt authentication
- Joi request validation
- Multer image uploads
- Socket.IO real-time events

## TypeScript

Application code under `api/`, `libs/`, and `test/` is written in TypeScript. Shared domain entities and DTOs are defined in [api/types/index.ts](api/types/index.ts), so controllers and stores should reuse those contracts instead of declaring duplicate shapes. The compiler has `noImplicitAny` enabled and the project does not use explicit `any` in the TypeScript source.

The Sequelize CLI compatibility layer remains in JavaScript: `config.js`, `db/config.js`, `db/models/`, and `db/migrations/`. These files are intentionally kept compatible with the CLI while the application layer uses TypeScript.

## Requirements

- Node.js 18 or newer
- PostgreSQL
- TypeScript toolchain installed through the project dependencies

## Installation

```bash
npm install
cp .env.example .env
```

Configure the database and application values in `.env`. At minimum, configure `DATABASE_URL` for the runtime connection or the `DB_DEV_*` variables used by Sequelize CLI migrations, along with `SECRET`, `PORT`, `API_URL`, and `FRONTEND_URL`.

Run the migrations:

```bash
npm run migrations:run
```

Start the API in development mode:

```bash
npm run dev
```

For a regular start:

```bash
npm start
```

The default local server runs at `http://localhost:3000`.

`npm run dev` executes the TypeScript entry point directly. `npm start` expects a previous `npm run build` and runs `dist/api/index.js`.

To type-check without generating files:

```bash
npx tsc --noEmit
```

## Available endpoints

All routes are mounted at the server root.

| Resource | Endpoints |
| --- | --- |
| Authentication | `POST /auth/login` |
| Users | `GET /user`, `GET /user/:id`, `POST /user`, `PATCH /user/:id`, `DELETE /user/:id` |
| Posts | `GET /post`, `GET /post/:id`, `POST /post`, `DELETE /post` |
| Replies | `POST /reply`, `DELETE /reply` |
| Follows | `GET /follow/followers/:user_id`, `GET /follow/following/:user_id`, `POST /follow`, `DELETE /follow` |
| Likes | `POST /like`, `GET /like/:id`, `DELETE /like` |
| Notifications | `GET /notification/:user_id`, `PATCH /notification/:user_id` |

Protected endpoints expect a JWT header:

```http
Authorization: Bearer <token>
```

## Pagination

Pagination is available only for posts and notifications.

```http
GET /post?page=2&limit=10
GET /post?author_id=4&page=1&limit=20
GET /notification/4?page=1&limit=20
```

Paginated responses use this structure:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

The server caps `limit` at 100.

## Real-time events

Socket.IO is served by the same HTTP server. The API emits events for new posts, replies, likes, dislikes, and notifications. The development example client is available at `public/socket.html`.

## Tests

Run the automated tests with:

```bash
npm test
```

The current tests cover pagination utilities and validation middleware. Integration tests against HTTP routes and PostgreSQL are not configured yet.

## Project structure

```text
api/
  auth/                 JWT helpers (.ts)
  components/           Feature routes, controllers, schemas, and stores (.ts)
  middlewares/          Authentication, validation, and error handling (.ts)
  types/                Shared entities, DTOs, and API contracts (.ts)
  utils/                Shared utilities such as pagination (.ts)
db/
  models/               Sequelize models (JavaScript-compatible for CLI)
  migrations/           Database migrations
libs/                   Sequelize, Socket.IO, and upload integrations (.ts)
public/                 Static files and uploaded images
test/                   Automated tests (.ts)
config.js               Runtime configuration loaded by Sequelize CLI
tsconfig.json           TypeScript compiler configuration
```

## Security notes

Never commit `.env`, credentials, database URLs, uploaded files, or production JWT secrets. Use a strong value for `SECRET` and review authorization and file-upload behavior when modifying protected routes.
