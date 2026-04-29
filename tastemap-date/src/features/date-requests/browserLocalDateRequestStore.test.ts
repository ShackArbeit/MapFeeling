import { describe, expect, it, beforeEach } from "vitest";
import { browserLocalDateRequestStore } from "./browserLocalDateRequestStore";

beforeEach(() => {
  localStorage.clear();
});

describe("browserLocalDateRequestStore", () => {
  const input = {
    senderId: "user-1",
    receiverId: "user-2",
    foodType: "coffee" as const,
    proposedArea: "大安",
    proposedPlaceName: "大安附近",
    proposedTime: "週末午後",
    message: "要不要一起喝咖啡？",
    aiReason: "你們都喜歡咖啡",
  };

  it("create returns a pending request with generated id", async () => {
    const req = await browserLocalDateRequestStore.create(input);
    expect(req.id).toMatch(/^dr_/);
    expect(req.status).toBe("pending");
    expect(req.senderId).toBe("user-1");
    expect(req.receiverId).toBe("user-2");
  });

  it("listByReceiver returns only matching receiver", async () => {
    await browserLocalDateRequestStore.create(input);
    await browserLocalDateRequestStore.create({ ...input, receiverId: "user-3" });

    const list = await browserLocalDateRequestStore.listByReceiver("user-2");
    expect(list).toHaveLength(1);
    expect(list[0].receiverId).toBe("user-2");
  });

  it("updateStatus pending -> accepted persists the change", async () => {
    const req = await browserLocalDateRequestStore.create(input);
    const updated = await browserLocalDateRequestStore.updateStatus(req.id, "accepted");
    expect(updated.status).toBe("accepted");

    const list = await browserLocalDateRequestStore.listByReceiver("user-2");
    expect(list[0].status).toBe("accepted");
  });

  it("updateStatus pending -> rejected persists the change", async () => {
    const req = await browserLocalDateRequestStore.create(input);
    await browserLocalDateRequestStore.updateStatus(req.id, "rejected");

    const list = await browserLocalDateRequestStore.listByReceiver("user-2");
    expect(list[0].status).toBe("rejected");
  });

  it("updateStatus throws if id not found", async () => {
    await expect(
      browserLocalDateRequestStore.updateStatus("nonexistent", "accepted")
    ).rejects.toThrow();
  });
});