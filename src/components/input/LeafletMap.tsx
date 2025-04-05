"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function fixLeafletIcon() {
    if (typeof window !== "undefined") {
        // @ts-ignore
        delete L.Icon.Default.prototype._getIconUrl;

        L.Icon.Default.mergeOptions({
            iconRetinaUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
    }
}

function LocationPicker({ position, onPositionChange }) {
    useMapEvents({
        click(e) {
            onPositionChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position ? <Marker position={position} /> : null;
}

interface MapProps {
    position: [number, number] | null;
    onMapClick: (coords: [number, number]) => void;
}

const MapComponent: React.FC<MapProps> = ({ position, onMapClick }) => {
    useEffect(() => {
        fixLeafletIcon();
    }, []);

    return (
        <div
            style={{
                height: "250px",
                width: "100%",
                overflow: "hidden",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "8px",
            }}
        >
            <MapContainer
                center={[45.7474694, 21.2262052]} // Default center (UPT)
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker position={position} onPositionChange={onMapClick} />
            </MapContainer>
        </div>
    );
};

export default MapComponent;
