# Frontend

The frontend is a single-page React application serving as the landing page for the English teacher booking system.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/) — UI framework and build tool
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS styling
- [React Hook Form](https://react-hook-form.com/) — Lightweight form handling and validation
- [FullCalendar](https://fullcalendar.io/) — Interactive calendar for browsing and selecting time slots
- [dayjs](https://day.js.org/) — Lightweight date/time manipulation

## Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page with the booking calendar and form |
| `/admin` | Password-protected admin dashboard for the teacher |

## Getting Started

### 1. Navigate to the frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at <http://localhost:5173>.

> Make sure the backend is running at <http://localhost:8000> — the Vite dev server proxies `/api/*` requests to it automatically.

### 4. Build for production

```bash
npm run build
```

### 5. Linting and formatting

[ESLint](https://eslint.org/) is used for linting and [Prettier](https://prettier.io/) for formatting.

```bash
npm run lint:fix    # find and auto-fix code quality issues
npm run format      # format all files in src/
```

> Run `lint:fix` before `format` — linting may change code that formatting then cleans up.

## Project Structure

```
src/
├── api/
│   └── client.ts          # fetch wrappers for the backend API
├── components/
│   ├── BookingCalendar.tsx # weekly calendar with available slots
│   └── BookingModal.tsx    # booking form modal
├── App.tsx                 # root component
├── main.tsx                # entry point
├── index.css               # Tailwind directives
└── types.ts                # shared TypeScript types
```
