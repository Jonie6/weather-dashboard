import { useState, useEffect } from "react";
import { useCurrentWeather, useForecast, useAirQuality } from "@/hooks/use-weather";
import { SearchBar } from "@/components/search-bar";
import { CurrentWeatherCard } from "@/components/current-weather";
import { ForecastChart } from "@/components/forecast-chart";
import { HourlyForecast } from "@/components/hourly-forecast";
import { DailyForecast } from "@/components/daily-forecast";
import { WeatherDetails } from "@/components/weather-details";
import { AirQualityCard } from "@/components/air-quality";
import { ThemeToggle } from "@/components/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { CloudOff } from "lucide-react";

interface Location {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// Default location: San Diego (relevant for Qualcomm/Viasat)
const DEFAULT_LOCATION: Location = {
  name: "San Diego",
  lat: 32.7157,
  lon: -117.1611,
  country: "US",
  state: "California",
};

export default function Dashboard() {
  const [location, setLocation] = useState<Location>(DEFAULT_LOCATION);
  const [units, setUnits] = useState<string>("metric");

  const { data: current, isLoading: loadingCurrent, error: currentError } = useCurrentWeather(
    location.lat,
    location.lon,
    units
  );
  const { data: forecast, isLoading: loadingForecast } = useForecast(
    location.lat,
    location.lon,
    units
  );
  const { data: airData, isLoading: loadingAir } = useAirQuality(
    location.lat,
    location.lon
  );

  const handleSelectLocation = (loc: Location) => {
    setLocation(loc);
  };

  const toggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  // Check if we have an API key error
  const hasApiError = current?.cod === 401 || currentError;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="WeatherLens logo">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <circle cx="16" cy="16" r="6" fill="currentColor" className="text-primary" />
              <line x1="16" y1="2" x2="16" y2="8" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="16" y1="24" x2="16" y2="30" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="2" y1="16" x2="8" y2="16" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <line x1="24" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="2" className="text-primary" />
            </svg>
            <span className="text-base font-semibold tracking-tight hidden sm:block">WeatherLens</span>
          </div>
          <div className="flex-1 max-w-md">
            <SearchBar onSelect={handleSelectLocation} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleUnits}
              className="text-xs font-mono font-medium px-2.5 py-1.5 rounded-md bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
              data-testid="button-toggle-units"
            >
              {units === "metric" ? "°C" : "°F"}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Location label */}
        <div className="mb-5">
          <h1 className="text-xl font-semibold" data-testid="text-location-name">
            {location.name}
            {location.state && <span className="text-muted-foreground font-normal">, {location.state}</span>}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5" data-testid="text-country">
            {location.country}
            {current?.dt && (
              <span> &middot; Updated {new Date(current.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            )}
          </p>
        </div>

        {hasApiError ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <CloudOff className="w-16 h-16 text-muted-foreground mb-4" />
            <h2 className="text-lg font-medium mb-2">API Key Required</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Set your OpenWeatherMap API key as the OWM_API_KEY environment variable. 
              Get a free key at openweathermap.org/api
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left: Current weather + details */}
            <div className="lg:col-span-1 space-y-4">
              {loadingCurrent ? (
                <Skeleton className="h-[280px] rounded-lg" />
              ) : current?.main ? (
                <CurrentWeatherCard data={current} units={units} />
              ) : null}

              {loadingAir ? (
                <Skeleton className="h-[120px] rounded-lg" />
              ) : airData?.list?.[0] ? (
                <AirQualityCard data={airData.list[0]} />
              ) : null}

              {loadingCurrent ? (
                <Skeleton className="h-[200px] rounded-lg" />
              ) : current?.main ? (
                <WeatherDetails data={current} units={units} />
              ) : null}
            </div>

            {/* Right: Charts + forecasts */}
            <div className="lg:col-span-2 space-y-4">
              {loadingForecast ? (
                <Skeleton className="h-[300px] rounded-lg" />
              ) : forecast?.list ? (
                <ForecastChart data={forecast} units={units} />
              ) : null}

              {loadingForecast ? (
                <Skeleton className="h-[180px] rounded-lg" />
              ) : forecast?.list ? (
                <HourlyForecast data={forecast} units={units} />
              ) : null}

              {loadingForecast ? (
                <Skeleton className="h-[240px] rounded-lg" />
              ) : forecast?.list ? (
                <DailyForecast data={forecast} units={units} />
              ) : null}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 text-center text-xs text-muted-foreground">
        Powered by OpenWeatherMap API &middot; Built with React + Express + Recharts
      </footer>
    </div>
  );
}
