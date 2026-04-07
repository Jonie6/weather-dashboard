// Realistic mock data for demo mode (when no API key is configured)

export const mockCurrentWeather = {
  coord: { lon: -117.1611, lat: 32.7157 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  base: "stations",
  main: {
    temp: 22.4,
    feels_like: 21.8,
    temp_min: 19.5,
    temp_max: 25.1,
    pressure: 1015,
    humidity: 62,
    sea_level: 1015,
    grnd_level: 1013,
  },
  visibility: 10000,
  wind: { speed: 3.6, deg: 250, gust: 5.2 },
  clouds: { all: 12 },
  dt: Math.floor(Date.now() / 1000),
  sys: {
    type: 2,
    id: 2019346,
    country: "US",
    sunrise: Math.floor(Date.now() / 1000) - 21600,
    sunset: Math.floor(Date.now() / 1000) + 21600,
  },
  timezone: -25200,
  id: 5391811,
  name: "San Diego",
  cod: 200,
};

function generateForecastList() {
  const now = Math.floor(Date.now() / 1000);
  const baseTemp = 22;
  const list = [];

  const conditions = [
    { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
    { id: 801, main: "Clouds", description: "few clouds", icon: "02d" },
    { id: 802, main: "Clouds", description: "scattered clouds", icon: "03d" },
    { id: 500, main: "Rain", description: "light rain", icon: "10d" },
    { id: 800, main: "Clear", description: "clear sky", icon: "01n" },
    { id: 801, main: "Clouds", description: "few clouds", icon: "02n" },
  ];

  for (let i = 0; i < 40; i++) {
    const dt = now + i * 10800; // 3-hour intervals
    const hour = new Date(dt * 1000).getHours();
    const dayOffset = Math.floor(i / 8);

    // Simulate temperature curve
    const hourFactor = Math.sin(((hour - 6) / 24) * Math.PI * 2) * 4;
    const dayFactor = Math.sin((dayOffset / 5) * Math.PI) * 2;
    const temp = baseTemp + hourFactor + dayFactor + (Math.random() * 2 - 1);

    const condIndex = i % conditions.length;
    const isNight = hour < 6 || hour > 19;
    const cond = { ...conditions[condIndex] };
    if (isNight) {
      cond.icon = cond.icon.replace("d", "n");
    }

    const pop = cond.main === "Rain" ? 0.6 + Math.random() * 0.3 : Math.random() * 0.2;

    list.push({
      dt,
      main: {
        temp: Math.round(temp * 10) / 10,
        feels_like: Math.round((temp - 1.5) * 10) / 10,
        temp_min: Math.round((temp - 2) * 10) / 10,
        temp_max: Math.round((temp + 2) * 10) / 10,
        pressure: 1013 + Math.round(Math.random() * 6 - 3),
        humidity: 55 + Math.round(Math.random() * 25),
        sea_level: 1015,
        grnd_level: 1012,
      },
      weather: [cond],
      clouds: { all: Math.round(Math.random() * 80) },
      wind: {
        speed: 2 + Math.round(Math.random() * 5 * 10) / 10,
        deg: Math.round(Math.random() * 360),
        gust: 4 + Math.round(Math.random() * 6 * 10) / 10,
      },
      visibility: 10000,
      pop: Math.round(pop * 100) / 100,
      sys: { pod: isNight ? "n" : "d" },
      dt_txt: new Date(dt * 1000).toISOString().replace("T", " ").slice(0, 19),
    });
  }

  return list;
}

export const mockForecast = {
  cod: "200",
  message: 0,
  cnt: 40,
  list: generateForecastList(),
  city: {
    id: 5391811,
    name: "San Diego",
    coord: { lat: 32.7157, lon: -117.1611 },
    country: "US",
    population: 1394928,
    timezone: -25200,
    sunrise: Math.floor(Date.now() / 1000) - 21600,
    sunset: Math.floor(Date.now() / 1000) + 21600,
  },
};

export const mockAirQuality = {
  coord: { lon: -117.1611, lat: 32.7157 },
  list: [
    {
      main: { aqi: 2 },
      components: {
        co: 230.31,
        no: 0.14,
        no2: 8.94,
        o3: 68.66,
        so2: 1.86,
        pm2_5: 8.5,
        pm10: 12.3,
        nh3: 0.63,
      },
      dt: Math.floor(Date.now() / 1000),
    },
  ],
};

export const mockGeoResults = [
  { name: "San Diego", lat: 32.7157, lon: -117.1611, country: "US", state: "California" },
  { name: "San Francisco", lat: 37.7749, lon: -122.4194, country: "US", state: "California" },
  { name: "San Jose", lat: 37.3382, lon: -121.8863, country: "US", state: "California" },
  { name: "San Antonio", lat: 29.4241, lon: -98.4936, country: "US", state: "Texas" },
];
