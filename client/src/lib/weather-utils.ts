// Weather icon mapping to Lucide icon names
export function getWeatherIconName(code: string): string {
  const map: Record<string, string> = {
    "01d": "Sun", "01n": "Moon",
    "02d": "CloudSun", "02n": "CloudMoon",
    "03d": "Cloud", "03n": "Cloud",
    "04d": "Cloudy", "04n": "Cloudy",
    "09d": "CloudDrizzle", "09n": "CloudDrizzle",
    "10d": "CloudRain", "10n": "CloudRain",
    "11d": "CloudLightning", "11n": "CloudLightning",
    "13d": "Snowflake", "13n": "Snowflake",
    "50d": "Haze", "50n": "Haze",
  };
  return map[code] || "Cloud";
}

// Format temperature
export function formatTemp(temp: number, unit: string = "metric"): string {
  return `${Math.round(temp)}°${unit === "metric" ? "C" : "F"}`;
}

// Format wind speed
export function formatWind(speed: number, unit: string = "metric"): string {
  if (unit === "metric") return `${speed.toFixed(1)} m/s`;
  return `${speed.toFixed(1)} mph`;
}

// Get wind direction string
export function getWindDirection(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// Format date for display
export function formatDate(dt: number, timezone?: number): string {
  const date = new Date((dt + (timezone || 0)) * 1000);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

// Format time
export function formatTime(dt: number, timezone?: number): string {
  const date = new Date((dt + (timezone || 0)) * 1000);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

// Get AQI label
export function getAQILabel(aqi: number): { label: string; color: string } {
  const map: Record<number, { label: string; color: string }> = {
    1: { label: "Good", color: "text-green-500" },
    2: { label: "Fair", color: "text-yellow-500" },
    3: { label: "Moderate", color: "text-orange-500" },
    4: { label: "Poor", color: "text-red-500" },
    5: { label: "Very Poor", color: "text-red-700" },
  };
  return map[aqi] || { label: "Unknown", color: "text-muted-foreground" };
}

// Group forecast by day
export function groupForecastByDay(list: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  });
  return groups;
}
