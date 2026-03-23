import { chromium } from "playwright";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function expectVisibleText(page, text) {
  const timeoutMs = 30000;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const bodyText = (await page.textContent("body")) || "";
    if (bodyText.includes(text)) {
      return;
    }
    await page.waitForTimeout(500);
  }

  throw new Error(`Texte introuvable dans la page: ${text}`);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const consoleErrors = [];

  page.on("console", (msg) => {
    if (
      msg.type() === "error" &&
      !msg.text().includes("404 (Not Found)")
    ) {
      consoleErrors.push(msg.text());
    }
  });

  const homepageResponse = await context.request.get(baseUrl);
  const homepageHtml = await homepageResponse.text();

  assert(homepageHtml.includes("14,90"), "Le prix Pro n'est pas visible sur la homepage.");
  assert(
    homepageHtml.includes("Gratuit sans compte") ||
      homepageHtml.includes("gratuit sans compte"),
    "La promesse gratuit sans compte n'est pas visible sur la homepage."
  );
  assert(
    homepageHtml.includes("1 QR modifiable offert") ||
      homepageHtml.includes("1 QR modifiable offert avec compte"),
    "La promesse du QR modifiable offert n'est pas visible."
  );
  assert(
    homepageHtml.includes("Votre QR code apparaîtra ici") ||
      homepageHtml.includes("Votre QR code appara"),
    "Le bloc d'aperçu de QR n'est pas visible."
  );
  assert(
    !homepageHtml.includes("Une landing page par vrai besoin métier"),
    "Un wording interne est encore visible sur la homepage."
  );
  assert(
    !homepageHtml.includes(">Business<"),
    "Le plan Business est encore visible sur la homepage."
  );
  assert(
    !homepageHtml.includes("Créer un compte gratuit"),
    "Le CTA de la homepage parle encore de création de compte."
  );

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.waitForSelector('input[type="url"]');
  assert(
    await page
      .getByRole("button", { name: /Créer gratuitement mon QR modifiable/i })
      .isVisible(),
    "Le CTA QR modifiable n'est pas visible dans l'interface."
  );
  await page.locator('input[type="url"]').fill("https://example.com/landing");

  const staticResponse = await context.request.post(`${baseUrl}/api/qr/generate`, {
    data: {
      data: "https://example.com/free-static",
      fgColor: "#000000",
      bgColor: "#ffffff",
      size: 1000,
      format: "png",
      tracked: false,
    },
  });
  const staticBody = await staticResponse.json();
  assert(
    staticResponse.status() === 200 && typeof staticBody.dataURL === "string",
    "La génération statique gratuite n'a pas fonctionné."
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

  await page
    .getByRole("button", { name: /Créer gratuitement mon QR modifiable/i })
    .click();
  await page.waitForURL(/\/connexion\?signup=true/, { timeout: 30000 });

  const useCaseResponse = await context.request.get(`${baseUrl}/qr-code-avis-google`);
  const useCaseHtml = await useCaseResponse.text();
  assert(
    useCaseHtml.includes("Créez votre QR code pour avis Google") ||
      useCaseHtml.includes("Cr&eacute;ez votre QR code pour avis Google"),
    "La landing page Avis Google n'est pas correctement publiée."
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
