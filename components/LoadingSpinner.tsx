export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center min-h-96">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 border-t-cyan-400 rounded-full animate-spin"></div>
      </div>
      <p className="text-slate-300 text-lg font-semibold animate-pulse">Searching for businesses...</p>
    </div>
  );
}