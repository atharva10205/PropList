"use client";

import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type LatLngTuple = [number, number];

// Fix Leaflet's missing marker icon issue
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function FlyToLocation1({ coords }: { coords?: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13);
    }
  }, [coords, map]);

  return null;
}

export default function MapView2({
  markerCoords}: {
  markerCoords?: LatLngTuple;
  onLocationSelect: (coords: LatLngTuple) => void;
}) {
  return (
    <MapContainer
      center={markerCoords || [20.5937, 78.9629]}
      zoom={1}
      style={{ height: "400px", width: "970px", zIndex: 0, position: 'relative' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FlyToLocation1 coords={markerCoords} />
    </MapContainer>
  );
}
