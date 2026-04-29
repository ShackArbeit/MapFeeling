"use client";

import type { DateRequest, DateRequestStatus } from "@/types/domain";
import type { CreateDateRequestInput, DateRequestStore } from "./dateRequest.types";

const STORAGE_KEY = "tastemap.dateRequests";

function readAll(): DateRequest[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as DateRequest[];
  } catch {
    return [];
  }
}

function writeAll(requests: DateRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}

export const browserLocalDateRequestStore: DateRequestStore = {
  async create(input: CreateDateRequestInput): Promise<DateRequest> {
    const now = new Date().toISOString();
    const request: DateRequest = {
      ...input,
      id: `dr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    const all = readAll();
    all.push(request);
    writeAll(all);
    return request;
  },

  async listByReceiver(receiverId: string): Promise<DateRequest[]> {
    return readAll().filter((r) => r.receiverId === receiverId);
  },

  async updateStatus(id: string, status: DateRequestStatus): Promise<DateRequest> {
    const all = readAll();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error(`DateRequest ${id} not found`);
    all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
    writeAll(all);
    return all[idx];
  },
};