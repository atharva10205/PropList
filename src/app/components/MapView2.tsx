"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's missing marker icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const LocationMarker = ({
    onSelect,
  }: {
    onSelect: (position: any) => void;
  }) => {
    const [position, setPosition] = useState<any>(null);
  
    useMapEvents({
      click(e) {
        const { latlng } = e; 
        setPosition(latlng);  
      },
    });
  
    return position ? <Marker position={position} /> : null;
  };
  
function FlyToLocation1({ coords }: { coords: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (coords && coords.length === 2) {
      map.flyTo(coords, 14, {
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
}

export default function MapView2({
  markerCoords,
  onLocationSelect,
}: {
  markerCoords: any;
  onLocationSelect: any;
  
})  {
  return (
    <MapContainer
      center={markerCoords || [20.5937, 78.9629]}
      zoom={1}
      style={{ height: "400px", width: "970px" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {<FlyToLocation1 coords={markerCoords} />}
    </MapContainer>
  );
}
