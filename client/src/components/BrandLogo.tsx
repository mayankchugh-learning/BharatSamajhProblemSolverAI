import { cn } from "@/lib/utils";

function IndianFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 24"
      className={className}
      aria-label="Indian Flag"
      role="img"
    >
      <rect width="36" height="8" fill="#FF9933" rx="2" ry="2" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#138808" rx="2" ry="2" />
      <circle cx="18" cy="12" r="3.2" fill="none" stroke="#000080" strokeWidth="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={18 + 1.4 * Math.cos(angle)}
            y1={12 + 1.4 * Math.sin(angle)}
            x2={18 + 3 * Math.cos(angle)}
            y2={12 + 3 * Math.sin(angle)}
            stroke="#000080"
            strokeWidth="0.3"
          />
        );
      })}
      <circle cx="18" cy="12" r="0.8" fill="#000080" />
    </svg>
  );
}

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
  const s = sizeMap[size];
  return (
    <div className={cn("flex items-center gap-2 font-display font-bold text-primary", s.text, className)}>
      {showFlag && <IndianFlag className={s.flag} />}
      <span>BharatSolve AI</span>
    </div>
  );
}

export { IndianFlag };
