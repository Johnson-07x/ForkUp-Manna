import { useCallback, useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;

const MAP_STYLES = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

interface MapProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: number;
  interactive?: boolean;
  flyToOnChange?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
}


export function DonationMap({
  latitude,
  longitude,
  title,
  height = 280,
  interactive = false,
  onLocationChange,
}: MapProps) {
  const mapRef = useRef<google.maps.Map | null>(null);
  const overlayRef = useRef<google.maps.OverlayView | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    id: 'google-map-script',
  });

  const center = { lat: latitude, lng: longitude };

  // Build/update a raw OverlayView so we never touch the deprecated Marker class
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    class PinView extends google.maps.OverlayView {
      private pos: google.maps.LatLng;
      private container: HTMLDivElement;

      constructor(pos: google.maps.LatLng, container: HTMLDivElement) {
        super();
        this.pos = pos;
        this.container = container;
      }

      onAdd() {
        this.getPanes()!.overlayMouseTarget.appendChild(this.container);
      }

      draw() {
        const point = this.getProjection()?.fromLatLngToDivPixel(this.pos);
        if (point) {
          this.container.style.left = `${point.x}px`;
          this.container.style.top = `${point.y}px`;
          this.container.style.position = 'absolute';
        }
      }

      onRemove() {
        this.container.parentNode?.removeChild(this.container);
      }

      updatePosition(pos: google.maps.LatLng) {
        this.pos = pos;
        this.draw();
      }
    }

    if (!pinContainerRef.current) {
      pinContainerRef.current = document.createElement('div');
      pinContainerRef.current.title = title ?? '';
      pinContainerRef.current.innerHTML = `
        <div style="transform:translate(-50%,-100%);pointer-events:none;">
          <svg width="32" height="44" viewBox="0 0 32 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 44 16 44C16 44 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="#e53935"/>
            <circle cx="16" cy="16" r="7" fill="white"/>
          </svg>
        </div>`;
    }

    if (!overlayRef.current) {
      const view = new PinView(
        new google.maps.LatLng(latitude, longitude),
        pinContainerRef.current
      );
      view.setMap(mapRef.current);
      overlayRef.current = view;
    } else {
      (overlayRef.current as InstanceType<typeof PinView>).updatePosition(
        new google.maps.LatLng(latitude, longitude)
      );
    }

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, latitude, longitude]);

  // Pan map when lat/lng changes (replaces flyToOnChange)
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat: latitude, lng: longitude });
    }
  }, [latitude, longitude]);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    overlayRef.current?.setMap(null);
    overlayRef.current = null;
    mapRef.current = null;
  }, []);

  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!interactive || !onLocationChange || !e.latLng) return;
      onLocationChange(e.latLng.lat(), e.latLng.lng());
    },
    [interactive, onLocationChange]
  );

  if (loadError) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
        <Typography color="error" variant="body2">Failed to load Google Maps.</Typography>
      </Box>
    );
  }

  if (!isLoaded) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box sx={{ height, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          disableDefaultUI: !interactive,
          zoomControl: interactive,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          styles: MAP_STYLES,
          draggable: interactive,
          scrollwheel: interactive,
          gestureHandling: interactive ? 'greedy' : 'none',
        }}
      />
    </Box>
  );
}
