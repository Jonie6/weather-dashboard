# WeatherLens — Weather Dashboard

A fullstack weather dashboard built with React, Express, TypeScript, and Recharts. Pulls real-time data from the OpenWeatherMap API and presents current conditions, hourly/daily forecasts, temperature charts, and air quality metrics in a responsive, dark-mode-ready interface.

## Features

- **Current Weather** — temperature, feels-like, hi/lo, sunrise/sunset, weather condition with icon
- **24-Hour Temperature Chart** — interactive area chart comparing actual vs. feels-like temperature
- **Hourly Forecast** — horizontally scrollable 36-hour forecast with precipitation probability
- **5-Day Forecast** — daily min/max temperature bars with weather icons and rain chance
- **Air Quality Index** — AQI scale with PM2.5, PM10, and O3 breakdowns
- **Weather Details** — wind speed/direction, humidity, pressure, visibility, dew point, cloud cover
- **City Search** — geocoding-based city lookup with autocomplete
- **Unit Toggle** — switch between Celsius and Fahrenheit
- **Dark Mode** — system-aware with manual toggle
- **Demo Mode** — runs with realistic mock data when no API key is configured
- **Responsive** — works on mobile, tablet, and desktop

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Express, Node.js, TypeScript |
| Database | SQLite (better-sqlite3) + Drizzle ORM |
| API | OpenWeatherMap (Current, Forecast, Air Pollution, Geocoding) |
| Build | Vite, esbuild |

## Architecture

```
Client (React SPA)
  ├── Search bar → /api/geo/direct → OWM Geocoding API
  ├── Current weather → /api/weather/current → OWM Current Weather API
  ├── Forecast → /api/weather/forecast → OWM 5-Day/3-Hour Forecast API
  └── Air quality → /api/weather/air → OWM Air Pollution API

Server (Express)
  ├── API proxy routes (keeps API key server-side)
  ├── Saved locations CRUD (SQLite)
  └── Mock data fallback (demo mode)
```

The backend acts as an API proxy — the OpenWeatherMap API key never reaches the client. All weather endpoints are proxied through Express routes that append the key server-side.

## Setup

```bash
git clone https://github.com/Jonie6/weather-dashboard.git
cd weather-dashboard
npm install
```

### With OpenWeatherMap API Key

1. Sign up at [openweathermap.org](https://openweathermap.org/api) (free tier: 60 calls/min, 1M calls/month)
2. Set the environment variable:
   ```bash
   export OWM_API_KEY=your_api_key_here
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

### Demo Mode (No API Key)

Just run without setting `OWM_API_KEY` — the app serves realistic mock data:

```bash
npm run dev
```

## Project Structure

```
weather-dashboard/
├── client/src/
│   ├── components/          # React components
│   │   ├── air-quality.tsx  # AQI card with gradient bar
│   │   ├── current-weather.tsx
│   │   ├── daily-forecast.tsx
│   │   ├── forecast-chart.tsx  # Recharts area chart
│   │   ├── hourly-forecast.tsx
│   │   ├── search-bar.tsx      # Geocoding autocomplete
│   │   ├── theme-toggle.tsx
│   │   └── weather-details.tsx
│   ├── hooks/
│   │   └── use-weather.ts   # TanStack Query hooks for all API endpoints
│   ├── lib/
│   │   ├── weather-icons.tsx # Lucide icon mapping for weather codes
│   │   ├── weather-utils.ts  # Formatters, converters, helpers
│   │   └── queryClient.ts
│   └── pages/
│       └── dashboard.tsx     # Main dashboard layout
├── server/
│   ├── routes.ts            # Express API proxy routes
│   ├── mock-data.ts         # Demo mode data generator
│   ├── storage.ts           # Drizzle ORM storage layer
│   └── db.ts                # SQLite connection
├── shared/
│   └── schema.ts            # Drizzle schema + Zod validation
└── package.json
```

## API Integration Details

| Endpoint | OWM API | Free Tier Limit |
|----------|---------|-----------------|
| Current Weather | `/data/2.5/weather` | 60 calls/min |
| 5-Day Forecast | `/data/2.5/forecast` | 60 calls/min |
| Air Pollution | `/data/2.5/air_pollution` | 60 calls/min |
| Geocoding | `/geo/1.0/direct` | 60 calls/min |

Data is cached client-side with TanStack Query:
- Current weather: 5-minute stale time, 10-minute refetch interval
- Forecast: 10-minute stale time
- Air quality: 30-minute stale time
- Geocoding: 1-hour stale time

## License

MIT
