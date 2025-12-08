interface StatsProps {
  stats: {
    total: number;
    noWebsite: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  const percentage = stats.total ? Math.round((stats.noWebsite / stats.total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 p-6 rounded-lg backdrop-blur-md">
        <p className="text-slate-300">Total Businesses</p>
        <p className="text-4xl font-bold text-blue-400 mt-2">{stats.total}</p>
      </div>
      <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 p-6 rounded-lg backdrop-blur-md">
        <p className="text-slate-300">Without Website</p>
        <p className="text-4xl font-bold text-orange-400 mt-2">{stats.noWebsite}</p>
      </div>
      <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 p-6 rounded-lg backdrop-blur-md">
        <p className="text-slate-300">Opportunity Rate</p>
        <p className="text-4xl font-bold text-green-400 mt-2">{percentage}%</p>
      </div>
    </div>
  );
}