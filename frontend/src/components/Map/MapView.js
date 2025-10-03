import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const parseCoords = (gps) => {
  if (!gps) return null;
  // Expecting "lat,lng"
  const parts = String(gps).split(',').map(s => s.trim());
  if (parts.length !== 2) return null;
  const lat = Number(parts[0]);
  const lng = Number(parts[1]);
  if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
  return { lat, lng };
};

const MapView = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    axios.get('/api/companies').then(res => setCompanies(res.data)).catch(() => setCompanies([]));
  }, []);

  const center = companies.length > 0 ? (parseCoords(companies[0].gpsCoordinates) || { lat: -17.8292, lng: 31.0522 }) : { lat: -17.8292, lng: 31.0522 };

  return (
    <div>
      <h2>Companies Map</h2>
      <div style={{ height: 500 }}>
        <MapContainer center={[center.lat, center.lng]} zoom={6} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {companies.map(c => {
            const coords = parseCoords(c.gpsCoordinates);
            if (!coords) return null;
            return (
              <Marker key={c.id} position={[coords.lat, coords.lng]}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <div><strong>{c.companyName}</strong></div>
                    <div>{c.email}</div>
                    <div>{c.gpsCoordinates}</div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView; 