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
}

interface BusinessListProps {
  businesses: Business[];
}

export default function BusinessList({ businesses }: BusinessListProps) {
  const hasContactInfo = (business: Business) => {
    return business.phone || business.email || business.facebook || business.instagram;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-xl transition duration-200 hover:shadow-blue-500/10"
        >
          <h3 className="text-lg font-bold text-slate-100 mb-3">{business.name}</h3>
          
          {/* Address & Type */}
          <div className="space-y-2 text-sm text-slate-400 mb-4">
            <p className="flex items-start gap-2">
              <span>📍</span>
              <span>{business.address}</span>
            </p>
            {business.type && (
              <p className="flex items-center gap-2">
                <span>🏷️</span>
                <span className="text-slate-500">{business.type}</span>
              </p>
            )}
          </div>

          {/* Contact Section */}
          {hasContactInfo(business) && (
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
              <h4 className="text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wide">Contact Info</h4>
              <div className="space-y-2 text-sm">
                {business.phone && (
                  <a 
                    href={`tel:${business.phone}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-green-400 transition"
                  >
                    <span>📞</span>
                    <span>{business.phone}</span>
                  </a>
                )}
                {business.email && (
                  <a 
                    href={`mailto:${business.email}`}
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition"
                  >
                    <span>✉️</span>
                    <span className="truncate">{business.email}</span>
                  </a>
                )}
                {business.facebook && (
                  <a 
                    href={business.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-blue-500 transition"
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </a>
                )}
                {business.instagram && (
                  <a 
                    href={business.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition"
                  >
                    <span>📷</span>
                    <span>Instagram</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* No Contact Available */}
          {!hasContactInfo(business) && (
            <div className="mb-4 p-3 bg-slate-700/20 rounded-lg">
              <p className="text-xs text-slate-500 italic">No contact info available</p>
            </div>
          )}

          {/* Find on Social Media */}
          <div className="mb-4 flex flex-wrap gap-2">
            <a
              href={`https://www.facebook.com/search/pages?q=${encodeURIComponent(business.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-medium hover:bg-blue-600/30 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Find on Facebook
            </a>
            <a
              href={`https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(business.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600/20 text-pink-400 border border-pink-500/30 rounded-lg text-xs font-medium hover:bg-pink-600/30 transition"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Find on Instagram
            </a>
          </div>

          {/* Badge */}
          <div className="pt-4 border-t border-slate-700">
            <span className="inline-block bg-orange-500/20 text-orange-300 border border-orange-500/50 px-3 py-1 rounded-full text-xs font-semibold">
              💡 No Website
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}