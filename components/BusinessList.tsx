interface Business {
  id: string;
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  reviews?: number;
  type: string;
}

interface BusinessListProps {
  businesses: Business[];
}

export default function BusinessList({ businesses }: BusinessListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {businesses.map((business) => (
        <div
          key={business.id}
          className="bg-slate-800/50 backdrop-blur-md rounded-lg border border-slate-700 p-6 hover:border-blue-500/50 hover:shadow-xl transition duration-200 hover:shadow-blue-500/10"
        >
          <h3 className="text-lg font-bold text-slate-100 mb-3">{business.name}</h3>
          
          <div className="space-y-2 text-sm text-slate-400 mb-4">
            <p className="flex items-start gap-2">
              <span>📍</span>
              <span>{business.address}</span>
            </p>
            {business.phone && (
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>{business.phone}</span>
              </p>
            )}
            {business.rating && (
              <p className="flex items-center gap-2">
                <span>⭐</span>
                <span>{business.rating} ({business.reviews} reviews)</span>
              </p>
            )}
          </div>

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