import { useState, useRef, useEffect } from "react";
import { useGeoSearch } from "@/hooks/use-weather";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  onSelect: (loc: { name: string; lat: number; lon: number; country: string; state?: string }) => void;
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data: results, isLoading } = useGeoSearch(query);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item: any) => {
    onSelect({
      name: item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
    });
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className="pl-9 pr-8 h-9 bg-secondary border-0 text-sm"
          data-testid="input-search-city"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin" />
        )}
      </div>

      {open && results && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-popover-border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map((item: any, i: number) => (
            <button
              key={`${item.lat}-${item.lon}-${i}`}
              onClick={() => handleSelect(item)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-accent transition-colors"
              data-testid={`button-location-${i}`}
            >
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="font-medium">{item.name}</span>
              {item.state && <span className="text-muted-foreground">{item.state},</span>}
              <span className="text-muted-foreground">{item.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
