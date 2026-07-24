import { INDIAN_STATES, WORLD_COUNTRIES, IndianState, WorldCountry } from '../data/seoLocationsData';

export interface LocationDetectionResult {
  city?: string;
  state?: IndianState;
  stateName?: string;
  country?: WorldCountry;
  countryName?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
}

/**
 * Reverse geocode latitude and longitude to find city, state, and country.
 * Uses free client reverse geocoding with fallback distance matching.
 */
export async function reverseGeocode(latitude: number, longitude: number): Promise<LocationDetectionResult> {
  let result: LocationDetectionResult = {
    latitude,
    longitude
  };

  try {
    const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
    if (res.ok) {
      const data = await res.json();
      const principalSubdivision = data.principalSubdivision || data.localityInfo?.administrative?.[1]?.name || '';
      const countryName = data.countryName || '';
      const countryCode = (data.countryCode || '').toUpperCase();
      const city = data.city || data.locality || '';

      result.city = city;
      result.stateName = principalSubdivision;
      result.countryName = countryName;
      result.countryCode = countryCode;

      // Try matching Indian State
      if (countryCode === 'IN' || countryName.toLowerCase().includes('india') || principalSubdivision) {
        const matchedState = matchIndianState(principalSubdivision, city);
        if (matchedState) {
          result.state = matchedState;
        }
      }

      // Try matching Country
      if (countryCode) {
        const matchedCountry = WORLD_COUNTRIES.find(
          c => c.code.toUpperCase() === countryCode || c.name.toLowerCase() === countryName.toLowerCase()
        );
        if (matchedCountry) {
          result.country = matchedCountry;
        }
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding fetch failed, falling back to coordinate distance matching:', err);
  }

  // Fallback: If no state matched via API, match closest state by approximate capital coordinates in India
  if (!result.state && isWithinIndiaBounds(latitude, longitude)) {
    result.state = findClosestIndianStateByCoords(latitude, longitude);
  }

  return result;
}

/**
 * Matches state name string against known Indian states data
 */
export function matchIndianState(subdivision: string, city: string): IndianState | undefined {
  if (!subdivision && !city) return undefined;
  const targetStr = (subdivision + ' ' + city).toLowerCase();

  return INDIAN_STATES.find(state => {
    const sName = state.name.toLowerCase();
    const sSlug = state.slug.toLowerCase().replace(/-/g, ' ');
    const sCapital = state.capital.toLowerCase();
    
    return targetStr.includes(sName) || 
           sName.includes(subdivision.toLowerCase()) || 
           targetStr.includes(sSlug) || 
           (sCapital && targetStr.includes(sCapital));
  });
}

function isWithinIndiaBounds(lat: number, lon: number): boolean {
  return lat >= 6.0 && lat <= 37.5 && lon >= 68.0 && lon <= 97.5;
}

// Approximate lat/lon for Indian state capitals
const CAPITAL_COORDS: Record<string, { lat: number; lon: number }> = {
  'andhra-pradesh': { lat: 16.51, lon: 80.52 },
  'arunachal-pradesh': { lat: 27.10, lon: 93.62 },
  'assam': { lat: 26.14, lon: 91.79 },
  'bihar': { lat: 25.59, lon: 85.13 },
  'chhattisgarh': { lat: 21.25, lon: 81.63 },
  'goa': { lat: 15.49, lon: 73.82 },
  'gujarat': { lat: 23.21, lon: 72.63 },
  'haryana': { lat: 30.73, lon: 76.77 },
  'himachal-pradesh': { lat: 31.10, lon: 77.17 },
  'jharkhand': { lat: 23.34, lon: 85.30 },
  'karnataka': { lat: 12.97, lon: 77.59 },
  'kerala': { lat: 8.52, lon: 76.93 },
  'madhya-pradesh': { lat: 23.25, lon: 77.41 },
  'maharashtra': { lat: 19.07, lon: 72.87 },
  'manipur': { lat: 24.81, lon: 93.93 },
  'meghalaya': { lat: 25.57, lon: 91.88 },
  'mizoram': { lat: 23.72, lon: 92.71 },
  'nagaland': { lat: 25.67, lon: 94.10 },
  'odisha': { lat: 20.29, lon: 85.82 },
  'punjab': { lat: 30.73, lon: 76.77 },
  'rajasthan': { lat: 26.91, lon: 75.78 },
  'sikkim': { lat: 27.33, lon: 88.61 },
  'tamil-nadu': { lat: 13.08, lon: 80.27 },
  'telangana': { lat: 17.38, lon: 78.48 },
  'tripura': { lat: 23.83, lon: 91.28 },
  'uttar-pradesh': { lat: 26.84, lon: 80.94 },
  'uttarakhand': { lat: 30.31, lon: 78.03 },
  'west-bengal': { lat: 22.57, lon: 88.36 },
  'delhi': { lat: 28.61, lon: 77.20 }
};

function findClosestIndianStateByCoords(lat: number, lon: number): IndianState | undefined {
  let closestStateSlug = '';
  let minDistance = Infinity;

  Object.entries(CAPITAL_COORDS).forEach(([slug, coords]) => {
    const dLat = lat - coords.lat;
    const dLon = lon - coords.lon;
    const distSq = dLat * dLat + dLon * dLon;
    if (distSq < minDistance) {
      minDistance = distSq;
      closestStateSlug = slug;
    }
  });

  return INDIAN_STATES.find(s => s.slug === closestStateSlug);
}
