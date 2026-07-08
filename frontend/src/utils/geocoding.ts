interface LocalityItem { name: string; description: string; }

/** Converts GPS coordinates to address fields using BigDataCloud (free, no key). */
export async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
  );
  if (!res.ok) throw new Error(`Geocoding error ${res.status}`);
  const data = await res.json();

  const informative: LocalityItem[] = data.localityInfo?.informative ?? [];
  const administrative: LocalityItem[] = data.localityInfo?.administrative ?? [];

  const road = informative.find((i) =>
    /road|street|avenue|lane|highway/i.test(i.description ?? '')
  )?.name ?? '';

  const neighbourhood = informative.find((i) =>
    /neighbourhood|suburb|quarter|hamlet|village/i.test(i.description ?? '')
  )?.name ?? '';

  const streetParts = [road, neighbourhood].filter(Boolean);
  // Don't fall back to locality for street — it causes city to appear twice
  const street = streetParts.join(', ');

  const adminCity = administrative.find((a) =>
    /city|town|municipality|taluk/i.test(a.description ?? '')
  )?.name ?? '';

  return {
    street,
    city:    data.city || adminCity || data.locality || '',
    state:   data.principalSubdivision || '',
    pincode: (data.postcode || '').replace(/\s/g, '').slice(0, 6),
  };
}

/** Falls back to city/state via IP geolocation (ipapi.co, free HTTPS). */
export async function getIPLocation() {
  const res = await fetch('https://ipapi.co/json/');
  if (!res.ok) throw new Error('IP location request failed');
  const data = await res.json();
  if (data.error) throw new Error(`IP location error: ${data.reason}`);
  return {
    lat:     data.latitude  as number,
    lng:     data.longitude as number,
    city:    (data.city   as string) || '',
    state:   (data.region as string) || '',
    pincode: ((data.postal as string) || '').replace(/\s/g, '').slice(0, 6),
  };
}

/**
 * Tries GPS first (fast, accurate). If GPS times out or is unavailable,
 * falls back to IP-based city/state (works behind VPNs too).
 * Returns coords + whether result is from GPS or IP.
 */
export async function detectLocation(): Promise<{
  lat: number; lng: number;
  city: string; state: string; pincode: string;
  street: string; source: 'gps' | 'ip';
}> {
  // ── 1. Try GPS / WiFi location ───────────────────────────────────────────
  if (navigator.geolocation) {
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000, // accept a 5-min old cached fix — instant if available
        })
      );
      const { latitude: lat, longitude: lng } = pos.coords;
      const geo = await reverseGeocode(lat, lng);
      return { lat, lng, ...geo, source: 'gps' };
    } catch (err) {
      const geoErr = err as GeolocationPositionError;
      // Re-throw permission denial — user explicitly said no
      if (geoErr?.code === geoErr?.PERMISSION_DENIED) {
        throw new Error('PERMISSION_DENIED');
      }
      // Otherwise (timeout / unavailable) fall through to IP fallback
    }
  }

  // ── 2. IP-based fallback ─────────────────────────────────────────────────
  const ip = await getIPLocation();
  const geo = await reverseGeocode(ip.lat, ip.lng).catch(() => ({
    street: '', city: ip.city, state: ip.state, pincode: ip.pincode,
  }));
  return { lat: ip.lat, lng: ip.lng, ...geo, source: 'ip' };
}
