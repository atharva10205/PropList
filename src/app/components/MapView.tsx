'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

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

export default function MapView({
  markers,
  onLocationSelect,
}: {
  markers: any[],
  onLocationSelect: any
}) {
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
      
      {markers && markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker}
          eventHandlers={{
            click: () => {
              console.log('Clicked marker index:', index);
            }
          }}
        >
        
        </Marker>
      ))}

      <FlyToLocation location={onLocationSelect} />
    </MapContainer>
  );
}
