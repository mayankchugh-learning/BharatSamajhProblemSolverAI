import { ExternalLink } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

export function Advertisement() {
  const { config } = useLocale();
  const promo = config.promotion;

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-gradient-to-r ${promo.gradientFrom} ${promo.gradientTo} p-6 text-white shadow-xl`}>
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      <div className={`absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 ${promo.accentColor} rounded-full blur-2xl group-hover:opacity-80 transition-all duration-500`} />
      
      <div className="relative z-10">
        <span className="inline-block px-2 py-1 rounded bg-white/20 text-[10px] font-bold tracking-wider mb-3">
          PROMOTED
        </span>
        <h3 className="text-lg font-bold mb-2">{promo.title}</h3>
        <p className="text-white/80 text-sm mb-4 max-w-[80%]">
          {promo.description}
        </p>
        <a
          href="/"
          className="inline-flex items-center text-xs font-bold uppercase tracking-widest hover:text-white/70 transition-colors"
        >
          Learn More <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </div>
    </div>
  );
}
