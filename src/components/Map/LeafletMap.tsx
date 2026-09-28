'use client';

import React, { useEffect, useRef } from 'react';
import { Issue, IssueStatus, IssueSeverity } from '@/types';
import Link from 'next/link';

interface LeafletMapProps {
  issues: Issue[];
  selectedIssueId?: string;
  onSelectIssue?: (issue: Issue) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactive?: boolean;
}

const getMarkerColor = (status: IssueStatus, severity: IssueSeverity) => {
  if (severity === 'CRITICAL' && status !== 'CLOSED') return '#DC2626'; // Red
  switch (status) {
    case 'CLOSED':
    case 'RESOLVED':
      return '#059669'; // Green
    case 'IN_PROGRESS':
    case 'ASSIGNED':
      return '#D97706'; // Amber
    case 'CITIZEN_VERIFICATION':
      return '#2563EB'; // Blue
    case 'REOPENED':
      return '#DC2626'; // Red
    default:
      return '#0B3D3A'; // Primary Teal
  }
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  center = [23.7806, 90.3892], // Central Dhaka
  zoom = 12,
  height = '100%',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    // Load Leaflet dynamically
    import('leaflet').then((leafletModule) => {
      if (isCancelled || !mapContainerRef.current) return;
      L = leafletModule.default || leafletModule;

      // Fix default icons if standard icons are ever needed
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Avoid re-initialization
      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: center,
          zoom: zoom,
          zoomControl: interactive,
          dragging: interactive,
          scrollWheelZoom: interactive ? 'center' : false,
          doubleClickZoom: interactive,
          touchZoom: interactive,
        });

        // Standard OpenStreetMap tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.setView(center, zoom);
      }

      const map = mapInstanceRef.current;

      // Clear existing markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};

      // Add markers
      issues.forEach((issue) => {
        const color = getMarkerColor(issue.status, issue.severity);
        const isSelected = issue.id === selectedIssueId;
        const isCritical = issue.severity === 'CRITICAL' && issue.status !== 'CLOSED';

        const customHtml = `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: ${isSelected ? '36px' : '28px'};
            height: ${isSelected ? '36px' : '28px'};
            background-color: ${color};
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            ${
              isCritical
                ? `<span style="
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: ${color};
                    opacity: 0.6;
                    animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                  "></span>`
                : ''
            }
            <div style="
              width: 10px;
              height: 10px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `;

        const icon = L.divIcon({
          html: customHtml,
          className: 'civic-marker-icon',
          iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
          iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
          popupAnchor: [0, -16],
        });

        const marker = L.marker([issue.location.latitude, issue.location.longitude], { icon }).addTo(map);

        // Custom Popup
        const popupContent = document.createElement('div');
        popupContent.className = 'civic-popup-card';
        popupContent.innerHTML = `
          <div style="min-width: 200px; max-width: 260px; font-family: sans-serif; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span style="
                font-size: 10px;
                font-weight: 700;
                padding: 2px 6px;
                border-radius: 4px;
                background-color: ${color}20;
                color: ${color};
                text-transform: uppercase;
              ">${issue.status.replace('_', ' ')}</span>
              <span style="font-size: 11px; color: #6B7280; font-weight: 600;">${issue.location.area}</span>
            </div>
            <h4 style="font-size: 13px; font-weight: 700; color: #111827; margin: 0 0 4px 0; line-height: 1.3;">
              ${issue.title}
            </h4>
            <p style="font-size: 11px; color: #4B5563; margin: 0 0 8px 0; line-height: 1.3;">
              📍 ${issue.location.address}
            </p>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 6px; border-top: 1px solid #E5E7EB;">
              <span style="font-size: 11px; color: #0B3D3A; font-weight: 600;">👍 ${issue.communityConfirmations} confirmed</span>
              <a href="/issues/${issue.id}" style="
                font-size: 11px;
                color: #0B3D3A;
                font-weight: 700;
                text-decoration: none;
                background: #F0F7F6;
                padding: 4px 8px;
                border-radius: 4px;
              ">View Issue →</a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectIssue) {
            onSelectIssue(issue);
          }
        });

        markersRef.current[issue.id] = marker;
      });
    });

    return () => {
      isCancelled = true;
    };
  }, [issues, center, zoom, selectedIssueId, onSelectIssue, interactive]);

  // Highlight or pan to selected issue
  useEffect(() => {
    if (selectedIssueId && markersRef.current[selectedIssueId] && mapInstanceRef.current) {
      const marker = markersRef.current[selectedIssueId];
      marker.openPopup();
      const pos = marker.getLatLng();
      mapInstanceRef.current.setView(pos, Math.max(14, mapInstanceRef.current.getZoom()), {
        animate: true,
      });
    }
  }, [selectedIssueId]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-inner border border-slate-200" style={{ height }}>
      {/* Map Target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border border-slate-200 text-xs hidden sm:flex items-center gap-3">
        <span className="font-semibold text-slate-700">Status:</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block animate-pulse"></span> Critical</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block"></span> In Progress</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Resolved</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span> Reported</span>
      </div>
    </div>
  );
};
