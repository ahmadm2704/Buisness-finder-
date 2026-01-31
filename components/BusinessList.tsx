
'use client';

import { motion } from 'framer-motion';
import { Business } from '@/app/types';

interface BusinessListProps {
  businesses: Business[];
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1 }
};

export default function BusinessList({ businesses }: BusinessListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {businesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </motion.div>
  );
}

function BusinessCard({ business }: { business: Business }) {
  const hasContact = business.phone || business.email || business.facebook || business.instagram;

  return (
    <motion.div
      variants={item}
      className="glass glass-hover rounded-2xl p-6 relative group"
    >
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
          No Website
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-100 mb-1 pr-20 truncate" title={business.name}>
        {business.name}
      </h3>
      <p className="text-sm text-cyan-400 font-medium mb-4 flex items-center gap-1.5">
        <span>🏷️</span> {business.type}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-2 text-slate-400 text-sm">
          <span className="mt-0.5">📍</span>
          <span className="line-clamp-2">{business.address}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-700/50 space-y-2">
        {business.phone ? (
          <a href={`tel:${business.phone}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors">
            <span className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">📞</span>
            {business.phone}
          </a>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">📞</span>
            Not available
          </div>
        )}

        {business.email ? (
          <a href={`mailto:${business.email}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-cyan-400 transition-colors">
            <span className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">✉️</span>
            <span className="truncate">{business.email}</span>
          </a>
        ) : (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-slate-600">✉️</span>
            Not available
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-2">
        <SocialLink
          href={`https://www.google.com/search?q=${encodeURIComponent(business.name + ' ' + business.address)}`}
          icon="G"
          label="Google"
          color="hover:bg-blue-600 hover:text-white"
        />
        {business.facebook && (
          <SocialLink
            href={business.facebook}
            icon="F"
            label="Facebook"
            color="hover:bg-blue-700 hover:text-white"
          />
        )}
        {business.instagram && (
          <SocialLink
            href={business.instagram}
            icon="I"
            label="Instagram"
            color="hover:bg-pink-600 hover:text-white"
          />
        )}
      </div>
    </motion.div>
  );
}

function SocialLink({ href, icon, label, color }: { href: string | undefined, icon: string, label: string, color: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-800 text-slate-400 text-xs font-semibold transition-all duration-300 ${color}`}
      title={label}
    >
      {label}
    </a>
  );
}