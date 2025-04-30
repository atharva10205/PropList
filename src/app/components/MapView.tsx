'use client';

import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// const LocationMarker = ({ onSelect }: { onSelect: (position: any) => void }) => {
//   const [position, setPosition] = useState<any>(null);

//   useMapEvents({
//     click(e) {
//       setPosition(e.latlng);
//       onSelect(e.latlng);
//     },
//   });

//   return position === null ? null : <Marker position={position} />;
// };

const FlyToLocation = ({ location }: { location: any }) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [location, map]);

  return null;
};

export default function MapView({ onLocationSelect }: { onLocationSelect: any }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={4}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {/* <LocationMarker onSelect={onLocationSelect} /> */}
      <FlyToLocation location={onLocationSelect} />
    </MapContainer>
  );
}
