# Esport Platform: frontend

Web application for the esports leagues and tournaments platform. A team project built at Collegium Witelona.

Related repositories:

- project documentation: https://github.com/Mallinowo/Esport-backend/tree/main/docs
- backend (REST API): https://github.com/Mallinowo/Esport-backend

## Interface design

Figma (comments enabled): https://www.figma.com/design/CGoSyApn2FSrY2Xm8pGTCH/Esport-Platform---Design-System?node-id=0-1

## Tech stack

- Vue 3, TypeScript, Vite
- Tailwind CSS
- Pinia, Vue Router
- Vitest

The application talks to the backend only through the REST API and WebSocket. The API types and client are generated from the backend's OpenAPI specification.

## Running locally

Requirements: Node.js 22.12 or newer and npm.

```bash
git clone https://github.com/Mallinowo/Esport-frontend.git
cd Esport-frontend
cp .env.example .env
npm install
npm run dev
```

The application runs at http://localhost:5173. The API URL is set in `.env`.

## Mock API

Until the backend is ready, the dev server answers API requests with mocks (MSW) based on the API contract. Mock data is in `src/mocks`, and the same handlers are used in unit tests.

- `VITE_API_MOCKS=false` in `.env` turns the mocks off and sends requests to the real API.
- `?mock=empty`, `?mock=error` or `?mock=guest` added to the page URL shows the empty, error or logged out state.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run test` | unit tests (Vitest) |

## Team

- Jakub Maliński: project lead, frontend
- Wojciech Kasprzyk: frontend
