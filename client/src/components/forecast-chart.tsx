import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

interface Props {
  data: any;
  units: string;
}

export function ForecastChart({ data, units }: Props) {
  // Take next 24 hours (8 entries at 3-hour intervals)
  const chartData = data.list.slice(0, 8).map((item: any) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString([], { hour: "numeric", hour12: true }),
    temp: Math.round(item.main.temp),
    feelsLike: Math.round(item.main.feels_like),
    humidity: item.main.humidity,
  }));

  const unit = units === "metric" ? "°C" : "°F";

  return (
    <Card>
      <CardHeader className="pb-2 px-5 pt-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">24-Hour Temperature</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number, name: string) => [
                `${value}${unit}`,
                name === "temp" ? "Temperature" : "Feels Like",
              ]}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(var(--chart-1))" }}
            />
            <Area
              type="monotone"
              dataKey="feelsLike"
              stroke="hsl(var(--chart-2))"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground mt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full" style={{ background: "hsl(var(--chart-1))" }} />
            Temperature
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 rounded-full border-dashed border-b" style={{ borderColor: "hsl(var(--chart-2))" }} />
            Feels Like
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
