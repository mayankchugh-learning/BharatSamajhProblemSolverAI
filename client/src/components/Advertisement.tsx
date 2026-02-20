import { ExternalLink } from "lucide-react";

export function Advertisement() {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl">
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl group-hover:bg-purple-500/40 transition-all duration-500" />
      
      <div className="relative z-10">
        <span className="inline-block px-2 py-1 rounded bg-white/20 text-[10px] font-bold tracking-wider mb-3">
          SPONSORED
        </span>
        <h3 className="text-lg font-bold mb-2">Master Full-Stack Development</h3>
        <p className="text-blue-100 text-sm mb-4 max-w-[80%]">
          Learn to build scalable apps like this one with our comprehensive course.
        </p>
        <button className="flex items-center text-xs font-bold uppercase tracking-widest hover:text-blue-200 transition-colors">
          Learn More <ExternalLink className="w-3 h-3 ml-1" />
        </button>
      </div>
    </div>
  );
}
