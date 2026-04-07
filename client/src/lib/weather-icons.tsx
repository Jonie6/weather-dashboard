import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudDrizzle,
  CloudRain, CloudLightning, Snowflake, Haze, Cloudy,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<any>> = {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudDrizzle,
  CloudRain, CloudLightning, Snowflake, Haze, Cloudy: Cloud,
};

export function WeatherIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Cloud;
  return <Icon className={className} />;
}
