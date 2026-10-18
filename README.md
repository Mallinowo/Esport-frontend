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

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/Mallinowo/Esport-frontend.git
cd Esport-frontend
cp .env.example .env
npm install
npm run dev
```

The application runs at http://localhost:5173. The API URL is set in `.env`.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | development server |
| `npm run build` | production build |
| `npm run test` | unit tests (Vitest) |

## Team

- Jakub Maliński: project lead, frontend
- Wojciech Kasprzyk: frontend
