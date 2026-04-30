const SESSION_KEYS = ["tastemap.viewerProfile", "tastemap.dateRequests"] as const;

export function clearUserSession(): void {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
}
