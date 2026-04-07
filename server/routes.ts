import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertSavedLocationSchema } from "@shared/schema";
import { mockCurrentWeather, mockForecast, mockAirQuality, mockGeoResults } from "./mock-data";

const OWM_BASE = "https://api.openweathermap.org";
const API_KEY = process.env.OWM_API_KEY || "";
const USE_MOCK = !API_KEY;

// Convert Celsius to Fahrenheit
function cToF(c: number): number {
  return Math.round((c * 9 / 5 + 32) * 10) / 10;
}

// Convert m/s to mph
function msToMph(ms: number): number {
  return Math.round(ms * 2.237 * 10) / 10;
}

// Deep-convert mock weather data from metric to imperial
function convertCurrentToImperial(data: any): any {
  const d = JSON.parse(JSON.stringify(data));
  d.main.temp = cToF(d.main.temp);
  d.main.feels_like = cToF(d.main.feels_like);
  d.main.temp_min = cToF(d.main.temp_min);
  d.main.temp_max = cToF(d.main.temp_max);
  if (d.wind?.speed) d.wind.speed = msToMph(d.wind.speed);
  if (d.wind?.gust) d.wind.gust = msToMph(d.wind.gust);
  return d;
}

function convertForecastToImperial(data: any): any {
  const d = JSON.parse(JSON.stringify(data));
  d.list = d.list.map((item: any) => {
    item.main.temp = cToF(item.main.temp);
    item.main.feels_like = cToF(item.main.feels_like);
    item.main.temp_min = cToF(item.main.temp_min);
    item.main.temp_max = cToF(item.main.temp_max);
    if (item.wind?.speed) item.wind.speed = msToMph(item.wind.speed);
    if (item.wind?.gust) item.wind.gust = msToMph(item.wind.gust);
    return item;
  });
  return d;
}

if (USE_MOCK) {
  console.log("[weather] No OWM_API_KEY found — using demo data");
} else {
  console.log("[weather] Using OpenWeatherMap API");
}

export function registerRoutes(server: Server, app: Express) {
  // Proxy: Geocoding - search cities
  app.get("/api/geo/direct", async (req, res) => {
    if (USE_MOCK) {
      const q = ((req.query.q as string) || "").toLowerCase();
      const filtered = mockGeoResults.filter((r) =>
        r.name.toLowerCase().includes(q)
      );
      return res.json(filtered.length ? filtered : mockGeoResults.slice(0, 3));
    }
    try {
      const { q, limit } = req.query;
      const url = `${OWM_BASE}/geo/1.0/direct?q=${encodeURIComponent(q as string)}&limit=${limit || 5}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch geocoding data" });
    }
  });

  // Proxy: Current weather
  app.get("/api/weather/current", async (req, res) => {
    if (USE_MOCK) {
      const units = req.query.units as string;
      const data = units === "imperial" ? convertCurrentToImperial(mockCurrentWeather) : mockCurrentWeather;
      return res.json(data);
    }
    try {
      const { lat, lon, units } = req.query;
      const url = `${OWM_BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units || "metric"}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch current weather" });
    }
  });

  // Proxy: 5-day/3-hour forecast
  app.get("/api/weather/forecast", async (req, res) => {
    if (USE_MOCK) {
      const units = req.query.units as string;
      const data = units === "imperial" ? convertForecastToImperial(mockForecast) : mockForecast;
      return res.json(data);
    }
    try {
      const { lat, lon, units } = req.query;
      const url = `${OWM_BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units || "metric"}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forecast data" });
    }
  });

  // Proxy: Air pollution
  app.get("/api/weather/air", async (req, res) => {
    if (USE_MOCK) {
      return res.json(mockAirQuality);
    }
    try {
      const { lat, lon } = req.query;
      const url = `${OWM_BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch air quality data" });
    }
  });

  // Saved locations CRUD
  app.get("/api/locations", (_req, res) => {
    const locations = storage.getSavedLocations();
    res.json(locations);
  });

  app.post("/api/locations", (req, res) => {
    const parsed = insertSavedLocationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.message });
    }
    const location = storage.addSavedLocation(parsed.data);
    res.json(location);
  });

  app.delete("/api/locations/:id", (req, res) => {
    storage.removeSavedLocation(parseInt(req.params.id));
    res.json({ success: true });
  });
}
