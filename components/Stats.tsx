
'use client';

import { motion } from 'framer-motion';

interface StatsProps {
  stats: {
    total: number;
    noWebsite: number;
  };
}

export default function Stats({ stats }: StatsProps) {
  const percentage = stats.total > 0
    ? Math.round((stats.noWebsite / stats.total) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Total Found"
        value={stats.total}
        color="text-blue-400"
        delay={0}
      />
      <StatCard
        label="Without Website"
        value={stats.noWebsite}
        color="text-orange-400"
        delay={0.1}
      />
      <StatCard
        label="Opportunity Rate"
        value={`${percentage}%`}
        color="text-emerald-400"
        delay={0.2}
      />
    </div>
  );
}

function StatCard({ label, value, color, delay }: { label: string, value: string | number, color: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 text-center hover:bg-slate-800/50 transition-colors"
    >
      <div className={`text-4xl font-bold mb-2 ${color}`}>
        {value}
      </div>
      <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
        {label}
      </div>
    </motion.div>
  );
}