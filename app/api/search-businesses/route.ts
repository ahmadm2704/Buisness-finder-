
import { NextRequest, NextResponse } from 'next/server';
import { getCities, City } from './locations';
import { SearchRequestSchema } from './schema';

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ----------------------------------------------------------------------
// TYPES (Frontend expects)
// ----------------------------------------------------------------------

interface BusinessResult {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  instagram: string | null;
  type: string;
  hasWebsite: boolean;
  placeId: string;
  googleMapsLink: string | null;
}

const TARGET_COUNT = 50;

// ----------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * DOUBLE CHECK: Ask Google if this business has a website.
 * Geoapify is the "Scanner" (finds hidden stuff).
 * Google is the "Validator" (knows if a website exists).
 */
async function verifyWithGoogle(name: string, city: string): Promise<boolean> {
  if (!GOOGLE_API_KEY) return false; // Can't verify, assume safe? No, safer to return false.

  try {
    const query = `${name} in ${city}`;
    // 1. Text Search to find the ID
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      // Google doesn't even know it. Probably safe (very small business), or name mismatch.
      // If Google doesn't know it, it definitely doesn't have a high-ranking website.
      return false;
    }

    const placeId = searchData.results[0].place_id;

    // 2. Details Search to check website field specifically
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=website&key=${GOOGLE_API_KEY}`;
    const detailsRes = await fetch(detailsUrl);
    const detailsData = await detailsRes.json();

    if (detailsData.result && detailsData.result.website) {
      console.log(`[Google Verify] DETECTED WEBSITE for ${name}: ${detailsData.result.website}`);
      return true; // IT HAS A WEBSITE!
    }

    return false; // No website found by Google

  } catch (error) {
    console.error("Google Verification failed", error);
    return false; // Fail open (keep it) if API errors
  }
}

function getCategoriesForQuery(query: string): { categories: string; isGeneric: boolean } {
  const q = query.toLowerCase();

  // Food & Drink (Specific)
  if (q.includes('restaurant') || q.includes('cafe') || q.includes('bar') || q.includes('pub') || q.includes('bakery') || q.includes('food')) {
    return { categories: 'catering', isGeneric: false };
  }

  // Health & Beauty (Verified: commercial.health_and_beauty is valid)
  if (q.includes('salon') || q.includes('barber') || q.includes('hair') || q.includes('beauty') || q.includes('spa') || q.includes('tattoo')) {
    return { categories: 'commercial.health_and_beauty,service.beauty', isGeneric: false };
  }

  // Health (Verified: healthcare is valid)
  if (q.includes('dentist') || q.includes('doctor') || q.includes('pharmacy') || q.includes('hospital') || q.includes('clinic')) {
    return { categories: 'healthcare', isGeneric: false };
  }

  // Trades / Services (Verified: 'service' is valid parent, 'commercial.services' was invalid)
  if (q.includes('plumber') || q.includes('mechanic') || q.includes('electrician') || q.includes('cleaner') || q.includes('laundry')) {
    return { categories: 'service', isGeneric: false };
  }

  // Professional / Office (Verified: 'office' is valid parent)
  if (q.includes('lawyer') || q.includes('accountant') || q.includes('estate') || q.includes('bank') || q.includes('consultant') || q.includes('insurance')) {
    return { categories: 'office,service.financial', isGeneric: false };
  }

  // Accommodation
  if (q.includes('hotel') || q.includes('motel') || q.includes('hostel')) {
    return { categories: 'accommodation', isGeneric: false };
  }

  // Shopping / Retail
  if (q.includes('store') || q.includes('shop') || q.includes('market') || q.includes('florist')) {
    return { categories: 'commercial', isGeneric: false };
  }

  // Activity / Sport
  if (q.includes('gym') || q.includes('fitness') || q.includes('sports') || q.includes('yoga')) {
    return { categories: 'sport,activity', isGeneric: false };
  }

  // DEFAULT: Wide net, but exclude catering to avoid "Pub Bias"
  return { categories: 'commercial,office,service', isGeneric: true };
}

/**
 * Search via Geoapify Places API
 * Docs: https://apidocs.geoapify.com/docs/places/
 */
async function searchGeoapify(
  query: string,
  city: { name: string; lat: number; lng: number }
): Promise<BusinessResult[]> {
  if (!GEOAPIFY_API_KEY) return [];

  // Radius in meters (e.g., 6km)
  const RADIUS = 6000;

  const { categories, isGeneric } = getCategoriesForQuery(query);

  const limit = 60;
  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${city.lng},${city.lat},${RADIUS}&limit=${limit}&apiKey=${GEOAPIFY_API_KEY}`;

  console.log(`[DEBUG] Geoapify Search: "${query}" -> [${categories}] in ${city.name}`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.text();
      console.error('[Geoapify Error]', err);
      return [];
    }

    const data = await res.json();
    const features = data.features || [];

    const mappedResults: BusinessResult[] = [];

    for (const f of features) {
      const props = f.properties;
      const businessName = props.name || "";

      if (!businessName) continue;

      // 1. FILTER: Validate Relevance (Name check if generic)
      if (isGeneric || categories.includes('commercial')) {
        if (query.length > 3 && !businessName.toLowerCase().includes(query.toLowerCase())) {
          if (query.toLowerCase() !== 'other') {
            continue;
          }
        }
      }

      // 2. FILTER: NO WEBSITE (Geoapify Check)
      if (props.website || (props.contact && props.contact.website) || props.url) {
        continue;
      }

      // 3. FILTER: EXCLUDE FINANCIAL if irrelevant
      const catStr = (props.category || "") + (Array.isArray(props.categories) ? props.categories.join(",") : "");
      if (!query.toLowerCase().includes('bank') &&
        !query.toLowerCase().includes('financial') &&
        (catStr.includes('service.financial') || catStr.includes('office.financial'))) {
        continue;
      }

      // 4. FILTER: GOOGLE DOUBLE-CHECK (Sync wait to ensure quality)
      const hasWebsiteOnGoogle = await verifyWithGoogle(businessName, city.name);
      if (hasWebsiteOnGoogle) {
        console.log(`[FILTERED] ${businessName} - Google found a website.`);
        continue;
      }

      const gMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${businessName} ${props.address_line2 || props.city || ''}`)}`;

      mappedResults.push({
        id: props.place_id || Math.random().toString(),
        name: businessName,
        address: props.formatted || `${props.address_line1}, ${props.address_line2}`,
        phone: props.formatted_phone_number || props.phone || null,
        email: props.email || null,
        facebook: props.datasource?.raw?.facebook || null,
        instagram: props.datasource?.raw?.instagram || null,
        type: query,
        hasWebsite: false,
        placeId: props.place_id,
        googleMapsLink: gMapsLink
      });

      console.log(`[FOUND] ${businessName} in ${city.name} (Verified)`);
    }

    return mappedResults;

  } catch (err) {
    console.error(err);
    return [];
  }
}

