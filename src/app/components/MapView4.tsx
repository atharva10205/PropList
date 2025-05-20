"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's missing marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://img.icons8.com/?size=100&id=7880&format=png&color=000000",
  iconUrl: "https://img.icons8.com/?size=100&id=7880&format=png&color=000000",
  shadowUrl: "",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FlyToLocation = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], 14, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [lat, lng, map]);

  return null;
};

export default function MapView4({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const lat = Number(latitude);
  const lng = Number(longitude);

  const position: [number, number] = [lat, lng];

  return (
    <MapContainer
      center={position}
      zoom={14}
      style={{ height: "400px", width: "100%" , zIndex :0,position:'relative'  }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <Marker position={position}>
        <Popup>
          Property Location<br />
          Latitude: {lat.toFixed(4)}<br />
          Longitude: {lng.toFixed(4)}
        </Popup>
      </Marker>

      <FlyToLocation lat={lat} lng={lng} />
    </MapContainer>
  );
}
