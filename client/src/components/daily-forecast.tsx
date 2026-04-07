import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTemp, getWeatherIconName, groupForecastByDay } from "@/lib/weather-utils";
import { WeatherIcon } from "@/lib/weather-icons";
import { Droplets } from "lucide-react";

interface Props {
  data: any;
  units: string;
}

export function DailyForecast({ data, units }: Props) {
  const grouped = groupForecastByDay(data.list);
  const days = Object.entries(grouped).slice(0, 5);

  return (
    <Card>
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">5-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="space-y-1">
          {days.map(([date, items], i) => {
            const temps = items.map((item: any) => item.main.temp);
            const minTemp = Math.min(...temps);
            const maxTemp = Math.max(...temps);
            const maxPop = Math.max(...items.map((item: any) => (item.pop || 0) * 100));

            // Use the midday entry for icon, or first one
            const midday = items.find((item: any) => {
              const h = new Date(item.dt * 1000).getHours();
              return h >= 11 && h <= 15;
            }) || items[0];

            const iconName = getWeatherIconName(midday.weather?.[0]?.icon || "01d");

            // Temperature bar width relative to overall range
            const allTemps = data.list.map((item: any) => item.main.temp);
            const globalMin = Math.min(...allTemps);
            const globalMax = Math.max(...allTemps);
            const range = globalMax - globalMin || 1;
            const barLeft = ((minTemp - globalMin) / range) * 100;
            const barWidth = ((maxTemp - minTemp) / range) * 100;

            return (
              <div
                key={date}
                className="flex items-center gap-3 py-2 border-b border-border last:border-0"
                data-testid={`daily-item-${i}`}
              >
                <span className="text-sm w-24 shrink-0">{i === 0 ? "Today" : date}</span>
                <WeatherIcon name={iconName} className="w-5 h-5 text-foreground opacity-70 shrink-0" />
                {maxPop > 10 && (
                  <div className="flex items-center gap-0.5 text-xs text-blue-500 dark:text-blue-400 w-10 shrink-0">
                    <Droplets className="w-2.5 h-2.5" />
                    {Math.round(maxPop)}%
                  </div>
                )}
                {maxPop <= 10 && <div className="w-10 shrink-0" />}
                <span className="text-xs text-muted-foreground w-10 text-right tabular-nums shrink-0">
                  {formatTemp(minTemp, units)}
                </span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full relative min-w-[60px]">
                  <div
                    className="absolute h-full rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 4)}%`,
                      background: `linear-gradient(90deg, hsl(var(--chart-1)), hsl(var(--chart-2)))`,
                    }}
                  />
                </div>
                <span className="text-xs font-medium w-10 tabular-nums shrink-0">
                  {formatTemp(maxTemp, units)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
