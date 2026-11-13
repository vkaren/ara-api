# Repository Guidelines

## Project Structure & Module Organization

This repository contains a Node.js API for the Ara application. The application entry point is `api/index.ts`. Application source code uses TypeScript under `api/`, `libs/`, and `test/`; each component in `api/components/` typically contains a `controller.ts`, `network.ts`, `schema.ts`, and `store.ts`. Shared domain and DTO contracts live in `api/types/index.ts`. Shared middleware is in `api/middlewares/`, authentication helpers are in `api/auth/`, pagination utilities are in `api/utils/`, and Socket.IO/Sequelize integrations are in `libs/`. Sequelize CLI configuration, models, and migrations remain JavaScript-compatible files under `config.js`, `db/config.js`, `db/models/`, and `db/migrations/`. Static files/uploads are served from `public/` (including `public/files/`).

## Build, Test, and Development Commands

- `npm install` — install dependencies.
- `npm run dev` — run the TypeScript API with `tsx` and restart on source changes.
- `npm start` — run the compiled API from `dist/`.
- `npm test` — run the automated tests with Node's built-in test runner.
- `npx tsc --noEmit` — type-check the TypeScript source without writing build output.
- `npm run build` — install dependencies, compile TypeScript to `dist/`, and apply pending Sequelize migrations.
- `npm run migrations:run` — apply pending migrations; use `npm run migrations:revert` to undo the latest one.
- `npm run migrations:generate -- migration-name` — create a migration template.

There is no lint command configured. Run `npx tsc --noEmit` and `npm test` before submitting changes. Manually verify affected endpoints and socket events when making changes.

## Coding Style & Naming Conventions

Use TypeScript with CommonJS modules, two-space indentation, semicolons, and double-quoted strings, matching existing code. Use camelCase for variables/functions, PascalCase for Sequelize model classes, and lowercase descriptive filenames such as `auth.handler.ts`. Keep feature-specific validation, persistence, controllers, and routing within the relevant component. Put reusable entity, DTO, pagination, and transaction contracts in `api/types/index.ts`; do not duplicate those definitions inside feature modules. `noImplicitAny` is enabled and explicit `any` is not allowed in `api/`, `libs/`, or `test/`; use a specific interface, union, generic, or `unknown` with narrowing instead. Avoid changing runtime behavior during the migration.

## Testing Guidelines

Tests use Node's built-in `node:test` runner and are authored in TypeScript. The test command compiles to `.test-dist/` and executes the generated JavaScript. Tests currently cover pagination behavior and validation middleware. There is no coverage threshold yet. For changes, run `npx tsc --noEmit` and `npm test`, start the service locally, exercise the affected API routes and authentication/error paths, and verify relevant database migrations against a development PostgreSQL database.

Pagination is implemented only for `GET /post` and `GET /notification/:user_id`. Both endpoints accept `page` and `limit`; the maximum limit is 100. Do not add pagination to other resources without an explicit requirement.

## Commit & Pull Request Guidelines

Recent commits use short, imperative descriptions such as `Cors`, `User route fixed`, and `fix authorization and middleware error flow`. Follow that concise style while stating the behavior changed. Pull requests should explain the change, identify migrations or configuration changes, list verification steps/commands, and include request/response examples or screenshots when the API or `public/` behavior changes.

## Security & Configuration Tips

Copy `.env.example` to `.env` and configure PostgreSQL, API URLs, ports, and JWT settings locally. Never commit `.env`, credentials, database URLs, uploaded files, or real secrets. Review authentication, authorization, input validation, and file-upload handling when modifying related routes; run migrations deliberately and check their rollback behavior.
