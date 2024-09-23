import { expect } from "@playwright/test";
import { test } from "./coverage_wrapper";

test("find-watman", async ({ page }) => {  
  await page.goto("/");
  await expect(page.getByAltText("This is watman")).toBeInViewport();
});

test("initFibonacciUi-updates-component", async ({ page }) => {
  await page.goto("/");
  const fibonacciComponent = page.locator("#fibonacci-ui");
  await expect(fibonacciComponent).toContainText("5th fibonacci number is 5");
  await expect(fibonacciComponent.locator("code")).toContainText("5");
});

test("initFactorialUi-updates-component", async ({ page }) => {
  await page.goto("/");
  const factorialComponent = page.locator("#factorial-ui");
  await expect(factorialComponent).toContainText("Factorial value 5! is 120");
  await expect(factorialComponent.locator("code")).toContainText("120");
});
