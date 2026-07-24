# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

NestJS API for an RPG game:

- **Equipment/inventory system** inspired by Archero (implemented).
- **Map system**: Catan-style hex maps with locations, mobs, difficulty, loot types (implemented — see below).
- **Combat system**: turn-based, inspired by Pokemon (planned, not implemented). Boss locations, player map progression, and actual loot dropping are also deferred.

## Commands

```bash
docker-compose up -d       # start Postgres (5432) + Redis (6379) containers
npm run start:dev          # dev server with watch (port 3000)
npm run build              # nest build
npm run lint               # eslint with --fix
npm test                   # jest unit tests (*.spec.ts under src/)
npm test -- path/to/file.spec.ts   # single test file
npm run test:e2e           # e2e tests (test/jest-e2e.json)
npm run start:redis        # redis-cli inside the condgame-redis container
```

Env vars (see `.env.example`): DB_*, REDIS_*, PORT, NODE_ENV, `JWT_SECRET` (dev fallback in code), `ADMIN_API_KEYS` (comma-separated; no fallback — admin routes reject everything if unset). Caveat: nothing loads `.env` (no dotenv/@nestjs/config) — the DB/Redis code defaults just happen to match it, so vars like `ADMIN_API_KEYS` must be exported in the shell.

## Architecture

Standard NestJS modules under `src/`, one per domain, wired in `app.module.ts`. TypeORM + Postgres with `synchronize: true` outside production (no migrations). Every entity must be registered in the `entities` array of `src/database/postgres.module.ts`. `RedisModule` is `@Global()` and exports an `ioredis` client under the `REDIS_CLIENT` token (not yet consumed anywhere).

### Domain model and ownership chain

`User` 1–1 `Inventory` 1–1 `Build`, `Inventory` 1–N `Equipment`, `Equipment` N–1 `EquipmentDefinition`.

- **user**: just `id` + unique `username`. `UserService.createUser` also creates the user's inventory (which in turn creates its build) — creation is chained, one per user.
- **equipment**: `EquipmentDefinition` is the catalog (name + type: weapon/offhand/helmet/armor/boots); `Equipment` is an owned instance with `tier` (1–10), `condition` (solid → masterpiece), and a derived `power` column.
- **inventory**: orchestrator module. Controllers/services here call into `EquipmentService` and `BuildService`; power is computed in `InventoryService.calculateEquipmentPower` from `src/equipment/configs/power-mapping.json` (tier base + condition bonus) and stored at creation time.
- **build**: the equipped loadout — one nullable slot per `EquipmentType`. Slot names on the `Build` entity match `EquipmentType` values exactly (`build[slot] = equipment` relies on this).

The dependency direction is: `user` → `inventory` → (`equipment`, `build`). `BuildModule` has no controller; all equip/unequip endpoints live on `InventoryController` under `/inventory/build`.

### Map system (`src/map/`)

`GameMap` (table `maps`) has an integer id that **is** the progression order (map 1, 2, 3…). Each map holds 19 `Location` placements on a radius-2 hex board (axial `q, r` coords from `HEX_COORDS`), drawn from a catalog of `LocationDefinition`s (~56 seeded via admin endpoints). Key rules:

- **Loot type is fixed on the definition** (`LootType` enum: leather/wood/stone/iron/magic_orb). Each map must place ≥3 locations per loot type.
- **Difficulty (1–5) is rolled per placement**, independent of loot, balanced ≥3 per tier. It only scales loot *quantity* (`DIFFICULTY_LOOT_MULTIPLIER`, not yet consumed — loot dropping isn't built).
- **Mobs** (`MobDefinition`: difficulty tier + hp/atk/def) are attached per placement (`LocationMob`) matching the location's difficulty tier.
- Pure generation/balance logic lives in `src/map/map-generation.ts` (tested in `map-generation.spec.ts`); `MapService.regenerateMap` wraps it in a transaction that deletes and reinserts a map's locations (visits and mob spawns cascade — **visit counts reset on regeneration**).
- Regeneration runs weekly via `@Cron(MAP_REGEN_CRON)` (`@nestjs/schedule`) over all maps, and on demand via `POST /admin/map/:mapId/regenerate`.
- `LocationVisit` tracks per-user visit counts, upserted with a raw `ON CONFLICT` increment.
- Game-balance constants live in `src/lib/constants.ts` — add new tuning knobs there, not inline.

### Admin access

Admin-only endpoints use the `@Admin()` decorator (`AdminGuard`): the `x-api-key` header must match one of the comma-separated keys in `ADMIN_API_KEYS` (constant-time compare; empty env ⇒ everything rejected). Admin surface: `/admin/map/*` (create map, regenerate, seed location/mob definitions), `POST /equipment/definition`, `GET /user/all`, `GET /user/:id`. Catalog seeding endpoints take JSON arrays (bulk).

### Auth

JWT bearer auth (passport-jwt, 7d expiry). Login is username-only, no password (`POST /auth/login`). Protect routes with the `@Player()` decorator and get the caller via `@CurrentUser() user: AuthenticatedUser` (`user.userId`, `user.username`). Controllers are unprotected by default — there is no global guard.

### Conventions

- Global `ValidationPipe` with `whitelist`, `forbidNonWhitelisted`, `transform` — DTOs use class-validator and are the trust boundary.
- Entities use snake_case column names via `@Column({ name: ... })`, expose FK id columns alongside relations, and have an `Object.assign` constructor.
- Services throw Nest HTTP exceptions (`NotFoundException`, `ConflictException`) directly.
