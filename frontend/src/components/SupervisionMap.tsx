"use client";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import type { Logbook } from "@/src/lib/logbooks";

type LocatedLogbook = Logbook & {
  location: NonNullable<Logbook["location"]>;
};

function hasLocation(logbook: Logbook): logbook is LocatedLogbook {
  return logbook.location !== undefined;
}

const markerIcon = L.divIcon({
  className: "",
  html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 32" width="25" height="32" aria-hidden="true"><path fill="#2154d9" stroke="#fff" stroke-width="2" d="M12.5 1C6.1 1 1 6.1 1 12.5 1 20.7 12.5 31 12.5 31S24 20.7 24 12.5C24 6.1 18.9 1 12.5 1Z"/><circle cx="12.5" cy="12.5" r="4" fill="#fff"/></svg>',
  iconSize: [25, 32],
  iconAnchor: [12, 32],
  popupAnchor: [0, -30],
});

function FitLogbookBounds({ logbooks }: { logbooks: Logbook[] }) {
  const map = useMap();

  useEffect(() => {
    const locatedLogbooks = logbooks.filter(hasLocation);

    if (locatedLogbooks.length === 1) {
      const location = locatedLogbooks[0].location;
      map.setView([location.latitude, location.longitude], 14);
      return;
    }

    if (locatedLogbooks.length > 1) {
      const bounds = L.latLngBounds(
        locatedLogbooks.map((logbook) => [
          logbook.location.latitude,
          logbook.location.longitude,
        ]),
      );
      map.fitBounds(bounds.pad(0.15), { maxZoom: 14 });
    }
  }, [map, logbooks]);

  return null;
}

export default function SupervisionMap({
  logbooks,
}: {
  logbooks: Logbook[];
}) {
  const locatedLogbooks = logbooks.filter(hasLocation);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom
      className="h-[440px] w-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitLogbookBounds logbooks={logbooks} />
      {locatedLogbooks.map((logbook) => (
        <Marker
          key={logbook.id}
          position={[
            logbook.location.latitude,
            logbook.location.longitude,
          ]}
          icon={markerIcon}
        >
          <Popup>
            <div className="min-w-48 space-y-1 text-sm">
              <p className="font-bold">{logbook.studentName}</p>
              <p>ส่งบันทึกสัปดาห์ที่ {logbook.week}</p>
              <p>
                {new Date(logbook.submittedAt).toLocaleString("th-TH", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
              <p>
                พิกัด: {logbook.location.latitude.toFixed(5)},{" "}
                {logbook.location.longitude.toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
