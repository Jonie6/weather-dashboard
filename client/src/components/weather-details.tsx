import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatWind, getWindDirection } from "@/lib/weather-utils";
import { Wind, Droplets, Eye, Gauge, Thermometer, CloudRain } from "lucide-react";

interface Props {
  data: any;
  units: string;
}

function DetailItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium tabular-nums">{value}</p>
      </div>
    </div>
  );
}

export function WeatherDetails({ data, units }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">Details</CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
          <DetailItem
            icon={Wind}
            label="Wind"
            value={`${formatWind(data.wind?.speed || 0, units)} ${getWindDirection(data.wind?.deg || 0)}`}
          />
          <DetailItem
            icon={Droplets}
            label="Humidity"
            value={`${data.main?.humidity || 0}%`}
          />
          <DetailItem
            icon={Gauge}
            label="Pressure"
            value={`${data.main?.pressure || 0} hPa`}
          />
          <DetailItem
            icon={Eye}
            label="Visibility"
            value={`${((data.visibility || 0) / 1000).toFixed(1)} km`}
          />
          <DetailItem
            icon={Thermometer}
            label="Dew Point"
            value={`${Math.round(data.main?.temp - ((100 - data.main?.humidity) / 5) || 0)}°`}
          />
          <DetailItem
            icon={CloudRain}
            label="Clouds"
            value={`${data.clouds?.all || 0}%`}
          />
        </div>
      </CardContent>
    </Card>
  );
}
