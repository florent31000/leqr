import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function expectVisibleText(page, text) {
  await page.waitForSelector(`text=${text}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto(baseUrl, { waitUntil: "networkidle" });

  await expectVisibleText(page, "14,90€");
  await expectVisibleText(page, "Créer un compte gratuit");
  await expectVisibleText(page, "Compte requis pour générer");

  const pageText = await page.textContent("body");
  assert(!pageText?.includes("Business"), "Le plan Business est encore visible sur la homepage.");
  assert(
    pageText?.includes("10 QR gratuits avec compte"),
    "La promesse de compte gratuit n'est pas visible sur la homepage."
  );
  assert(
    !pageText?.includes("3 QR sans compte"),
    "La homepage mentionne encore un accès sans compte."
  );

  const urlInput = page.locator('input[type="url"]').first();
  await urlInput.fill("https://example.com/test-1");
  await expectVisibleText(
    page,
    "Créez un compte gratuit pour générer un QR via LeQR"
  );

  const response = await context.request.post(`${baseUrl}/api/qr/generate`, {
    data: {
      data: "https://example.com/blocked",
      fgColor: "#000000",
      bgColor: "#ffffff",
      size: 1000,
      format: "png",
      tracked: true,
    },
  });
  const blockedStatus = {
    status: response.status(),
    body: await response.json(),
  };

  assert(
    blockedStatus.status === 401,
    `La génération backend sans compte n'a pas été bloquée (${blockedStatus.status}).`
  );
  assert(
    String(blockedStatus.body?.error || "").includes("Compte requis"),
    `Message backend inattendu: ${JSON.stringify(blockedStatus.body)}`
  );

  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const redirected = page.url().includes("/connexion");
  const bodyAfterDashboard = await page.textContent("body");
  assert(
    redirected || bodyAfterDashboard?.includes("Connexion"),
    `Le dashboard non connecté ne renvoie pas vers l'écran de connexion (${page.url()}).`
  );

  assert(
    consoleErrors.length === 0,
    `Erreurs console detectees: ${consoleErrors.join(" | ")}`
  );

  await browser.close();
  console.log("Playwright smoke test OK");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
