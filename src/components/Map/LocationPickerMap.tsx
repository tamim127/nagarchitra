'use client';

import React, { useEffect, useRef } from 'react';

interface LocationPickerMapProps {
  latitude: number;
  longitude: number;
  onChangeLocation: (lat: number, lng: number) => void;
  height?: string;
}

export const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  latitude,
  longitude,
  onChangeLocation,
  height = '320px',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;
    let isCancelled = false;

    import('leaflet').then((leafletModule) => {
      if (isCancelled || !containerRef.current) return;
      const L = leafletModule.default || leafletModule;

      if (!mapRef.current) {
        const map = L.map(containerRef.current).setView([latitude, longitude], 15);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const customPin = L.divIcon({
          html: `
            <div style="
              width: 34px;
              height: 34px;
              background-color: #DC2626;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 6px 14px rgba(220, 38, 38, 0.4);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: grab;
            ">
              <div style="
                width: 10px;
                height: 10px;
                background-color: white;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          className: 'civic-draggable-pin',
          iconSize: [34, 34],
          iconAnchor: [17, 34],
        });

        const marker = L.marker([latitude, longitude], {
          draggable: true,
          icon: customPin,
        }).addTo(map);

        marker.on('dragend', (e: any) => {
          const latlng = e.target.getLatLng();
          onChangeLocation(latlng.lat, latlng.lng);
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          onChangeLocation(e.latlng.lat, e.latlng.lng);
        });

        mapRef.current = map;
        markerRef.current = marker;
      } else {
        if (markerRef.current) {
          markerRef.current.setLatLng([latitude, longitude]);
        }
        mapRef.current.setView([latitude, longitude], 15);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [latitude, longitude, onChangeLocation]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-300 shadow-sm" style={{ height }}>
      <div ref={containerRef} className="w-full h-full z-0" />
      <div className="absolute top-3 left-3 z-[400] bg-white/95 px-3 py-1.5 rounded-md shadow text-xs font-medium text-slate-700 pointer-events-none">
        📍 Drag pin or click on map to set exact coordinates
      </div>
    </div>
  );
};
