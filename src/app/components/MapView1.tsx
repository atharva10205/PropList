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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
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
  onLocationSelect: any;
  markerCoords: { lat: number; lng: number } | null;
}) {
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
      {markerCoords && <Marker position={markerCoords} />}
      {markerCoords && <FlyToLocation1 coords={markerCoords} />}
    </MapContainer>
  );
}
