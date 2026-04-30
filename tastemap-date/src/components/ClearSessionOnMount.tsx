"use client";

import { useEffect } from "react";
import { clearUserSession } from "@/lib/session";

export function ClearSessionOnMount() {
  useEffect(() => {
    clearUserSession();
  }, []);
  return null;
}
