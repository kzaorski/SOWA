import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("semantic page has no broken resources, overflow or automatic third-party requests", async ({
  page,
}) => {
  const errors = [],
    failed = [],
    external = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) =>
    failed.push(`${request.failure()?.errorText}: ${request.url()}`),
  );
  page.on("response", (response) => {
    if (response.status() >= 400)
      failed.push(`${response.status()} ${response.url()}`);
  });
  page.on("request", (request) => {
    if (!new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      external.push(request.url());
  });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("main")).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /532 604 007/ }).first(),
  ).toHaveAttribute("href", "tel:+48532604007");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.locator("img").evaluateAll((images) =>
    images.forEach((img) => {
      img.loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((images) =>
          images
            .filter((img) => !img.complete || !img.naturalWidth)
            .map((img) => img.src),
        ),
    )
    .toEqual([]);
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter(
            (img) =>
              Math.abs(
                Number(img.getAttribute("width")) /
                  Number(img.getAttribute("height")) -
                  img.naturalWidth / img.naturalHeight,
              ) > 0.001,
          )
          .map((img) => img.src),
      ),
  ).toEqual([]);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(external).toEqual([]);
  await page.screenshot({
    path: test.info().outputPath("page.png"),
    fullPage: true,
  });
});

test("phone actions match the visible numbers and structured data", async ({
  page,
}) => {
  await page.goto("/");
  const phones = await page.locator('a[href^="tel:"]').evaluateAll((links) =>
    links.map((a) => ({
      displayedDigits: a.textContent.replace(/\D/g, ""),
      dialedDigits: a.getAttribute("href").slice(4).replace(/^\+/, ""),
    })),
  );
  expect(phones).toHaveLength(2);
  for (const phone of phones)
    expect(phone.dialedDigits).toBe(phone.displayedDigits);
  const schema = JSON.parse(
    await page.locator('script[type="application/ld+json"]').textContent(),
  );
  expect(schema.telephone.map((number) => number.replace(/^\+/, ""))).toEqual(
    phones.map((phone) => phone.displayedDigits),
  );
});

test("mobile menu is fully operable with Enter Space and Tab", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Mobile-only keyboard navigation",
  );
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /menu/i });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.locator("nav a").first()).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#o-nas$/);
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
});

test("WCAG 2.2 AA automated checks pass", async ({ page }) => {
  await page.goto("/");
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations).toEqual([]);
});

test("all hash links resolve to targets and metadata is factual", async ({
  page,
}) => {
  await page.goto("/");
  expect(
    await page
      .locator('a[href^="#"]')
      .evaluateAll((links) =>
        links
          .map((a) => a.getAttribute("href"))
          .filter(
            (href) =>
              href.length > 1 &&
              !document.getElementById(decodeURIComponent(href.slice(1))),
          ),
      ),
  ).toEqual([]);
  const data = await page
    .locator('script[type="application/ld+json"]')
    .textContent();
  const schema = JSON.parse(data);
  expect(JSON.stringify(schema)).toContain("+48532604007");
  expect(JSON.stringify(schema)).toContain("+48668530006");
  expect(JSON.stringify(schema)).not.toContain("dayOfWeek");
  for (const file of [
    "/CNAME",
    "/google545fdee4dbd596a8.html",
    "/BingSiteAuth.xml",
    "/robots.txt",
    "/sitemap.xml",
  ]) {
    expect((await page.request.get(file)).status()).toBe(200);
  }
});

test("menu supports keyboard Escape and closes after choosing a section", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Mobile-only navigation interaction",
  );
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /menu/i });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('nav a[href="#kontakt"]').click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("map needs explicit activation and has an accessible iframe", async ({
  page,
}) => {
  await page.route(/google\.com\/maps/, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<!doctype html><title>Map transport test</title>",
    }),
  );
  await page.goto("/");
  await expect(page.locator("iframe")).toHaveCount(0);
  const activate = page.getByRole("button", {
    name: /(?:wczytaj|załaduj|pokaż).*map/i,
  });
  await activate.click();
  await expect(page.locator("iframe")).toHaveCount(1);
  await expect(page.locator("iframe")).toHaveAttribute("title", /.+/);
  await expect(page.locator("iframe")).toHaveAttribute(
    "src",
    /53\.755473.*20\.459818/,
  );
});

test("without JavaScript all content, navigation and contact remain usable", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:8765/");
  await expect(page.locator('nav a[href="#kontakt"]')).toBeVisible();
  await expect(
    page.getByRole("link", { name: /532 604 007/ }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /google/i }).first(),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await context.close();
});

test("small and zoom-equivalent viewports reflow without horizontal scrolling", async ({
  page,
}) => {
  for (const width of [320, 768, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
  }
});
