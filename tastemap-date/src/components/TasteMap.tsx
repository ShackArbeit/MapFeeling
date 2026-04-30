"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { UserProfile } from "@/types/domain";

interface Props {
  users: UserProfile[];
  selectedUserId: string | null;
  onSelectUser: (user: UserProfile) => void;
}

function createAvatarIcon(avatarUrl: string, isSelected: boolean) {
  const border = isSelected ? "#fbbf24" : "#ffffff";
  const shadow = isSelected
    ? "0 0 0 4px rgba(251,191,36,0.18), 0 10px 24px rgba(0,0,0,0.45)"
    : "0 8px 18px rgba(0,0,0,0.35)";

  return L.divIcon({
    className: "",
    html: `<div style="width:42px;height:42px;border-radius:999px;border:3px solid ${border};box-shadow:${shadow};overflow:hidden;background:#1f2937;"><img src="${avatarUrl}" width="42" height="42" style="width:100%;height:100%;display:block;"/></div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -24],
  });
}

export function TasteMap({ users, selectedUserId, onSelectUser }: Props) {
  return (
    <MapContainer
      center={[25.045, 121.52]}
      zoom={12}
      style={{ width: "100%", height: "100%" }}
      preferCanvas
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {users.map((user) => (
        <Marker
          key={user.id}
          position={[user.lat, user.lng]}
          icon={createAvatarIcon(user.avatarUrl, user.id === selectedUserId)}
          eventHandlers={{ click: () => onSelectUser(user) }}
        >
          <Popup>
            <div className="text-sm font-semibold">{user.nickname}</div>
            <div className="text-xs text-gray-500">{user.preferredArea}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
