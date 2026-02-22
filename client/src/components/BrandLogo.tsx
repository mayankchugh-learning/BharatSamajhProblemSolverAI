import { cn } from "@/lib/utils";
import { useLocale } from "@/contexts/locale-context";
import type { LocaleCode } from "@shared/locales";

function IndianFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Indian Flag" role="img">
      <rect width="36" height="8" fill="#FF9933" rx="2" ry="2" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#138808" rx="2" ry="2" />
      <circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" strokeWidth="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        return (
          <line key={i} x1={18 + 1.4 * Math.cos(angle)} y1={12 + 1.4 * Math.sin(angle)}
            x2={18 + 3 * Math.cos(angle)} y2={12 + 3 * Math.sin(angle)} stroke="#000080" strokeWidth="0.3" />
        );
      })}
      <circle cx="18" cy="12" r="0.8" fill="#000080" />
    </svg>
  );
}

function SingaporeFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Singapore Flag" role="img">
      <rect width="36" height="12" fill="#EE2536" rx="2" ry="2" />
      <rect y="12" width="36" height="12" fill="#FFFFFF" rx="2" ry="2" />
      <circle cx="7" cy="5.5" r="3" fill="#FFFFFF" />
      <circle cx="8" cy="5.5" r="3" fill="#EE2536" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = ((i * 72 - 90) * Math.PI) / 180;
        return <circle key={i} cx={10.5 + 2.5 * Math.cos(a)} cy={5.5 + 2.5 * Math.sin(a)} r="0.5" fill="#FFFFFF" />;
      })}
    </svg>
  );
}

function HongKongFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Hong Kong Flag" role="img">
      <rect width="36" height="24" fill="#DE2910" rx="2" ry="2" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = ((i * 72 - 90) * Math.PI) / 180;
        return <ellipse key={i} cx={18 + 5 * Math.cos(a)} cy={12 + 5 * Math.sin(a)} rx="2.5" ry="1.2"
          fill="#FFFFFF" transform={`rotate(${i * 72}, ${18 + 5 * Math.cos(a)}, ${12 + 5 * Math.sin(a)})`} />;
      })}
      <circle cx="18" cy="12" r="1.5" fill="#DE2910" />
    </svg>
  );
}

function JapanFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Japan Flag" role="img">
      <rect width="36" height="24" fill="#FFFFFF" rx="2" ry="2" />
      <rect width="36" height="24" fill="none" stroke="#E5E7EB" strokeWidth="0.5" rx="2" ry="2" />
      <circle cx="18" cy="12" r="7" fill="#BC002D" />
    </svg>
  );
}

function ChinaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="China Flag" role="img">
      <rect width="36" height="24" fill="#DE2910" rx="2" ry="2" />
      <polygon points="6,4 7,7.1 4,5.2 8,5.2 5,7.1" fill="#FFDE00" />
      {[[10, 2], [12, 3.5], [12, 6], [10, 7.5]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="0.8" fill="#FFDE00" />
      ))}
    </svg>
  );
}

function USFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="US Flag" role="img">
      <rect width="36" height="24" fill="#FFFFFF" rx="2" ry="2" />
      {[0, 2, 4, 6, 8, 10, 12].map((i) => (
        <rect key={i} y={i * (24 / 13)} width="36" height={24 / 13} fill="#B22234" />
      ))}
      <rect width="14.4" height={24 * 7 / 13} fill="#3C3B6E" />
      {[0, 1, 2, 3, 4].map((r) =>
        [0, 1, 2, 3, 4, 5].map((c) => (
          <circle key={`${r}-${c}`} cx={1.2 + c * 2.2} cy={1 + r * 2.2} r="0.5" fill="#FFFFFF" />
        ))
      )}
    </svg>
  );
}

function UKFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="UK Flag" role="img">
      <rect width="36" height="24" fill="#012169" rx="2" ry="2" />
      <path d="M0,0 L36,24 M36,0 L0,24" stroke="#FFFFFF" strokeWidth="4" />
      <path d="M0,0 L36,24 M36,0 L0,24" stroke="#C8102E" strokeWidth="2" />
      <path d="M18,0 V24 M0,12 H36" stroke="#FFFFFF" strokeWidth="6" />
      <path d="M18,0 V24 M0,12 H36" stroke="#C8102E" strokeWidth="3" />
    </svg>
  );
}

function KoreaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="South Korea Flag" role="img">
      <rect width="36" height="24" fill="#FFFFFF" rx="2" ry="2" />
      <rect width="36" height="24" fill="none" stroke="#E5E7EB" strokeWidth="0.5" rx="2" ry="2" />
      <circle cx="18" cy="12" r="5.5" fill="#CD2E3A" />
      <path d="M18,6.5 A5.5,5.5 0 0,1 18,17.5 A2.75,2.75 0 0,1 18,12 A2.75,2.75 0 0,0 18,6.5" fill="#0047A0" />
      <line x1="8" y1="4" x2="10" y2="7" stroke="#000000" strokeWidth="0.8" />
      <line x1="26" y1="17" x2="28" y2="20" stroke="#000000" strokeWidth="0.8" />
      <line x1="26" y1="4" x2="28" y2="7" stroke="#000000" strokeWidth="0.8" />
      <line x1="8" y1="17" x2="10" y2="20" stroke="#000000" strokeWidth="0.8" />
    </svg>
  );
}

function UAEFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="UAE Flag" role="img">
      <rect width="36" height="8" fill="#00732F" rx="2" ry="2" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#000000" rx="2" ry="2" />
      <rect width="9" height="24" fill="#FF0000" />
    </svg>
  );
}

function AustraliaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Australia Flag" role="img">
      <rect width="36" height="24" fill="#00008B" rx="2" ry="2" />
      <rect width="18" height="12" fill="#00008B" />
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#FFFFFF" strokeWidth="2" />
      <path d="M0,0 L18,12 M18,0 L0,12" stroke="#C8102E" strokeWidth="1" />
      <path d="M9,0 V12 M0,6 H18" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M9,0 V12 M0,6 H18" stroke="#C8102E" strokeWidth="1.5" />
      <polygon points="26,17 26.5,18.5 28,18.5 26.8,19.4 27.2,21 26,20 24.8,21 25.2,19.4 24,18.5 25.5,18.5" fill="#FFFFFF" />
    </svg>
  );
}

function GermanyFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Germany Flag" role="img">
      <rect width="36" height="8" fill="#000000" rx="2" ry="2" />
      <rect y="8" width="36" height="8" fill="#DD0000" />
      <rect y="16" width="36" height="8" fill="#FFCC00" rx="2" ry="2" />
    </svg>
  );
}

function BrazilFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 24" className={className} aria-label="Brazil Flag" role="img">
      <rect width="36" height="24" fill="#009C3B" rx="2" ry="2" />
      <polygon points="18,2 34,12 18,22 2,12" fill="#FFDF00" />
      <circle cx="18" cy="12" r="5.5" fill="#002776" />
      <path d="M12.5,12.5 Q18,9 23.5,12.5" fill="none" stroke="#FFFFFF" strokeWidth="0.8" />
    </svg>
  );
}

const FLAG_COMPONENTS: Record<LocaleCode, React.FC<{ className?: string }>> = {
  IN: IndianFlag,
  SG: SingaporeFlag,
  HK: HongKongFlag,
  JP: JapanFlag,
  CN: ChinaFlag,
  US: USFlag,
  GB: UKFlag,
  KR: KoreaFlag,
  AE: UAEFlag,
  AU: AustraliaFlag,
  DE: GermanyFlag,
  BR: BrazilFlag,
};

interface BrandLogoProps {
  size?: "sm" | "default" | "lg";
  showFlag?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { flag: "w-6 h-4", text: "text-lg" },
  default: { flag: "w-8 h-5", text: "text-2xl" },
  lg: { flag: "w-10 h-7", text: "text-3xl" },
};

export function BrandLogo({ size = "default", showFlag = true, className }: BrandLogoProps) {
  const { config } = useLocale();
  const s = sizeMap[size];
  const FlagComponent = FLAG_COMPONENTS[config.code];

  return (
    <div className={cn("flex items-center gap-2 font-display font-bold text-primary", s.text, className)}>
      {showFlag && <FlagComponent className={s.flag} />}
      <span>{config.appName}</span>
    </div>
  );
}

export { IndianFlag, SingaporeFlag, HongKongFlag, JapanFlag, ChinaFlag, USFlag, UKFlag, KoreaFlag, UAEFlag, AustraliaFlag, GermanyFlag, BrazilFlag };
