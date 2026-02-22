import { useLocale } from "@/contexts/locale-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LocaleSwitcherProps {
  variant?: "ghost" | "outline" | "default";
  size?: "sm" | "default" | "icon";
  showLabel?: boolean;
}

export function LocaleSwitcher({ variant = "ghost", size = "sm", showLabel = false }: LocaleSwitcherProps) {
  const { locale, config, setLocale, availableLocales } = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className="gap-1.5">
          <span className="text-base leading-none">{config.flagEmoji}</span>
          {showLabel && <span className="hidden sm:inline text-xs">{config.countryName}</span>}
          {!showLabel && <Globe className="w-3.5 h-3.5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        {availableLocales.map((loc) => (
          <DropdownMenuItem
            key={loc.code}
            onClick={() => setLocale(loc.code)}
            className={locale === loc.code ? "bg-primary/10 font-semibold" : ""}
          >
            <span className="text-base mr-2">{loc.flagEmoji}</span>
            <span>{loc.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
