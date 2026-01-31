
import { NextRequest, NextResponse } from 'next/server';
import { getCities } from './locations';
import { SearchRequestSchema } from './schema';

const HERE_API_KEY = process.env.HERE_API_KEY;

// Type definition from HERE API response (partial)
interface HerePlace {
  id: string;
  title: string;
  address?: { label: string };
  contacts?: Array<{
    phone?: Array<{ value: string }>;
    mobile?: Array<{ value: string }>;
    email?: Array<{ value: string }>;
    www?: Array<{ value: string }>;
  }>;
  categories?: Array<{ name: string }>;
}

// ----------------------------------------------------------------------
// 1. CONSTANTS & CONFIG
// ----------------------------------------------------------------------

// Aggregators and Platforms that are NOT the business's own website
const BLACKLISTED_DOMAINS = [
  'facebook.com', 'instagram.com', 'twitter.com', 'linkedin.com', 'youtube.com',
  'tiktok.com', 'pinterest.com', 'yelp.com', 'tripadvisor.com', 'yellowpages.com',
  'ubereats.com', 'doordash.com', 'grubhub.com', 'postmates.com', 'seamless.com',
  'mapquest.com', 'local.com', 'whitepages.com', 'foursquare.com', 'zomato.com',
  'opentable.com', 'resy.com', 'wikipedia.org', 'google.com', 'yahoo.com',
  'bing.com', 'manta.com', 'bbb.org', 'chamberofcommerce.com', 'restaurantji.com',
  'restaurantguru.com', 'sluurpy.com', 'menupix.com', 'sirved.com', 'allmenus.com'
];

// Limit verified results to ensure performance (Scraping is slow/heavy)
const TARGET_VERIFIED_COUNT = 15;
const MAX_CANDIDATES_TO_CHECK = 40; // Don't check more than this to prevent timeouts

// ----------------------------------------------------------------------
// 2. HELPER FUNCTIONS
// ----------------------------------------------------------------------

/**
 * Checks if a URL domain is one of the blacklisted aggregators
 */
function isBlacklisted(url: string): boolean {
  try {
    const domain = new URL(url).hostname.replace('www.', '').toLowerCase();
    return BLACKLISTED_DOMAINS.some(d => domain.includes(d));
  } catch (e) {
    return false;
  }
}

/**
 * Heuristic: active verification via DuckDuckGo HTML search
 * Returns TRUE if a likely official website is found.
 */
