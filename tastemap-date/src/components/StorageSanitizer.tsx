"use client";

import { useEffect } from "react";
import { clearThirdPartyStorageKeys } from "@/lib/session";

export function StorageSanitizer() {
  useEffect(() => {
    clearThirdPartyStorageKeys();

    const onLoad = () => clearThirdPartyStorageKeys();
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        clearThirdPartyStorageKeys();
      }
    };

    window.addEventListener("load", onLoad);
    document.addEventListener("visibilitychange", onVisible);

    // Some extensions/scripts write these keys shortly after hydration.
    const intervalId = window.setInterval(clearThirdPartyStorageKeys, 1000);
    const timeoutId = window.setTimeout(() => window.clearInterval(intervalId), 10000);

    return () => {
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisible);
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return null;
}
