import { Card, CardContent } from "@/components/ui/card";
import { formatTemp, getWeatherIconName, formatTime } from "@/lib/weather-utils";
import { WeatherIcon } from "@/lib/weather-icons";
import { Sunrise, Sunset } from "lucide-react";

interface Props {
  data: any;
  units: string;
}

export function CurrentWeatherCard({ data, units }: Props) {
  const iconName = getWeatherIconName(data.weather?.[0]?.icon || "01d");
  const description = data.weather?.[0]?.description || "";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-5xl font-semibold tracking-tight tabular-nums" data-testid="text-temperature">
              {formatTemp(data.main.temp, units)}
            </div>
            <p className="text-sm text-muted-foreground mt-1 capitalize" data-testid="text-description">
              {description}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Feels like {formatTemp(data.main.feels_like, units)}
            </p>
          </div>
          <WeatherIcon name={iconName} className="w-16 h-16 text-primary opacity-80" />
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-sm">H: {formatTemp(data.main.temp_max, units)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="text-sm">L: {formatTemp(data.main.temp_min, units)}</span>
          </div>
        </div>

        {data.sys?.sunrise && data.sys?.sunset && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sunrise className="w-3.5 h-3.5" />
              <span>{formatTime(data.sys.sunrise, data.timezone)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sunset className="w-3.5 h-3.5" />
              <span>{formatTime(data.sys.sunset, data.timezone)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
