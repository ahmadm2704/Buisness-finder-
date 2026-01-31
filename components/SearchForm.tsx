
'use client';

import { useState, useMemo } from 'react';
import { COUNTRY_CENTERS } from '@/app/api/search-businesses/locations';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFormProps {
  onSearch: (country: string, query: string) => void;
}

const COMMON_BUSINESS_TYPES = [
  'Restaurant', 'Cafe', 'Hotel', 'Plumber', 'Dentist', 'Gym', 'Bar', 'Salon',
  'Real Estate', 'Lawyer', 'Accountant', 'Mechanic', 'Cleaner', 'Consultant',
  'Doctor', 'Bakery', 'Photographer', 'Architect', 'Florist', 'Tattoo Shop'
];

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [country, setCountry] = useState('');
  const [query, setQuery] = useState('');
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showBusinessSuggestions, setShowBusinessSuggestions] = useState(false);

  // Extract country list from the shared location data
  const countryList = useMemo(() => Object.keys(COUNTRY_CENTERS).sort(), []);

  const countrySuggestions = useMemo(() => {
    // If empty input, show ALL countries
    if (!country.trim()) return countryList;

    // Otherwise filter
    const lower = country.toLowerCase();
    return countryList.filter(c => c.toLowerCase().includes(lower));
  }, [country, countryList]);

  const businessSuggestions = useMemo(() => {
    if (!query.trim()) return COMMON_BUSINESS_TYPES;
    const lower = query.toLowerCase();
    return COMMON_BUSINESS_TYPES.filter(b => b.toLowerCase().includes(lower));
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!country.trim()) return;
    onSearch(country, query);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="glass p-8 rounded-3xl shadow-2xl max-w-4xl mx-auto mb-12 relative overflow-visible z-50"
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-500/5 blur-[100px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">

        {/* Country Input */}
        <div className="relative group z-50">
          <label className="block text-xs font-medium text-cyan-400 mb-2 uppercase tracking-wider">Target Country</label>
          <input
            type="text"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setShowCountrySuggestions(true);
              setShowBusinessSuggestions(false);
            }}
            onFocus={() => {
              setShowCountrySuggestions(true);
              setShowBusinessSuggestions(false);
            }}
            onBlur={() => setTimeout(() => setShowCountrySuggestions(false), 200)}
            placeholder="e.g. United States"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-lg"
          />

          <AnimatePresence>
            {showCountrySuggestions && countrySuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700"
              >
                {countrySuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setCountry(s);
                      setShowCountrySuggestions(false);
                    }}
                    className="w-full text-left px-5 py-3 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 transition-colors border-b border-slate-800 last:border-0"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Query Input */}
        <div className="relative group z-40">
          <label className="block text-xs font-medium text-blue-400 mb-2 uppercase tracking-wider">Business Type</label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowBusinessSuggestions(true);
              setShowCountrySuggestions(false);
            }}
            onFocus={() => {
              setShowBusinessSuggestions(true);
              setShowCountrySuggestions(false);
            }}
            onBlur={() => setTimeout(() => setShowBusinessSuggestions(false), 200)}
            placeholder="e.g. Restaurant, Dentist..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-lg"
          />

          <AnimatePresence>
            {showBusinessSuggestions && businessSuggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700"
              >
                {businessSuggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      setQuery(s);
                      setShowBusinessSuggestions(false);
                    }}
                    className="w-full text-left px-5 py-3 text-slate-300 hover:bg-blue-500/10 hover:text-blue-400 transition-colors border-b border-slate-800 last:border-0"
                  >
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Button */}
      <div className="mt-8 relative z-30">
        <button
          type="submit"
          disabled={!country}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all hover:shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-xl">🚀</span>
            <span>Launch Scanner</span>
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </motion.form>
  );
}