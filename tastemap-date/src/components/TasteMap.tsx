"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { UserProfile } from "@/types/domain";

interface Props {
  users: UserProfile[];
  selectedUserId: string | null;
  onSelectUser: (user: UserProfile) => void;
}

function createAvatarIcon(avatarUrl: string, isSelected: boolean) {
  const border = isSelected ? "#f97316" : "#ffffff";
  const shadow = isSelected
    ? "0 0 0 3px #fed7aa, 0 3px 10px rgba(0,0,0,0.3)"
    : "0 2px 6px rgba(0,0,0,0.25)";
  return L.divIcon({
    className: "",
    html: `<div style="width:40px;height:40px;border-radius:50%;border:3px solid ${border};box-shadow:${shadow};overflow:hidden;background:#f3f4f6;"><img src="${avatarUrl}" width="40" height="40" style="width:100%;height:100%;display:block;"/></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
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
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
