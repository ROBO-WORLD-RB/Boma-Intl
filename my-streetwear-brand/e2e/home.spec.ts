import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page loads with correct title", async ({ page }) => {
    // Verify the page title contains the brand name
    await expect(page).toHaveTitle(/BOMA|streetwear/i);
  });

  test("hero section displays main headline", async ({ page }) => {
    // Check the main headline is visible
    const headline = page.locator("h1");
    await expect(headline).toContainText("FREE THE YOUTH");
  });

  test("navbar is visible and contains navigation links", async ({ page }) => {
    // Verify navbar exists
    const navbar = page.locator("nav");
    await expect(navbar).toBeVisible();

    // Check navigation links
    await expect(page.getByRole("link", { name: "Shop" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Collections" })).toBeVisible();
    await expect(page.getByRole("link", { name: "About" })).toBeVisible();
  });

  test("navbar changes style after scrolling", async ({ page }) => {
    // Get initial navbar state
    const navbar = page.locator("nav");

    // Initially navbar should be transparent
    await expect(navbar).toHaveClass(/bg-transparent/);

    // Scroll down to trigger the scroll effect
    await page.evaluate(() => window.scrollTo(0, 500));

    // Wait for the scroll event to be processed
    await page.waitForTimeout(500);

    // After scrolling, navbar should have the scrolled style
    await expect(navbar).toHaveClass(/bg-black\/90|backdrop-blur/);
  });

  test("gallery section loads with images", async ({ page }) => {
    // Scroll to the gallery section
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    // Wait for images to be in viewport and potentially lazy load
    await page.waitForTimeout(1000);

    // Check that gallery images are present
    const galleryImages = page.locator("section").last().locator("img");

    // We expect 6 images based on galleryData
    await expect(galleryImages).toHaveCount(6);
  });

  test("gallery images have lazy loading attribute", async ({ page }) => {
    // Scroll to gallery
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });

    await page.waitForTimeout(500);

    // Check that images have lazy loading
    const images = page.locator("section").last().locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      await expect(images.nth(i)).toHaveAttribute("loading", "lazy");
    }
  });

  test("CTA button links to shop page", async ({ page }) => {
    const ctaButton = page.getByRole("link", { name: /shop now/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute("href", "/shop");
  });

  test("full page scroll simulation", async ({ page }) => {
    // Simulate a user scrolling through the entire page
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const pageHeight = await page.evaluate(() => document.body.scrollHeight);

    // Scroll in increments
    let currentScroll = 0;
    while (currentScroll < pageHeight) {
      await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
      await page.waitForTimeout(200);
      currentScroll += viewportHeight / 2;
    }

    // Verify we can scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);

    // Navbar should be back to transparent state
    const navbar = page.locator("nav");
    await expect(navbar).toHaveClass(/bg-transparent/);
  });
});
