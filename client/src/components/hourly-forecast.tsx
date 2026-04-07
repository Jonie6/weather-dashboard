import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatTemp, getWeatherIconName } from "@/lib/weather-utils";
import { WeatherIcon } from "@/lib/weather-icons";
import { Droplets } from "lucide-react";

interface Props {
  data: any;
  units: string;
}

export function HourlyForecast({ data, units }: Props) {
  const items = data.list.slice(0, 12);

  return (
    <Card>
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">Hourly Forecast</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">
        <ScrollArea className="w-full">
          <div className="flex gap-1 px-3 pb-2">
            {items.map((item: any, i: number) => {
              const iconName = getWeatherIconName(item.weather?.[0]?.icon || "01d");
              const time = new Date(item.dt * 1000).toLocaleTimeString([], {
                hour: "numeric",
                hour12: true,
              });
              const pop = Math.round((item.pop || 0) * 100);

              return (
                <div
                  key={item.dt}
                  className="flex flex-col items-center gap-1.5 min-w-[60px] py-2 px-1.5 rounded-lg hover:bg-accent transition-colors"
                  data-testid={`hourly-item-${i}`}
                >
                  <span className="text-xs text-muted-foreground">{i === 0 ? "Now" : time}</span>
                  <WeatherIcon name={iconName} className="w-6 h-6 text-foreground opacity-70" />
                  <span className="text-sm font-medium tabular-nums">{formatTemp(item.main.temp, units)}</span>
                  {pop > 0 && (
                    <div className="flex items-center gap-0.5 text-xs text-blue-500 dark:text-blue-400">
                      <Droplets className="w-2.5 h-2.5" />
                      {pop}%
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
