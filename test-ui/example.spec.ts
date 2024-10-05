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

test('YouTube homepage loads and search bar and videos are visible', async ({ page }) => {
  await page.goto('https://www.youtube.com/');

  const searchBar = page.locator('input[name="search_query"]');
  await expect(searchBar).toBeVisible();

  const videoThumbnails = page.locator('ytd-thumbnail');
  await expect(videoThumbnails.first()).toBeVisible();
});

test('Search for Samuel Pastva on is.muni.cz', async ({ page }) => {
  await page.goto('https://is.muni.cz/');

  const searchPeopleLink = page.locator('a[href="/lide/"]');
  await searchPeopleLink.click();

  const searchInput = page.locator('#input_hledat');
  await searchInput.fill('Samuel Pastva');
  await searchInput.press('Enter');

  const resultHeader = page.locator('h2:has-text("Samuel Pastva")');
  await resultHeader.waitFor({ state: 'attached', timeout: 10000 });
  await expect(resultHeader).toBeVisible({ timeout: 10000 });

  await expect(resultHeader).toContainText('RNDr. Samuel Pastva, Ph.D.');
});

test('Search and open PV252 course on is.muni.cz', async ({ page }) => {
  await page.goto('https://is.muni.cz/');

  const searchIcon = page.locator('i.isi-lupa');
  await expect(searchIcon).toBeVisible();
  await searchIcon.click();

  const searchInput = page.locator('input.input-group-field.input_text');
  await expect(searchInput).toBeVisible();

  await searchInput.fill('PV252');
  await searchInput.press('Enter');

  const courseLink = page.locator('a[href="/predmet/fi/podzim2024/PV252"]');
  await expect(courseLink).toBeVisible();
  await courseLink.click();

  const courseTitle = page.locator('h2:has-text("PV252 Frontend Web Development and User Experience")');
  await expect(courseTitle).toBeVisible();
});

test('Login with wrong credentials and check error message on is.muni.cz', async ({ page }) => {
  await page.goto('https://is.muni.cz/');

  const loginButton = page.locator('a.button:has-text("Přihlásit se")');
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const usernameInput = page.locator("[name='credential_0']");
  const passwordInput = page.locator("[name='credential_1']");

  await usernameInput.fill('wrong_username');
  await passwordInput.fill('wrong_password');

  await passwordInput.press('Enter');

  const errorMessage = page.locator('div.zdurazneni.chyba h3:has-text("Nesprávné přihlašovací jméno nebo heslo.")');
  await expect(errorMessage).toBeVisible();
});
