import { expect, test } from "@playwright/test";

test.describe("TasteMap Date — happy path", () => {
  test("landing page loads with headline", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("不要先想怎麼聊天")).toBeVisible();
    await expect(page.getByText("建立我的食感檔案")).toBeVisible();
  });

  test("onboarding page renders form", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(page.getByRole("heading", { name: /建立/ })).toBeVisible();
  });

  test("map page loads with food filters", async ({ page }) => {
    await page.goto("/map");
    await expect(page.getByText("食感航線")).toBeVisible();
    await expect(page.getByText("拉麵")).toBeVisible();
  });

  test("/api/profiles returns items", async ({ request }) => {
    const res = await request.get("/api/profiles?limit=10");
    expect(res.ok()).toBeTruthy();
    const data = await res.json() as { items: unknown[] };
    expect(Array.isArray(data.items)).toBe(true);
    expect(data.items.length).toBeGreaterThan(0);
  });

  test("inbox page loads", async ({ page }) => {
    await page.goto("/inbox");
    await expect(page.getByText("邀約收件匣")).toBeVisible();
  });
});