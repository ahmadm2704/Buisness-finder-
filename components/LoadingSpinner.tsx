
'use client';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-500 border-r-blue-500 animate-spin-slow"></div>

        {/* Inner Ring */}
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan-300 border-l-blue-400 animate-spin-reverse opacity-70"></div>

        {/* Center Pulse */}
        <div className="absolute inset-8 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full animate-pulse shadow-[0_0_20px_rgba(56,189,248,0.5)]"></div>
      </div>
      <p className="mt-8 text-slate-400 font-medium tracking-wider animate-pulse uppercase text-sm">
        Scanning Area...
      </p>
    </div>
  );
}