
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import SearchForm from '@/components/SearchForm';
import BusinessList from '@/components/BusinessList';
import LoadingSpinner from '@/components/LoadingSpinner';
import Stats from '@/components/Stats';
import { Business } from './types';

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [stats, setStats] = useState({ total: 0, noWebsite: 0 });

  const handleSearch = async (country: string, query: string) => {
    setLoading(true);
    setError('');
    setHasSearched(true);
    setBusinesses([]);

    try {
      const response = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, query }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch businesses');
      }

      // The API already filters for businesses without websites, but let's trust the data
      // For the stats, we might want to know total vs filtered if the API returned that metadata.
      // Currently the API returns ONLY results without websites. 
      // To mimic "Total Found" vs "No Website", we might need to adjust the API to return both or just show "Found".
      // For now, let's assume the listed ones are the ones we want.

      setBusinesses(data);
      setStats({
        total: data.length, // In this context, total found matching criteria
        noWebsite: data.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-12 md:py-20 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16"
      >
        <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold mb-6 border border-cyan-500/20">
          Global Lead Generation Tool
        </span>
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
          Find Businesses <br className="hidden md:block" />
          <span className="text-gradient">Missing a Website</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Instantly discover local businesses worldwide that need your web design services.
          Real-time scanning powered by advanced geolocation data.
        </p>
      </motion.div>

      {/* Search Section */}
      <SearchForm onSearch={handleSearch} />

      {/* Error Message */}
      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-200 text-center max-w-2xl mx-auto backdrop-blur-md shadow-lg"
        >
          <div className="text-3xl mb-2">⚠️</div>
          <p className="font-bold text-lg text-white mb-2">Scan Failed</p>
          <p className="opacity-90 font-mono text-sm bg-black/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap text-left mx-auto max-w-lg">
            {error}
          </p>
          <p className="mt-4 text-sm text-red-300">
            Common fix: Check if <b>"Places API (New)"</b> is enabled in Google Cloud Console.
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Results Section */}
      {!loading && hasSearched && !error && (
        <div className="mt-12">
          {businesses.length > 0 ? (
            <>
              <Stats stats={stats} />
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">
                  Scan Results <span className="text-slate-500 text-lg font-normal ml-2">({businesses.length})</span>
                </h2>
              </div>
              <BusinessList businesses={businesses} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800"
            >
              <div className="text-6xl mb-4">🏜️</div>
              <h3 className="text-2xl font-bold text-slate-300 mb-2">No businesses found</h3>
              <p className="text-slate-500">
                Try a different search term or location to find more leads.
              </p>
            </motion.div>
          )}
        </div>
      )}
    </main>
  );
}