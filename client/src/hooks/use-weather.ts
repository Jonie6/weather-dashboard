import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useCurrentWeather(lat: number | null, lon: number | null, units: string = "metric") {
  return useQuery({
    queryKey: ["/api/weather/current", lat, lon, units],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/weather/current?lat=${lat}&lon=${lon}&units=${units}`);
      return res.json();
    },
    enabled: lat !== null && lon !== null,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
  });
}

export function useForecast(lat: number | null, lon: number | null, units: string = "metric") {
  return useQuery({
    queryKey: ["/api/weather/forecast", lat, lon, units],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/weather/forecast?lat=${lat}&lon=${lon}&units=${units}`);
      return res.json();
    },
    enabled: lat !== null && lon !== null,
    staleTime: 10 * 60 * 1000,
  });
}

export function useAirQuality(lat: number | null, lon: number | null) {
  return useQuery({
    queryKey: ["/api/weather/air", lat, lon],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/weather/air?lat=${lat}&lon=${lon}`);
      return res.json();
    },
    enabled: lat !== null && lon !== null,
    staleTime: 30 * 60 * 1000,
  });
}

export function useGeoSearch(query: string) {
  return useQuery({
    queryKey: ["/api/geo/direct", query],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/geo/direct?q=${encodeURIComponent(query)}&limit=5`);
      return res.json();
    },
    enabled: query.length >= 2,
    staleTime: 60 * 60 * 1000,
  });
}
