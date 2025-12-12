import { NextRequest, NextResponse } from 'next/server';

const HERE_API_KEY = process.env.HERE_API_KEY;

// Country center coordinates for HERE API (lat,lng)
const COUNTRY_CENTERS: { [key: string]: { lat: number; lng: number } } = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Australia': { lat: -33.8688, lng: 151.2093 },
  'Germany': { lat: 52.5200, lng: 13.4050 },
  'France': { lat: 48.8566, lng: 2.3522 },
  'Italy': { lat: 41.9028, lng: 12.4964 },
  'Spain': { lat: 40.4168, lng: -3.7038 },
  'Netherlands': { lat: 52.3676, lng: 4.9041 },
  'Sweden': { lat: 59.3293, lng: 18.0686 },
  'Switzerland': { lat: 46.9480, lng: 7.4474 },
  'Austria': { lat: 48.2082, lng: 16.3738 },
  'Belgium': { lat: 50.8503, lng: 4.3517 },
  'Denmark': { lat: 55.6761, lng: 12.5683 },
  'Norway': { lat: 59.9139, lng: 10.7522 },
  'Ireland': { lat: 53.3498, lng: -6.2603 },
  'New Zealand': { lat: -36.8509, lng: 174.7645 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Japan': { lat: 35.6762, lng: 139.6503 },
  'China': { lat: 39.9042, lng: 116.4074 },
  'India': { lat: 28.6139, lng: 77.2090 },
  'Brazil': { lat: -23.5505, lng: -46.6333 },
  'Mexico': { lat: 19.4326, lng: -99.1332 },
  'South Africa': { lat: -33.9249, lng: 18.4241 },
};

async function getPlaceDetails(placeId: string) {
  try {
    const response = await fetch(
      `https://lookup.search.hereapi.com/v1/lookup?id=${placeId}&apiKey=${HERE_API_KEY}`
    );
    
    if (!response.ok) return {};
    
    const data = await response.json();
    return data || {};
  } catch (error) {
    console.error('Error fetching place details:', error);
    return {};
  }
}

export async function POST(request: NextRequest) {
  try {
    const { country, query } = await request.json();

    if (!HERE_API_KEY) {
      return NextResponse.json(
        { error: 'HERE API key not configured. Please add HERE_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    if (!query || !country) {
      return NextResponse.json(
        { error: 'Country and query are required' },
        { status: 400 }
      );
    }

    const center = COUNTRY_CENTERS[country] || COUNTRY_CENTERS['United States'];
    console.log('Searching for:', query, 'in', country);

    // Use HERE Discover API to search for businesses
    const params = new URLSearchParams({
      q: query,
      at: `${center.lat},${center.lng}`,
      limit: '50',
      apiKey: HERE_API_KEY,
    });

    const response = await fetch(
      `https://discover.search.hereapi.com/v1/discover?${params.toString()}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('HERE API error:', errorData);
      return NextResponse.json(
        { error: `HERE API error: ${errorData.error || 'Unknown error'}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const results = data.items || [];
    console.log('Found', results.length, 'results from HERE API');

    // Process each place
    const businessesWithDetails = results.map((place: any) => {
      // HERE API contacts structure: [{ phone: [{value: "..."}], www: [{value: "..."}] }]
      const contacts = place.contacts || [];
      const contactInfo = contacts[0] || {};
      
      // Check for website
      const wwwList = contactInfo.www || [];
      const hasWebsite = wwwList.length > 0 && wwwList[0]?.value;
      const website = wwwList[0]?.value || null;
      
      // Get phone
      const phoneList = contactInfo.phone || [];
      const phone = phoneList[0]?.value || null;

      return {
        id: place.id,
        name: place.title,
        address: place.address?.label || 'N/A',
        phone: phone,
        rating: null,
        reviews: null,
        type: place.categories?.[0]?.name || query,
        hasWebsite: !!hasWebsite,
        website: website,
        placeId: place.id,
      };
    });

    // Filter to only businesses without websites
    const businessesWithoutWebsites = businessesWithDetails.filter((b: any) => !b.hasWebsite);
    console.log('Total businesses:', businessesWithDetails.length);
    console.log('Businesses without websites:', businessesWithoutWebsites.length);

    // Return only businesses WITHOUT websites
    return NextResponse.json(businessesWithoutWebsites);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search businesses' },
      { status: 500 }
    );
  }
}