async function activeVerifyHasWebsite(businessName: string, addressLabel: string): Promise<boolean> {
  try {
    // Construct a specific query
    // e.g., "Joey Roses New York website"
    const locationPart = addressLabel.split(',')[1]?.trim() || ''; // Extract city/area roughly
    const query = `${businessName} ${locationPart} website`;

    // Fetch DDG HTML (Lightweight, fewer blocks than Google)
    const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      // signal: AbortSignal.timeout(3000) // 3s timeout per check
    });

    if (!response.ok) return false; // If blocked/error, assume safe (allow user to verify) 

    const html = await response.text();

    // Parse links from results
    // DDG HTML results are usually in <a class="result__a" href="...">
    const linkRegex = /class="result__a" href="([^"]+)"/g;
    let match;

    // Check top 3 results only
    let checkedCount = 0;

    while ((match = linkRegex.exec(html)) !== null && checkedCount < 3) {
      checkedCount++;
      const url = match[1];

      // Decode the URL (DDG wraps it sometimes, but HTML version usually direct)
      // Actually DDG HTML format: href="/l/?kh=-1&udd=..." -> these are redirects.
      // Wait, linkRegex might capture the redirect URL.
      // Standard DDG HTML links are usually absolute or redirect.
      // If it's a redirect, we might verify query params 'udd' contains target?
      // Let's look for "result__url" text which displays the domain visually.
      // <a class="result__url" href="..."> example.com </a>

      // Alternative: Regex for ANY http link in the snippet text
      // Easier: Check the 'result__url' class content if possible, or just parse the redirect param 'udd'.

      // Simplification: Let's regex for likely domain matches in the raw HTML that are NOT in blacklist.
      // If we see "joeyroses.com" in the HTML near "Joey Roses", it's a website.

      // Better strategy:
      // Search for the Business Name (sanitized) in domains present in the HTML.
      const sanitizedName = businessName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (sanitizedName.length < 4) continue; // Too short to match reliably

      // Look for any domain string like "joeyroses.com"
      // Regex: [a-z0-9-]+\.com (or .net, .org, .io, .co)
      // We look for the Business Name inside a domain in the HTML.
      const domainRegex = new RegExp(`([a-z0-9-]*${sanitizedName}[a-z0-9-]*\\.(com|net|org|io|co|nyc|us))`, 'gi');
      const domainMatch = domainRegex.exec(html);

      if (domainMatch) {
        const foundDomain = domainMatch[1].toLowerCase();
        if (!isBlacklisted(`https://${foundDomain}`)) {
          // Found a domain that contains the business name and isn't blacklisted (like yelp)
          // console.log(`[Verify] Found likely site for ${businessName}: ${foundDomain}`);
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    // console.error(`Verify error for ${businessName}`, error);
    return false;
  }
}

// ----------------------------------------------------------------------
// 3. MAIN API HANDLER
// ----------------------------------------------------------------------

async function searchBusinessesInCity(
  city: { name: string; lat: number; lng: number },
  query: string,
): Promise<HerePlace[]> {
  if (!HERE_API_KEY) return [];

  const params = new URLSearchParams({
    q: query,
    at: `${city.lat},${city.lng}`,
    limit: '50', // Fetch decent pool
    apiKey: HERE_API_KEY,
  });

  try {
    const response = await fetch(
      `https://discover.search.hereapi.com/v1/discover?${params.toString()}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!HERE_API_KEY) return NextResponse.json({ error: 'System error' }, { status: 500 });

    const body = await request.json();
    const result = SearchRequestSchema.safeParse(body);
    if (!result.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { country, query } = result.data;
    const cities = getCities(country);
    if (cities.length === 0) return NextResponse.json({ error: 'Country not found' }, { status: 404 });

    // 1. Initial Fetch
    // We only take the first chunk of cities to prevent slow response times now that we verify
    const SEARCH_LIMIT = 5; // Search first 5 cities max for candidates
    const activeCities = cities.slice(0, SEARCH_LIMIT);

    // console.log(`Searching in ${activeCities.length} cities...`);
    const promises = activeCities.map(c => searchBusinessesInCity(c, query));
    const resultsArrays = await Promise.all(promises);

    const candidates: HerePlace[] = [];
    const seen = new Set<string>();

    resultsArrays.flat().forEach(place => {
      if (!seen.has(place.id)) {
        seen.add(place.id);
        candidates.push(place);
      }
    });

    // 2. Initial Filter (Fast) - Filter out obvious ones
    const initialPool = candidates.filter(place => {
      const contactsList = place.contacts || [];
      let hasWeb = false;

      // Basic check
      for (const contact of contactsList) {
        if (contact.www) {
          // Check if any www link is NOT blacklisted
          for (const link of contact.www) {
            if (link.value && !isBlacklisted(link.value)) {
              hasWeb = true;
              break;
            }
          }
        }
        if (contact.email) {
          // Check domain
          for (const email of contact.email) {
            const domain = email.value.split('@')[1];
            if (domain && !['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'].some(d => domain.includes(d))) {
              hasWeb = true; // Likely has website
            }
          }
        }
      }
      return !hasWeb;
    });

    // 3. Active Verification (Slow/Premium)
    // console.log(`Verifying ${initialPool.length} candidates...`);
    const verifiedResults: any[] = [];

    // Verify until we have TARGET_VERIFIED_COUNT
    for (const place of initialPool) {
      if (verifiedResults.length >= TARGET_VERIFIED_COUNT) break;

      // Active Search Check
      const hasHiddenWebsite = await activeVerifyHasWebsite(place.title, place.address?.label || '');

      if (!hasHiddenWebsite) {
        // Prepare final object
        const contacts = place.contacts?.[0] || {};
        const phone = contacts.phone?.[0]?.value || contacts.mobile?.[0]?.value || null;
        const email = contacts.email?.[0]?.value || null;

        // Extract FB/Insta if present
        let facebook = null;
        let instagram = null;
        (contacts.www || []).forEach((l: any) => {
          if (l.value?.includes('facebook')) facebook = l.value;
          if (l.value?.includes('instagram')) instagram = l.value;
        });

        verifiedResults.push({
          id: place.id,
          name: place.title,
          address: place.address?.label || 'N/A',
          phone,
          email,
          facebook,
          instagram,
          type: place.categories?.[0]?.name || query,
          hasWebsite: false,
          placeId: place.id,
        });
      }
    }

    return NextResponse.json(verifiedResults);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}