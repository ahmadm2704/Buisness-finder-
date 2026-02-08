
export interface City {
  name: string;
  lat: number;
  lng: number;
}

// STRATEGY CHANGE: Targeting Tier 2, Tier 3, and Suburbs for higher "No Website" probability.
export const COUNTRY_CITIES: Record<string, City[]> = {
  'United States': [
    // --- HIGH OPPORTUNITY RURAL/SUBURBAN HUBS ---
    { name: 'Lubbock, TX', lat: 33.5779, lng: -101.8552 },
    { name: 'Amarillo, TX', lat: 35.2220, lng: -101.8313 },
    { name: 'Laredo, TX', lat: 27.5306, lng: -99.4803 },
    { name: 'Brownsville, TX', lat: 25.9017, lng: -97.4975 },
    { name: 'Pflugerville, TX', lat: 30.4548, lng: -97.6223 },
    { name: 'Waco, TX', lat: 31.5493, lng: -97.1467 },
    { name: 'Killeen, TX', lat: 31.1171, lng: -97.7278 },
    { name: 'Midland, TX', lat: 31.9973, lng: -102.0779 },
    { name: 'Odessa, TX', lat: 31.8457, lng: -102.3676 },
    { name: 'Tyler, TX', lat: 32.3513, lng: -95.3011 },

    { name: 'Macon, GA', lat: 32.8407, lng: -83.6324 },
    { name: 'Augusta, GA', lat: 33.4735, lng: -82.0105 },
    { name: 'Columbus, GA', lat: 32.4610, lng: -84.9877 },
    { name: 'Savannah, GA', lat: 32.0809, lng: -81.0912 },

    { name: 'Springfield, MO', lat: 37.2089, lng: -93.2923 },
    { name: 'Columbia, MO', lat: 38.9517, lng: -92.3341 },
    { name: 'Joplin, MO', lat: 37.0842, lng: -94.5133 },

    { name: 'Little Rock, AR', lat: 34.7465, lng: -92.2896 },
    { name: 'Fort Smith, AR', lat: 35.3859, lng: -94.3986 },
    { name: 'Fayetteville, AR', lat: 36.0626, lng: -94.1574 },

    { name: 'Shreveport, LA', lat: 32.5252, lng: -93.7502 },
    { name: 'Lafayette, LA', lat: 30.2241, lng: -92.0198 },
    { name: 'Lake Charles, LA', lat: 30.2266, lng: -93.2174 },

    { name: 'Huntsville, AL', lat: 34.7304, lng: -86.5861 },
    { name: 'Mobile, AL', lat: 30.6954, lng: -88.0399 },
    { name: 'Montgomery, AL', lat: 32.3668, lng: -86.3000 },

    { name: 'Knoxville, TN', lat: 35.9606, lng: -83.9207 },
    { name: 'Chattanooga, TN', lat: 35.0456, lng: -85.3097 },
    { name: 'Clarksville, TN', lat: 36.5298, lng: -87.3595 },

    { name: 'Wichita, KS', lat: 37.6872, lng: -97.3301 },
    { name: 'Topeka, KS', lat: 39.0473, lng: -95.6752 },

    { name: 'Des Moines, IA', lat: 41.5868, lng: -93.6250 },
    { name: 'Cedar Rapids, IA', lat: 41.9779, lng: -91.6656 },

    { name: 'Tulsa, OK', lat: 36.1540, lng: -95.9928 },
    { name: 'Norman, OK', lat: 35.2226, lng: -97.4395 },
    { name: 'Broken Arrow, OK', lat: 36.0526, lng: -95.7908 },

    { name: 'Spokane, WA', lat: 47.6588, lng: -117.4260 },
    { name: 'Tacoma, WA', lat: 47.2529, lng: -122.4443 },

    { name: 'Fresno, CA', lat: 36.7378, lng: -119.7871 },
    { name: 'Bakersfield, CA', lat: 35.3733, lng: -119.0187 },
    { name: 'Modesto, CA', lat: 37.6391, lng: -120.9969 },
    { name: 'Stockton, CA', lat: 37.9577, lng: -121.2908 },
    { name: 'San Bernardino, CA', lat: 34.1083, lng: -117.2898 },

    // --- Original Major Cities (Kept for fallback) ---
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0742 },
  ],
  'United Kingdom': [
    // Suburban/Rural UK
    { name: 'Stoke-on-Trent', lat: 53.0027, lng: -2.1794 },
    { name: 'Wolverhampton', lat: 52.5862, lng: -2.1288 },
    { name: 'Plymouth', lat: 50.3755, lng: -4.1427 },
    { name: 'Derby', lat: 52.9225, lng: -1.4746 },
    { name: 'Swansea', lat: 51.6214, lng: -3.9436 },
    { name: 'Southampton', lat: 50.9097, lng: -1.4044 },
    { name: 'Blackpool', lat: 53.8175, lng: -3.0357 },
    { name: 'Middlesbrough', lat: 54.5742, lng: -1.2350 },
    { name: 'Bolton', lat: 53.5769, lng: -2.4282 },
    { name: 'Sunderland', lat: 54.9069, lng: -1.3838 },
    // Major
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Birmingham', lat: 52.5086, lng: -1.8755 },
    { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
  ],
  'Canada': [
    // Suburbs/Smaller
    { name: 'Hamilton', lat: 43.2557, lng: -79.8711 },
    { name: 'London, ON', lat: 42.9849, lng: -81.2453 },
    { name: 'Windsor, ON', lat: 42.3149, lng: -83.0364 },
    { name: 'Saskatoon', lat: 52.1332, lng: -106.6700 },
    { name: 'Regina', lat: 50.4452, lng: -104.6189 },
    // Major
    { name: 'Toronto', lat: 43.6629, lng: -79.3957 },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673 },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
  ],
  // ... (Other countries can follow this pattern, keeping defaults for now is safe as user seems focused on finding *any* result)
  'Australia': [
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide', lat: -34.9285, lng: 138.6007 },
    { name: 'Gold Coast', lat: -28.0167, lng: 153.4000 },
    { name: 'Canberra', lat: -35.2809, lng: 149.1300 },
    { name: 'Newcastle', lat: -32.9283, lng: 151.7817 },
  ],
  'Germany': [
    { name: 'Berlin', lat: 52.5200, lng: 13.4050 },
    { name: 'Munich', lat: 48.1351, lng: 11.5820 },
    { name: 'Hamburg', lat: 53.5511, lng: 9.9937 },
    { name: 'Cologne', lat: 50.9364, lng: 6.9528 },
    { name: 'Frankfurt', lat: 50.1109, lng: 8.6821 },
  ],
  'France': [
    { name: 'Paris', lat: 48.8566, lng: 2.3522 },
    { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
    { name: 'Lyon', lat: 45.7640, lng: 4.8357 },
    { name: 'Toulouse', lat: 43.6047, lng: 1.4442 },
    { name: 'Nice', lat: 43.7102, lng: 7.2620 },
  ],
  'Pakistan': [
    { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
    { name: 'Lahore', lat: 31.5204, lng: 74.3587 },
    { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
    { name: 'Rawalpindi', lat: 33.6007, lng: 73.0679 },
    { name: 'Faisalabad', lat: 31.4504, lng: 73.1350 },
    { name: 'Multan', lat: 30.1575, lng: 71.5249 },
    { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
    { name: 'Quetta', lat: 30.1798, lng: 66.9750 },
  ],
};

// Comprehensive country center coordinates for fallback (lat,lng)
// ... (Keeping original COUNTRY_CENTERS as is, it's vast)
export const COUNTRY_CENTERS: Record<string, { lat: number; lng: number }> = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'France': { lat: 46.2276, lng: 2.2137 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
};

// ... (Functions getCountryCoordinates and getCities remain the same) 
export function getCountryCoordinates(countryInput: string): { lat: number; lng: number } | null {
  if (COUNTRY_CENTERS[countryInput]) return COUNTRY_CENTERS[countryInput];
  const lowerInput = countryInput.toLowerCase();
  for (const [countryName, coords] of Object.entries(COUNTRY_CENTERS)) {
    if (countryName.toLowerCase() === lowerInput) return coords;
  }
  for (const [countryName, coords] of Object.entries(COUNTRY_CENTERS)) {
    if (countryName.toLowerCase().includes(lowerInput) || lowerInput.includes(countryName.toLowerCase())) {
      return coords;
    }
  }
  return null;
}

export function getCities(countryInput: string): City[] {
  const countryCities = COUNTRY_CITIES[countryInput];
  if (countryCities) return countryCities;

  const lowerInput = countryInput.toLowerCase();
  for (const [countryName, cities] of Object.entries(COUNTRY_CITIES)) {
    if (countryName.toLowerCase() === lowerInput) return cities;
  }

  const center = getCountryCoordinates(countryInput);
  if (center) {
    return [{ name: countryInput, lat: center.lat, lng: center.lng }];
  }
  return [];
}
