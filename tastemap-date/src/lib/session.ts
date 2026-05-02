const SESSION_KEYS = ["tastemap.viewerProfile", "tastemap.dateRequests"] as const;

export function clearThirdPartyStorageKeys(): void {
  const toRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    if (key.startsWith("mp_") || key.startsWith("__mpq_")) {
      toRemove.push(key);
    }
  }
  toRemove.forEach((key) => localStorage.removeItem(key));
}

export function clearUserSession(): void {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
  clearThirdPartyStorageKeys();
}
