'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import BusinessList from '@/components/BusinessList';
import LoadingSpinner from '@/components/LoadingSpinner';
import Stats from '@/components/Stats';

interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  rating?: number;
  reviews?: number;
  type: string;
  hasWebsite: boolean;
  website?: string;
  placeId: string;
}

export default function Home() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0, noWebsite: 0 });

  const handleSearch = async (country: string, query: string) => {
    setLoading(true);
    setError('');
    setSelectedCountry(country);
    setSearchQuery(query);

    try {
      const response = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, query }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch businesses');
      }

      const data = await response.json();
      const businessesWithoutWebsite = data.filter((b: Business) => !b.hasWebsite);
      
      setBusinesses(businessesWithoutWebsite);
      setStats({
        total: data.length,
        noWebsite: businessesWithoutWebsite.length,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-4">
            🏢 Business Finder
          </h1>
          <p className="text-xl text-slate-300">
            Discover local businesses worldwide without websites
          </p>
        </div>

        <SearchForm onSearch={handleSearch} />

        {error && (
          <div className="mt-8 p-6 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            <h3 className="font-bold mb-2">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!loading && businesses.length > 0 && (
          <div className="mt-12">
            <Stats stats={stats} />
            <BusinessList businesses={businesses} />
          </div>
        )}

        {!loading && businesses.length === 0 && selectedCountry && !error && (
          <div className="mt-8 p-8 bg-blue-500/10 border border-blue-500 rounded-lg text-center">
            <p className="text-slate-300 text-lg">
              {searchQuery
                ? 'No businesses found. Try a different search or location.'
                : 'Start searching for businesses without websites'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}