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
import React from "react";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  iconUrl: 'https://img.icons8.com/?size=100&id=7880&format=png&color=000000',
  shadowUrl: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

function LocationMarker({
  onSelect,
}: {
  onSelect: (position: { lat: number; lng: number }) => void;
}) {
  const [position, setPosition] = useState<{ lat: number, lng: number } | null>(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      const pos = { lat, lng };
      setPosition(pos);
      onSelect(pos); // Notify parent
    },
  });

  return position ? <Marker position={position} /> : null;
}




function FlyToLocation1({ coords }: { coords: { lat: number; lng: number } | null }) {
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

export default function MapView3({
  markerCoords,
  onLocationSelect,
}: {
  markerCoords: { lat: number; lng: number } | null;
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}) {
  return (
    <MapContainer
      center={{ lat: 20.5937, lng: 78.9629 }}
      zoom={2}
      style={{ height: "400px", width: "970px", zIndex :0,position:'relative' }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <FlyToLocation1 coords={markerCoords} />
      <LocationMarker onSelect={onLocationSelect} />
    </MapContainer>
  );
}
