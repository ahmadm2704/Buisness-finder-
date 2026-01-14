import { NextRequest, NextResponse } from 'next/server';

const HERE_API_KEY = process.env.HERE_API_KEY;

// Major cities by country for comprehensive search
const COUNTRY_CITIES: { [key: string]: Array<{ name: string; lat: number; lng: number }> } = {
  'United States': [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0742 },
    { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { name: 'San Antonio', lat: 29.4241, lng: -98.4936 },
    { name: 'San Diego', lat: 32.7157, lng: -117.1611 },
    { name: 'Dallas', lat: 32.7767, lng: -96.7970 },
    { name: 'San Jose', lat: 37.3382, lng: -121.8863 },
  ],
  'United Kingdom': [
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Birmingham', lat: 52.5086, lng: -1.8755 },
    { name: 'Leeds', lat: 53.8008, lng: -1.5491 },
    { name: 'Glasgow', lat: 55.8642, lng: -4.2518 },
    { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
    { name: 'Edinburgh', lat: 55.9533, lng: -3.1883 },
  ],
  'Canada': [
    { name: 'Toronto', lat: 43.6629, lng: -79.3957 },
    { name: 'Montreal', lat: 45.5017, lng: -73.5673 },
    { name: 'Vancouver', lat: 49.2827, lng: -123.1207 },
    { name: 'Calgary', lat: 51.0447, lng: -114.0719 },
    { name: 'Ottawa', lat: 45.4215, lng: -75.6972 },
    { name: 'Edmonton', lat: 53.5461, lng: -113.4938 },
  ],
  'Australia': [
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Melbourne', lat: -37.8136, lng: 144.9631 },
    { name: 'Brisbane', lat: -27.4698, lng: 153.0251 },
    { name: 'Perth', lat: -31.9505, lng: 115.8605 },
    { name: 'Adelaide', lat: -34.9285, lng: 138.6007 },
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
  'India': [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  ],
  'China': [
    { name: 'Beijing', lat: 39.9042, lng: 116.4074 },
    { name: 'Shanghai', lat: 31.2304, lng: 121.4737 },
    { name: 'Guangzhou', lat: 23.1291, lng: 113.2644 },
    { name: 'Shenzhen', lat: 22.5431, lng: 114.0579 },
    { name: 'Chengdu', lat: 30.5728, lng: 104.0668 },
  ],
  'Japan': [
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
    { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
    { name: 'Yokohama', lat: 35.4437, lng: 139.6380 },
  ],
  'Brazil': [
    { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
    { name: 'Brasília', lat: -15.7975, lng: -47.8919 },
    { name: 'Salvador', lat: -12.9714, lng: -38.5014 },
    { name: 'Fortaleza', lat: -3.7319, lng: -38.5269 },
  ],
  'Mexico': [
    { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
    { name: 'Guadalajara', lat: 20.6596, lng: -103.2494 },
    { name: 'Monterrey', lat: 25.6866, lng: -100.3161 },
    { name: 'Cancún', lat: 21.1619, lng: -86.8515 },
  ],
  'South Korea': [
    { name: 'Seoul', lat: 37.5665, lng: 126.9780 },
    { name: 'Busan', lat: 35.1796, lng: 129.0756 },
    { name: 'Incheon', lat: 37.4563, lng: 126.7052 },
    { name: 'Daegu', lat: 35.8714, lng: 128.5937 },
  ],
  'Thailand': [
    { name: 'Bangkok', lat: 13.7563, lng: 100.5018 },
    { name: 'Chiang Mai', lat: 18.7883, lng: 98.9853 },
    { name: 'Phuket', lat: 8.0863, lng: 98.4038 },
  ],
  'UAE': [
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi', lat: 24.4539, lng: 54.3773 },
    { name: 'Sharjah', lat: 25.3548, lng: 55.3942 },
  ],
  'Kuwait': [
    { name: 'Kuwait City', lat: 29.3759, lng: 47.9774 },
    { name: 'Salmiya', lat: 29.3747, lng: 47.7796 },
    { name: 'Farwaniya', lat: 29.3316, lng: 47.8985 },
  ],
  'Saudi Arabia': [
    { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
    { name: 'Jeddah', lat: 21.5433, lng: 39.1727 },
    { name: 'Dammam', lat: 26.4167, lng: 50.0833 },
  ],
  'Egypt': [
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'Alexandria', lat: 31.2001, lng: 29.9187 },
    { name: 'Giza', lat: 30.0131, lng: 31.2089 },
  ],
};

// Comprehensive country center coordinates for fallback (lat,lng)
const COUNTRY_CENTERS: { [key: string]: { lat: number; lng: number } } = {
  'Afghanistan': { lat: 34.5553, lng: 69.2075 },
  'Albania': { lat: 41.1533, lng: 20.1683 },
  'Algeria': { lat: 36.7538, lng: 3.0588 },
  'Andorra': { lat: 42.5063, lng: 1.5218 },
  'Angola': { lat: -8.8383, lng: 13.2344 },
  'Antigua and Barbuda': { lat: 17.0578, lng: -61.7957 },
  'Argentina': { lat: -34.6037, lng: -58.3816 },
  'Armenia': { lat: 40.1829, lng: 44.5017 },
  'Australia': { lat: -33.8688, lng: 151.2093 },
  'Austria': { lat: 48.2082, lng: 16.3738 },
  'Azerbaijan': { lat: 40.4093, lng: 49.8671 },
  'Bahamas': { lat: 25.0343, lng: -77.3963 },
  'Bahrain': { lat: 26.0667, lng: 50.5577 },
  'Bangladesh': { lat: 23.8103, lng: 90.4125 },
  'Barbados': { lat: 13.1939, lng: -59.5432 },
  'Belarus': { lat: 53.9045, lng: 27.5615 },
  'Belgium': { lat: 50.8503, lng: 4.3517 },
  'Belize': { lat: 17.2509, lng: -88.7589 },
  'Benin': { lat: 6.4969, lng: 2.6289 },
  'Bhutan': { lat: 27.5142, lng: 90.4336 },
  'Bolivia': { lat: -16.5898, lng: -68.1506 },
  'Bosnia and Herzegovina': { lat: 43.9159, lng: 17.6791 },
  'Botswana': { lat: -24.6282, lng: 25.9165 },
  'Brazil': { lat: -23.5505, lng: -46.6333 },
  'Brunei': { lat: 4.8830, lng: 114.9988 },
  'Bulgaria': { lat: 42.6977, lng: 23.3219 },
  'Burkina Faso': { lat: 12.3714, lng: -1.5197 },
  'Burundi': { lat: -3.3731, lng: 29.9189 },
  'Cambodia': { lat: 11.5564, lng: 104.8801 },
  'Cameroon': { lat: 3.8667, lng: 11.5167 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'Cape Verde': { lat: 14.9215, lng: -23.6339 },
  'Central African Republic': { lat: 4.3676, lng: 18.5549 },
  'Chad': { lat: 12.1348, lng: 15.0557 },
  'Chile': { lat: -33.8688, lng: -51.2093 },
  'China': { lat: 39.9042, lng: 116.4074 },
  'Colombia': { lat: 4.7110, lng: -74.0721 },
  'Comoros': { lat: -11.6455, lng: 43.3333 },
  'Congo': { lat: -4.2369, lng: 21.7578 },
  'Costa Rica': { lat: 9.9281, lng: -84.0907 },
  'Croatia': { lat: 45.8150, lng: 15.9819 },
  'Cuba': { lat: 23.1136, lng: -82.3666 },
  'Cyprus': { lat: 35.1264, lng: 33.4299 },
  'Czech Republic': { lat: 50.0755, lng: 14.4378 },
  'Denmark': { lat: 55.6761, lng: 12.5683 },
  'Djibouti': { lat: 11.5951, lng: 42.5903 },
  'Dominica': { lat: 15.4150, lng: -61.3710 },
  'Dominican Republic': { lat: 18.4861, lng: -69.9312 },
  'East Timor': { lat: -8.5569, lng: 125.5603 },
  'Ecuador': { lat: -0.2299, lng: -78.5099 },
  'Egypt': { lat: 30.0444, lng: 31.2357 },
  'El Salvador': { lat: 13.6929, lng: -89.2182 },
  'Equatorial Guinea': { lat: 3.8480, lng: 11.5021 },
  'Eritrea': { lat: 15.1794, lng: 39.7823 },
  'Estonia': { lat: 59.4370, lng: 24.7536 },
  'Eswatini': { lat: -26.5225, lng: 31.4659 },
  'Ethiopia': { lat: 9.0320, lng: 38.7469 },
  'Fiji': { lat: -17.7134, lng: 178.0650 },
  'Finland': { lat: 60.1695, lng: 24.9354 },
  'France': { lat: 48.8566, lng: 2.3522 },
  'Gabon': { lat: 0.4162, lng: 9.4673 },
  'Gambia': { lat: 13.4549, lng: -15.3105 },
  'Georgia': { lat: 41.7151, lng: 44.8271 },
  'Germany': { lat: 52.5200, lng: 13.4050 },
  'Ghana': { lat: 5.6037, lng: -0.1870 },
  'Greece': { lat: 37.9838, lng: 23.7275 },
  'Grenada': { lat: 12.1165, lng: -61.6790 },
  'Guatemala': { lat: 14.6343, lng: -90.5069 },
  'Guinea': { lat: 9.6412, lng: -13.5784 },
  'Guinea-Bissau': { lat: 11.8037, lng: -15.1804 },
  'Guyana': { lat: 6.8013, lng: -58.1564 },
  'Haiti': { lat: 18.5944, lng: -72.2963 },
  'Honduras': { lat: 14.0723, lng: -87.1921 },
  'Hong Kong': { lat: 22.3193, lng: 114.1694 },
  'Hungary': { lat: 47.4979, lng: 19.0402 },
  'Iceland': { lat: 64.1466, lng: -21.9426 },
  'India': { lat: 28.6139, lng: 77.2090 },
  'Indonesia': { lat: -6.2088, lng: 106.8456 },
  'Iran': { lat: 35.6892, lng: 51.3890 },
  'Iraq': { lat: 33.3157, lng: 44.3615 },
  'Ireland': { lat: 53.3498, lng: -6.2603 },
  'Israel': { lat: 31.7683, lng: 35.2137 },
  'Italy': { lat: 41.9028, lng: 12.4964 },
  'Ivory Coast': { lat: 6.8275, lng: -5.2893 },
  'Jamaica': { lat: 18.0179, lng: -77.0369 },
  'Japan': { lat: 35.6762, lng: 139.6503 },
  'Jordan': { lat: 31.9454, lng: 35.9284 },
  'Kazakhstan': { lat: 51.1694, lng: 71.4491 },
  'Kenya': { lat: -1.2865, lng: 36.8172 },
  'Kiribati': { lat: 1.3382, lng: 172.9789 },
  'Kosovo': { lat: 42.6026, lng: 21.1618 },
  'Kuwait': { lat: 29.3759, lng: 47.9774 },
  'Kyrgyzstan': { lat: 42.8746, lng: 74.5698 },
  'Laos': { lat: 17.9757, lng: 102.6331 },
  'Latvia': { lat: 56.9496, lng: 24.1052 },
  'Lebanon': { lat: 33.8886, lng: 35.4955 },
  'Lesotho': { lat: -29.6100, lng: 28.2336 },
  'Liberia': { lat: 6.3155, lng: -10.8073 },
  'Libya': { lat: 32.8872, lng: 13.1913 },
  'Liechtenstein': { lat: 47.1667, lng: 9.5333 },
  'Lithuania': { lat: 54.6872, lng: 25.2797 },
  'Luxembourg': { lat: 49.6116, lng: 6.1319 },
  'Macao': { lat: 22.2987, lng: 113.5439 },
  'Madagascar': { lat: -19.8863, lng: 47.5389 },
  'Malawi': { lat: -13.9626, lng: 33.7741 },
  'Malaysia': { lat: 3.1390, lng: 101.6869 },
  'Maldives': { lat: 4.1755, lng: 73.5093 },
  'Mali': { lat: 12.5596, lng: -8.0029 },
  'Malta': { lat: 35.8989, lng: 14.5146 },
  'Marshall Islands': { lat: 7.1315, lng: 171.1845 },
  'Mauritania': { lat: 18.0735, lng: -13.1939 },
  'Mauritius': { lat: -20.3484, lng: 57.5522 },
  'Mexico': { lat: 19.4326, lng: -99.1332 },
  'Micronesia': { lat: 7.4256, lng: 150.5508 },
  'Moldova': { lat: 47.4116, lng: 28.3699 },
  'Monaco': { lat: 43.7384, lng: 7.4246 },
  'Mongolia': { lat: 47.9164, lng: 106.8858 },
  'Montenegro': { lat: 42.4364, lng: 19.2594 },
  'Morocco': { lat: 33.9716, lng: -6.8498 },
  'Mozambique': { lat: -23.8606, lng: 35.3091 },
  'Myanmar': { lat: 16.8661, lng: 96.1951 },
  'Namibia': { lat: -22.5597, lng: 17.0832 },
  'Nauru': { lat: -0.5228, lng: 166.9315 },
  'Nepal': { lat: 27.7172, lng: 85.3240 },
  'Netherlands': { lat: 52.3676, lng: 4.9041 },
  'New Zealand': { lat: -36.8509, lng: 174.7645 },
  'Nicaragua': { lat: 12.1150, lng: -86.2362 },
  'Niger': { lat: 13.5116, lng: 2.1257 },
  'Nigeria': { lat: 6.5244, lng: 3.3792 },
  'North Korea': { lat: 39.0392, lng: 125.7625 },
  'North Macedonia': { lat: 41.9973, lng: 21.4280 },
  'Norway': { lat: 59.9139, lng: 10.7522 },
  'Oman': { lat: 23.6100, lng: 58.5400 },
  'Pakistan': { lat: 34.0837, lng: 74.2969 },
  'Palau': { lat: 7.3151, lng: 134.4607 },
  'Palestine': { lat: 31.9522, lng: 35.2332 },
  'Panama': { lat: 8.9824, lng: -79.5199 },
  'Papua New Guinea': { lat: -6.3159, lng: 143.9555 },
  'Paraguay': { lat: -25.2637, lng: -57.5759 },
  'Peru': { lat: -12.0464, lng: -77.0428 },
  'Philippines': { lat: 14.5995, lng: 120.9842 },
  'Poland': { lat: 52.2297, lng: 21.0122 },
  'Portugal': { lat: 38.7223, lng: -9.1393 },
  'Puerto Rico': { lat: 18.2208, lng: -66.5901 },
  'Qatar': { lat: 25.2854, lng: 51.5310 },
  'Romania': { lat: 44.4268, lng: 26.1025 },
  'Russia': { lat: 55.7558, lng: 37.6173 },
  'Rwanda': { lat: -1.9536, lng: 29.8739 },
  'Saint Kitts and Nevis': { lat: 17.2574, lng: -62.7830 },
  'Saint Lucia': { lat: 13.9094, lng: -60.9789 },
  'Saint Vincent and the Grenadines': { lat: 12.9843, lng: -61.2872 },
  'Samoa': { lat: -13.7590, lng: -172.1046 },
  'San Marino': { lat: 43.9424, lng: 12.4578 },
  'Sao Tome and Principe': { lat: 0.3365, lng: 6.7273 },
  'Saudi Arabia': { lat: 24.7136, lng: 46.6753 },
  'Senegal': { lat: 14.7167, lng: -17.4667 },
  'Serbia': { lat: 44.8176, lng: 20.4624 },
  'Seychelles': { lat: -4.6796, lng: 55.4920 },
  'Sierra Leone': { lat: 8.4606, lng: -13.2317 },
  'Singapore': { lat: 1.3521, lng: 103.8198 },
  'Slovakia': { lat: 48.1486, lng: 17.1077 },
  'Slovenia': { lat: 46.0569, lng: 14.5058 },
  'Solomon Islands': { lat: -9.6348, lng: 160.1562 },
  'Somalia': { lat: 2.0469, lng: 45.3182 },
  'South Africa': { lat: -33.9249, lng: 18.4241 },
  'South Korea': { lat: 37.5665, lng: 126.9780 },
  'South Sudan': { lat: 4.8517, lng: 31.5921 },
  'Spain': { lat: 40.4168, lng: -3.7038 },
  'Sri Lanka': { lat: 6.9271, lng: 80.7789 },
  'Sudan': { lat: 15.5007, lng: 32.5599 },
  'Suriname': { lat: 5.8520, lng: -58.0105 },
  'Sweden': { lat: 59.3293, lng: 18.0686 },
  'Switzerland': { lat: 46.9480, lng: 7.4474 },
  'Syria': { lat: 33.5138, lng: 36.2765 },
  'Taiwan': { lat: 25.0330, lng: 121.5654 },
  'Tajikistan': { lat: 38.5598, lng: 68.7738 },
  'Tanzania': { lat: -6.7924, lng: 39.2083 },
  'Thailand': { lat: 13.7563, lng: 100.5018 },
  'Togo': { lat: 6.1256, lng: 1.2317 },
  'Tonga': { lat: -21.1789, lng: -175.1982 },
  'Trinidad and Tobago': { lat: 10.6918, lng: -61.2225 },
  'Tunisia': { lat: 36.8065, lng: 10.1967 },
  'Turkey': { lat: 41.0082, lng: 28.9784 },
  'Turkmenistan': { lat: 37.9601, lng: 58.3261 },
  'Tuvalu': { lat: -8.5211, lng: 179.1982 },
  'Uganda': { lat: 0.3476, lng: 32.5825 },
  'Ukraine': { lat: 50.4501, lng: 30.5234 },
  'United Arab Emirates': { lat: 25.2048, lng: 55.2708 },
  'United Kingdom': { lat: 51.5074, lng: -0.1278 },
  'United States': { lat: 39.8283, lng: -98.5795 },
  'Uruguay': { lat: -34.9011, lng: -56.1645 },
  'Uzbekistan': { lat: 41.2995, lng: 69.2401 },
  'Vanuatu': { lat: -17.7404, lng: 168.3045 },
  'Vatican City': { lat: 41.9029, lng: 12.4534 },
  'Venezuela': { lat: 10.4806, lng: -66.9036 },
  'Vietnam': { lat: 21.0285, lng: 105.8542 },
  'Yemen': { lat: 15.3694, lng: 48.5150 },
  'Zambia': { lat: -10.3299, lng: 28.2833 },
  'Zimbabwe': { lat: -17.8252, lng: 31.0335 },
};

function getCountryCoordinates(countryInput: string): { lat: number; lng: number } | null {
  // Exact match
  if (COUNTRY_CENTERS[countryInput]) {
    return COUNTRY_CENTERS[countryInput];
  }
  
  // Case-insensitive match
  const lowerInput = countryInput.toLowerCase();
  for (const [countryName, coords] of Object.entries(COUNTRY_CENTERS)) {
    if (countryName.toLowerCase() === lowerInput) {
      return coords;
    }
  }
  
  // Partial match (e.g., "USA" matches "United States")
  for (const [countryName, coords] of Object.entries(COUNTRY_CENTERS)) {
    if (countryName.toLowerCase().includes(lowerInput) || lowerInput.includes(countryName.toLowerCase())) {
      return coords;
    }
  }
  
  return null;
}

function getCities(countryInput: string): Array<{ name: string; lat: number; lng: number }> {
  // Check if cities are available for this country
  const countryCities = COUNTRY_CITIES[countryInput];
  if (countryCities) {
    return countryCities;
  }
  
  // Case-insensitive match for cities
  const lowerInput = countryInput.toLowerCase();
  for (const [countryName, cities] of Object.entries(COUNTRY_CITIES)) {
    if (countryName.toLowerCase() === lowerInput) {
      return cities;
    }
  }
  
  // If no specific cities, use a single center point
  const center = getCountryCoordinates(countryInput);
  if (center) {
    return [{ name: countryInput, lat: center.lat, lng: center.lng }];
  }
  
  return [];
}

async function searchBusinessesInCity(city: { name: string; lat: number; lng: number }, query: string): Promise<any[]> {
  const params = new URLSearchParams({
    q: query,
    at: `${city.lat},${city.lng}`,
    limit: '50',
    apiKey: HERE_API_KEY,
  });

  try {
    const response = await fetch(
      `https://discover.search.hereapi.com/v1/discover?${params.toString()}`
    );

    if (!response.ok) {
      console.error(`HERE API error for ${city.name}:`, response.status);
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error(`Error searching ${city.name}:`, error);
    return [];
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

    console.log('Searching for:', query, 'in', country);

    // Get all cities to search from
    const cities = getCities(country);
    
    if (cities.length === 0) {
      return NextResponse.json(
        { error: `Country "${country}" not found in database. Try searching for a major country name (e.g., United States, France, Japan, Brazil, etc.)` },
        { status: 400 }
      );
    }

    // Search in all cities and collect results
    console.log(`Searching in ${cities.length} cities: ${cities.map(c => c.name).join(', ')}`);
    const allResults: any[] = [];
    const seenIds = new Set<string>();

    for (const city of cities) {
      console.log(`Searching in ${city.name}...`);
      const results = await searchBusinessesInCity(city, query);
      
      // Add unique results (deduplicate by place ID)
      for (const result of results) {
        if (!seenIds.has(result.id)) {
          seenIds.add(result.id);
          allResults.push(result);
        }
      }
    }

    console.log(`Found ${allResults.length} total unique businesses across all cities`);

    // Process each place
    const businessesWithDetails = allResults.map((place: any) => {
      // HERE API contacts structure: [{ phone: [{value: "..."}], www: [{value: "..."}], email: [{value: "..."}] }]
      const contacts = place.contacts || [];
      const contactInfo = contacts[0] || {};
      
      // Check for website - strict validation
      const wwwList = contactInfo.www || [];
      let hasWebsite = false;
      let website = null;
      
      // Check each www entry to see if it's an actual website (not social media)
      for (const link of wwwList) {
        const url = link?.value?.toLowerCase() || '';
        
        // If it's a legitimate website URL (exclude social media and email)
        if (url && 
            !url.includes('facebook.com') && 
            !url.includes('instagram.com') && 
            !url.includes('twitter.com') && 
            !url.includes('linkedin.com') && 
            !url.includes('youtube.com') && 
            !url.includes('tiktok.com') && 
            !url.includes('@') && 
            url.includes('.')) {
          hasWebsite = true;
          website = link.value;
          break;
        }
      }
      
      // Get phone numbers (mobile and landline)
      const phoneList = contactInfo.phone || [];
      const mobileList = contactInfo.mobile || [];
      const phone = phoneList[0]?.value || mobileList[0]?.value || null;
      
      // Get email
      const emailList = contactInfo.email || [];
      const email = emailList[0]?.value || null;
      
      // Get social media from www links (check for facebook, instagram)
      let facebook = null;
      let instagram = null;
      
      wwwList.forEach((link: any) => {
        const url = link?.value?.toLowerCase() || '';
        if (url.includes('facebook.com')) {
          facebook = link.value;
        } else if (url.includes('instagram.com')) {
          instagram = link.value;
        }
      });

      return {
        id: place.id,
        name: place.title,
        address: place.address?.label || 'N/A',
        phone: phone,
        email: email,
        facebook: facebook,
        instagram: instagram,
        rating: null,
        reviews: null,
        type: place.categories?.[0]?.name || query,
        hasWebsite: !!hasWebsite,
        website: website,
        placeId: place.id,
      };
    });

    // Filter to only businesses WITHOUT websites (strict filtering)
    const businessesWithoutWebsites = businessesWithDetails.filter((b: any) => !b.hasWebsite);
    console.log('Total businesses found:', businessesWithDetails.length);
    console.log('Businesses WITH websites:', businessesWithDetails.filter((b: any) => b.hasWebsite).length);
    console.log('Businesses WITHOUT websites:', businessesWithoutWebsites.length);

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