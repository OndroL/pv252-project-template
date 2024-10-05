import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {  
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test("initial-notification", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('.uk-notification-message')).toHaveText("Hello World!");
});

test("navigate-to-factorial", async ({ page }) => {
  await page.goto("/");

  await page.waitForTimeout(3000);

  await page.click("#site-a");

  const waitForNotificationText = async (expectedText: string) => {
    await page.waitForFunction(
      (expectedText) => {
        const notifications = document.querySelectorAll('.uk-notification-message');
        for (const notification of notifications) {
          const text = notification?.textContent?.trim();
          console.log("Notification text:", text);
          if (text === expectedText) return true;
        }
        return false;
      },
      expectedText,
      { timeout: 10000 }
    );
  };

  await waitForNotificationText("Going to factorials in 3s...");


  await page.waitForTimeout(1000);
  await waitForNotificationText("Going to factorials in 2s...");

  await page.waitForTimeout(1000);
  await waitForNotificationText("Going to factorials in 1s...");

  await page.waitForTimeout(2000);
  await expect(page).toHaveURL("/site_a.html");
});

test("navigate-to-fibonacci", async ({ page }) => {
  await page.goto("/");

  await page.waitForTimeout(3000);

  await page.click("#site-b");

  const waitForNotificationText = async (expectedText: string) => {
    await page.waitForFunction(
      (expectedText) => {
        const notifications = document.querySelectorAll('.uk-notification-message');
        for (const notification of notifications) {
          const text = notification?.textContent?.trim();
          console.log("Notification text:", text);
          if (text === expectedText) return true;
        }
        return false;
      },
      expectedText,
      { timeout: 10000 }
    );
  };
  await waitForNotificationText("Going to fibonacci in 3s...");

  await page.waitForTimeout(1000);
  await waitForNotificationText("Going to fibonacci in 2s...");

  await page.waitForTimeout(1000);
  await waitForNotificationText("Going to fibonacci in 1s...");


  await page.waitForTimeout(1000);
  await expect(page).toHaveURL("/site_b.html");
});