function shuffleCities(array: City[]): City[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

// ----------------------------------------------------------------------
// MAIN API LOGIC
// ----------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    if (!GEOAPIFY_API_KEY || !GOOGLE_API_KEY) {
      return NextResponse.json({ error: 'Server configuration error: valid API KEYS missing.' }, { status: 500 });
    }

    const body = await request.json();
    const result = SearchRequestSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { country, query } = result.data;
    const allCities = getCities(country);

    if (allCities.length === 0) return NextResponse.json({ error: 'Country not found' }, { status: 404 });

    const randomizedCities = shuffleCities([...allCities]);

    const finalResults: BusinessResult[] = [];
    let citiesScanned = 0;

    const MAX_EXECUTION_TIME_MS = 55000;
    const startTime = Date.now();

    console.log(`[DEBUG] STARTING HYBRID SCAN. Goal: ${TARGET_COUNT}. Query: ${query}`);

    while (finalResults.length < TARGET_COUNT && citiesScanned < randomizedCities.length) {

      if (Date.now() - startTime > MAX_EXECUTION_TIME_MS) {
        console.log('[DEBUG] TIMEOUT. Returning results.');
        break;
      }

      const currentCity = randomizedCities[citiesScanned];
      citiesScanned++;

      // Search & Verify happens inside searchGeoapify now
      const results = await searchGeoapify(query, currentCity);

      for (const res of results) {
        if (finalResults.length < TARGET_COUNT) {
          if (!finalResults.find(r => r.name === res.name && r.address === res.address)) {
            finalResults.push(res);
          }
        }
      }
    }

    return NextResponse.json(finalResults);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}