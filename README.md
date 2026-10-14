# Esport Platform: frontend

Aplikacja webowa platformy do prowadzenia lig i turniejów e-sportowych. Projekt zespołowy realizowany w Collegium Witelona.

Powiązane repozytoria:

- dokumentacja projektu: https://github.com/Mallinowo/esport-platform
- backend (REST API): https://github.com/Mallinowo/Esport-backend

## Projekt interfejsu

Figma (dostęp do komentowania): LINK_DO_FIGMY

## Stos technologiczny

- Vue 3, TypeScript, Vite
- Tailwind CSS
- Pinia, Vue Router
- Vitest

Aplikacja komunikuje się z backendem wyłącznie przez REST API i WebSocket. Typy i klient API są generowane ze specyfikacji OpenAPI backendu.

## Uruchomienie lokalne

Wymagania: Node.js 22 i npm.

```bash
git clone https://github.com/Mallinowo/Esport-frontend.git
cd Esport-frontend
cp .env.example .env
npm install
npm run dev
```

Aplikacja działa pod adresem http://localhost:5173. Adres API ustawia się w pliku `.env`.

## Skrypty

| Polecenie | Działanie |
|---|---|
| `npm run dev` | serwer deweloperski |
| `npm run build` | build produkcyjny |
| `npm run test` | testy jednostkowe (Vitest) |

## Zespół

- Jakub Maliński: lider projektu, frontend
- Wojciech Kasprzyk: frontend
