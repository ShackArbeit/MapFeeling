import type { DateRequest, DateRequestStatus } from "@/types/domain";

export type CreateDateRequestInput = Omit<DateRequest, "id" | "status" | "createdAt" | "updatedAt">;

export interface DateRequestStore {
  create(input: CreateDateRequestInput): Promise<DateRequest>;
  listByReceiver(receiverId: string): Promise<DateRequest[]>;
  updateStatus(id: string, status: DateRequestStatus): Promise<DateRequest>;
}