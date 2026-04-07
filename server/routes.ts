import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertSavedLocationSchema } from "@shared/schema";
import { mockCurrentWeather, mockForecast, mockAirQuality, mockGeoResults } from "./mock-data";

const OWM_BASE = "https://api.openweathermap.org";
const API_KEY = process.env.OWM_API_KEY || "";
const USE_MOCK = !API_KEY;

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
      return res.json(mockCurrentWeather);
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
      return res.json(mockForecast);
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
