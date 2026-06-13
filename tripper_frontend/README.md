# Tripper Frontend

This repository contains the frontend for the Tripper application (React). The README below describes the main folders and important files to help contributors navigate the project.

## Quick Start

- Install dependencies:

```
npm install
```

- Run in development:

```
npm start
```

## Project Structure

Root files:
- `package.json`: project metadata and npm scripts.
- `public/`: static public assets (entry `index.html`, manifest, robots).
- `src/`: application source code (React).

Top-level `src/` layout (important files):

```
src/
  App.js, App.css, index.js
  assets/
  components/
  pages/
  routes/
  services/
  setupTests.js, reportWebVitals.js
```

Description of major directories

- `src/assets/`: static images, icons and helper modules (e.g., `axiousInstance/axoiusInstance.js`).

- `src/components/`:
  - `chat/`: chat UI components (`ChatSidebar.jsx`, `ChatWindow.jsx`, `MessageBubble.jsx`, `NewMessageInput.jsx`).
  - `detailsComponents/`: components used on details pages (booking box, descriptions, reviews, galleries).
  - `host/`: components and subfolders for the host experience (listing forms, host layout, hotel-specific forms under `hotel/`, reservation components under `reservations/`).
  - `onBoardingComponents/`: UI for onboarding (header, footer, service sections, top places).
  - `sharedComponents/`: reusable components across the app (`HomeCard.jsx`, `navbar.jsx`, `Pagination.jsx`, etc.).

- `src/pages/`:
  - Route-backed pages for the app: `home.jsx`, `details.jsx`, `auth.jsx`, `profile` pages, `ChatPage.jsx`, etc.
  - `host/` subfolder: pages for host dashboard, listing creation/editing, reservations and validation schemas (`experienceSchema.js`, `hotelSchema.js`).

- `src/routes/`: application route definitions, e.g. `HostRoutes.jsx`.

- `src/services/`: API and business logic wrappers used across the app (`authservice.js`, `hotels.service.js`, `review.service.js`, `reservationsService.js`, etc.).

## Notes & Conventions

- Files with `.jsx` are React components.
- The project uses a convention of grouping component families into folders (e.g., `host/`, `chat/`) to keep related UI together.
- Form logic and validation for host flows are placed under `pages/host/validation`.

## Contributing

- Follow existing patterns for components and folder organization.
- Run `npm test` to run tests (if present) and `npm start` for development.

If you'd like, I can also:
- Add a short CONTRIBUTING.md with code style and PR guidelines.
- Generate a visual tree file or update package scripts.

---
Generated automatically to describe the current workspace layout.
