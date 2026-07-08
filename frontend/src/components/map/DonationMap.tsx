import { useEffect } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix broken default icon paths in Vite builds
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapProps {
  latitude: number;
  longitude: number;
  title?: string;
  height?: number;
  interactive?: boolean;
  onLocationChange?: (lat: number, lng: number) => void;
  sx?: SxProps<Theme>;
}

/** Moves the map smoothly whenever the parent changes lat/lng */
function FlyToLocation({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], map.getZoom(), { duration: 0.8 });
  }, [lat, lng, map]);
  return null;
}

/** Fires onLocationChange when the user clicks the map */
function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function DonationMap({
  latitude,
  longitude,
  title,
  height = 280,
  interactive = false,
  onLocationChange,
  sx,
}: MapProps) {
  return (
    <Box
      sx={{
        height,
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        '& .leaflet-container': { height: '100%', width: '100%' },
        ...sx,
      }}
    >
      <MapContainer
        center={[latitude, longitude]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={interactive}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          {title && <Popup>{title}</Popup>}
        </Marker>

        {/* Smoothly pan the map whenever lat/lng prop changes */}
        <FlyToLocation lat={latitude} lng={longitude} />

        {/* Register click handler only in interactive mode */}
        {interactive && onLocationChange && (
          <ClickHandler onLocationChange={onLocationChange} />
        )}
      </MapContainer>
    </Box>
  );
}
