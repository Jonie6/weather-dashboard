import { Card, CardContent } from "@/components/ui/card";
import { getAQILabel } from "@/lib/weather-utils";
import { Wind } from "lucide-react";

interface Props {
  data: any;
}

export function AirQualityCard({ data }: Props) {
  const aqi = data.main?.aqi || 1;
  const { label, color } = getAQILabel(aqi);

  // AQI bar: 1-5 scale
  const percentage = (aqi / 5) * 100;

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Air Quality</span>
          </div>
          <span className={`text-sm font-semibold ${color}`} data-testid="text-aqi-label">{label}</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(90deg, hsl(120, 60%, 45%), hsl(60, 80%, 50%), hsl(30, 90%, 50%), hsl(0, 80%, 50%), hsl(300, 50%, 35%))`,
              backgroundSize: "500% 100%",
              backgroundPosition: `${percentage}% 0`,
            }}
          />
        </div>
        {data.components && (
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-muted-foreground">
            <div>PM2.5: <span className="font-medium text-foreground tabular-nums">{data.components.pm2_5?.toFixed(1)}</span></div>
            <div>PM10: <span className="font-medium text-foreground tabular-nums">{data.components.pm10?.toFixed(1)}</span></div>
            <div>O3: <span className="font-medium text-foreground tabular-nums">{data.components.o3?.toFixed(1)}</span></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
