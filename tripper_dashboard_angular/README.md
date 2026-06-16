
# Tripper

This is an Angular (CLI) application scaffolded with Angular CLI v20.x.

## Quick Start

- **Install deps:** `npm install`
- **Run dev server:** `npm start` or `ng serve`
- **Open in browser:** `http://localhost:4200/`

## Folder structure

Top-level files and folders (short):

- `angular.json` : Angular CLI workspace configuration.
- `package.json` : npm scripts and dependencies.
- `tsconfig*.json` : TypeScript compiler configuration files.
- `public/` : Public/static assets copied to the build output.
- `src/` : Source files for the application (see detailed tree below).

Detailed `src/` layout:

`src/`
- `index.html` — App shell HTML.
- `main.ts` — App bootstrap (Angular entrypoint).
- `styles.css` — Global styles.
- `app/` — Main application sources:
	- `app.ts`, `app.routes.ts`, `app.config.ts`, `app.html`, `app.css` — app-level wiring and layout.
	- `components/` — Reusable UI pieces (each component in its own folder). Examples:
		- `card/` — small UI card component (`card.ts`, `card.html`, `card.css`).
		- `place-*`, `hotel-*`, `experience-*`, `reservation-*`, `user-*` components — modals and tables for CRUD-style UI.
		- `sidebar/`, `topbar/` — layout components.
	- `pages/` — Feature pages (each page has its own folder):
		- `dashboard/`, `places/`, `hotels/`, `experiences/`, `reservations/`, `users/`, `login/`.
	- `services/` — Application services that encapsulate API and business logic:
		- `auth.service.ts`, `http.service.ts`, `user.service.ts`, `hotel.service.ts`, `reservation.service.ts`, `experiences.ts`, `places.ts`, `dashboard.ts`.
	- `models/` — TypeScript interfaces / models: `user.ts`, `place.ts`, `hotel.ts`, `experience.ts`, `reservation.ts`.
	- `guards/` — Route guards (e.g., `auth-guard.ts`) used to protect routes.

## What's what (brief)

- Components: Small, focused UI units (presentation + minimal logic). Found under `src/app/components/`.
- Pages: Route-backed views that assemble components and services. Found under `src/app/pages/`.
- Services: Handle HTTP calls, auth, and shared state. Found under `src/app/services/`.
- Models: Data shape contracts used across services and components.
- Guards: Protect routes based on auth or permissions.

## Common tasks

- Start dev server: `npm start` or `ng serve`
- Run tests: `npm test` or `ng test`
- Build production: `ng build --configuration production`

## Notes

- This README focuses on the repository layout. See inline docs and comments in `src/app/` for component/service specifics.
- If you want, I can expand this README with a developer setup section, API examples, or contribution guidelines.

