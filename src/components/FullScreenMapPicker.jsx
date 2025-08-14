import React from "react";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { useNavigate, useLocation } from "react-router-dom";

// Handle selecting location on click
const LocationMarker = ({ onSelect }) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        const data = await res.json();
        const address =
          data.display_name || `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
        onSelect({ lat, lng, address });
      } catch (err) {
        console.error("Reverse geocode failed:", err);
        onSelect({ lat, lng, address: `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}` });
      }
    },
  });
  return null;
};

// Search bar
const SearchControl = ({ provider }) => {
  const map = useMapEvents({});
  React.useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      showPopup: true,
      marker: {
        icon: L.icon({
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        }),
      },
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, provider]);
  return null;
};

const FullScreenMapPicker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type; // "pickup" or "dropoff"
  const formData = location.state?.formData || {};
  const editId = location.state?.editId; // retain editId
  const provider = new OpenStreetMapProvider();

  const handleSelect = (locationObj) => {
    const updatedFormData = { ...formData, [type]: locationObj };
    navigate("/shipper-dashboard/post-delivery", {
      state: { ...updatedFormData, editId },
    });
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <MapContainer
        center={[-1.286389, 36.817223]}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl provider={provider} />
        <LocationMarker onSelect={handleSelect} />
      </MapContainer>

      <button
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: "#fff",
          border: "1px solid #ccc",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => navigate(-1)}
      >
        Close
      </button>
    </div>
  );
};

export default FullScreenMapPicker;
