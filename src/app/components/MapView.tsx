'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap, Tooltip } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Define TypeScript interface for marker data
interface MarkerData {
  id?: string;
  latitude: number;
  longitude: number;
  propertyName?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  pricePerMonth?: number;
  [key: string]: any;
}

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const FlyToLocation = ({ location }: { location: [number, number] | null }) => {
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
  markers = [],
  onLocationSelect,
}: {
  markers: MarkerData[],
  onLocationSelect: [number, number] | null
}) {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

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
      
      {markers.map((marker, index) => (
        <Marker
          key={marker.id || index}
          position={[marker.latitude, marker.longitude]}
          eventHandlers={{
            click: () => {
              console.log('Clicked marker:', marker);
            },
            mouseover: () => {
              setActiveMarker(index);
            },
            mouseout: () => {
              setActiveMarker(null);
            }
          }}
        >
          {activeMarker === index && (
            <Tooltip direction="top" offset={[0, -32]} permanent={false}>
              <div className="min-w-[150px]">
                <strong className="text-sm">{marker.propertyName || 'Property'}</strong>
                <div className="text-xs">
                  {marker.street && <div>{marker.street}</div>}
                  <div>
                    {marker.city && `${marker.city}, `}
                    {marker.state && `${marker.state}, `}
                    {marker.country}
                  </div>
                  {marker.pricePerMonth && (
                    <div className="mt-1 font-semibold">
                      ${marker.pricePerMonth.toLocaleString()}/month
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>
          )}
        </Marker>
      ))}

      <FlyToLocation location={onLocationSelect} />
    </MapContainer>
  );
}