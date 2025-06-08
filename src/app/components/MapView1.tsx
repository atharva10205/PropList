"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});
function FlyToLocation1({ coords }: { coords: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lng], 14, {
        duration: 1.5,
      });
    }
  }, [coords, map]);

  return null;
}

export default function MapView1({
  markerCoords,
}: {
  onLocationSelect: (location: unknown) => void;
  markerCoords: { lat: number; lng: number } | null;
}) {
  return (
    <MapContainer
      center={markerCoords || [20.5937, 78.9629]}
      zoom={1}
      style={{ height: "400px", width: "970px" , zIndex :0,position:'relative'}}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      {markerCoords && <Marker position={markerCoords} />}
      {markerCoords && <FlyToLocation1 coords={markerCoords} />}
    </MapContainer>
  );
}
