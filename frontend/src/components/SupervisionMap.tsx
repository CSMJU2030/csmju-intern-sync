"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Logbook } from "@/src/lib/logbooks";

type LocatedLogbook = Logbook & {
  location: NonNullable<Logbook["location"]>;
};

function hasLocation(logbook: Logbook): logbook is LocatedLogbook {
  return logbook.location !== undefined;
}

const markerIcon = L.divIcon({
  className: "",
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32" width="25" height="32" aria-hidden="true"><path fill="var(--color-primary)" stroke="var(--color-surface)" stroke-width="2" d="M12.5 1C6.1 1 1 6.1 1 12.5 1 20.7 12.5 31 12.5 31S24 20.7 24 12.5C24 6.1 18.9 1 12.5 1Z"/><circle cx="12.5" cy="12.5" r="4" fill="var(--color-surface)"/></svg>',
  iconSize: [25, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -30],
});

function createPopupContent(logbook: LocatedLogbook): HTMLDivElement {
  const content = document.createElement("div");
  content.className = "min-w-48 space-y-1 text-sm";

  const studentName = document.createElement("p");
  studentName.className = "font-bold";
  studentName.textContent = logbook.studentName;

  const week = document.createElement("p");
  week.textContent = `ส่งบันทึกสัปดาห์ที่ ${logbook.week}`;

  const submittedAt = document.createElement("p");
  submittedAt.textContent = new Date(logbook.submittedAt).toLocaleString(
    "th-TH",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  );

  const location = document.createElement("p");
  location.textContent = `พิกัด: ${logbook.location.latitude.toFixed(5)}, ${logbook.location.longitude.toFixed(5)}`;

  content.append(studentName, week, submittedAt, location);
  return content;
}

export default function SupervisionMap({
  logbooks,
}: {
  logbooks: Logbook[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = L.map(containerRef.current).setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const locatedLogbooks = logbooks.filter(hasLocation);
    const markers = L.layerGroup().addTo(map);

    locatedLogbooks.forEach((logbook) => {
      L.marker(
        [logbook.location.latitude, logbook.location.longitude],
        { icon: markerIcon },
      )
        .bindPopup(createPopupContent(logbook))
        .addTo(markers);
    });

    if (locatedLogbooks.length === 1) {
      const location = locatedLogbooks[0].location;
      map.setView([location.latitude, location.longitude], 14);
    } else if (locatedLogbooks.length > 1) {
      const bounds = L.latLngBounds(
        locatedLogbooks.map((logbook) => [
          logbook.location.latitude,
          logbook.location.longitude,
        ]),
      );
      map.fitBounds(bounds.pad(0.15), { maxZoom: 14 });
    }

    return () => {
      markers.remove();
    };
  }, [logbooks]);

  return <div ref={containerRef} className="h-[440px] w-full rounded-lg" />;
}
