import { chromium } from "playwright";
import { writeFileSync } from "fs";

const KEYS_FILE = "supabase-keys.json";

async function main() {
  console.log("🚀 Lancement du navigateur...");
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Step 1: Go to Supabase sign-in
  console.log("📍 Navigation vers Supabase...");
  await page.goto("https://supabase.com/dashboard/sign-in");
  await page.waitForLoadState("networkidle");

  // Step 2: Wait for user to log in
  console.log("⏳ ATTENDEZ : Connectez-vous avec Google (flo.bolzinger@gmail.com)");
  console.log("   Le script reprendra automatiquement après connexion...");

  // Wait until we're on the dashboard (not sign-in anymore)
  await page.waitForURL("**/dashboard/**", { timeout: 300000 });
  console.log("✅ Connexion détectée !");

  // Step 3: Navigate to new project page
  console.log("📍 Navigation vers création de projet...");
  await page.goto("https://supabase.com/dashboard/new/_");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(2000);

  // Step 4: Fill in project details
  console.log("📝 Remplissage du formulaire...");

  // Project name
  const nameInput = page.locator('input[id="project-name"], input[name="name"], input[placeholder*="Project name"], input[placeholder*="Name"]').first();
  await nameInput.waitFor({ timeout: 15000 });
  await nameInput.fill("leqr");
  console.log("   ✓ Nom: leqr");

  // Database password - click generate
  const generateBtn = page.locator('button:has-text("Generate"), button:has-text("generate")').first();
  try {
    await generateBtn.click({ timeout: 5000 });
    console.log("   ✓ Mot de passe généré");
  } catch {
    // Try to find and fill password manually
    const pwInput = page.locator('input[type="password"], input[id*="password"], input[name*="password"]').first();
    try {
      await pwInput.fill("LeQR-db-2026-secure!");
      console.log("   ✓ Mot de passe défini manuellement");
    } catch {
      console.log("   ⚠ Pas de champ mot de passe trouvé");
    }
  }

  // Region - select Frankfurt (eu-central-1)
  try {
    const regionBtn = page.locator('button:has-text("Frankfurt"), button:has-text("eu-central"), [data-value*="eu-central"]').first();
    await regionBtn.click({ timeout: 5000 });
    console.log("   ✓ Région: Frankfurt");
  } catch {
    // Try listbox/select approach
    try {
      const regionSelect = page.locator('button:has-text("region"), [role="combobox"]').first();
      await regionSelect.click({ timeout: 3000 });
      await page.waitForTimeout(500);
      const frankfurtOption = page.locator('text=Frankfurt, text=eu-central, text=West EU').first();
      await frankfurtOption.click({ timeout: 3000 });
      console.log("   ✓ Région sélectionnée");
    } catch {
      console.log("   ⚠ Région non modifiée (par défaut)");
    }
  }

  // Click Create Project
  console.log("📍 Création du projet...");
  const createBtn = page.locator('button:has-text("Create new project"), button:has-text("Create project")').first();
  await createBtn.click({ timeout: 10000 });
  console.log("   ⏳ En attente de création (peut prendre 2 min)...");

  // Wait for project to be ready - URL should contain project ref
  await page.waitForURL("**/project/**", { timeout: 300000 });
  console.log("   ✅ Projet créé !");
  await page.waitForTimeout(5000);

  // Step 5: Get the project ref from URL
  const projectUrl = page.url();
  const refMatch = projectUrl.match(/project\/([a-z]+)/);
  const projectRef = refMatch ? refMatch[1] : "unknown";
  console.log(`   📋 Ref: ${projectRef}`);

  // Step 6: Navigate to API settings
  console.log("📍 Récupération des clés API...");
  await page.goto(`https://supabase.com/dashboard/project/${projectRef}/settings/api`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // Extract URL
  let supabaseUrl = "";
  let anonKey = "";
  let serviceRoleKey = "";

  try {
    // The URL is usually in an input field or code block
    const urlElements = await page.locator('input[value*="supabase.co"], code:has-text("supabase.co"), span:has-text("supabase.co")').all();
    for (const el of urlElements) {
      const val = await el.inputValue().catch(() => el.textContent());
      if (val && val.includes("supabase.co")) {
        supabaseUrl = val.trim();
        break;
      }
    }
    if (!supabaseUrl) {
      supabaseUrl = `https://${projectRef}.supabase.co`;
    }
    console.log(`   ✓ URL: ${supabaseUrl}`);
  } catch {
    supabaseUrl = `https://${projectRef}.supabase.co`;
    console.log(`   ✓ URL (inferred): ${supabaseUrl}`);
  }

  // Extract anon key - it's usually visible
  try {
    const keyInputs = await page.locator('input[type="text"][readonly], input[type="text"][value^="eyJ"]').all();
    for (const el of keyInputs) {
      const val = await el.inputValue();
      if (val && val.startsWith("eyJ") && val.length < 300) {
        anonKey = val.trim();
        break;
      }
    }
    if (!anonKey) {
      // Try copy button approach or look in text
      const codeBlocks = await page.locator('code:has-text("eyJ")').all();
      for (const el of codeBlocks) {
        const text = await el.textContent();
        if (text && text.startsWith("eyJ") && text.length < 300) {
          anonKey = text.trim();
          break;
        }
      }
    }
    console.log(`   ✓ Anon key: ${anonKey ? anonKey.substring(0, 30) + "..." : "NOT FOUND"}`);
  } catch (e) {
    console.log(`   ⚠ Erreur récupération anon key: ${e.message}`);
  }

  // Extract service role key - need to click "Reveal"
  try {
    const revealBtns = await page.locator('button:has-text("Reveal"), button:has-text("reveal"), button:has-text("Show")').all();
    for (const btn of revealBtns) {
      await btn.click();
      await page.waitForTimeout(500);
    }

    const keyInputs = await page.locator('input[type="text"][readonly], input[type="text"][value^="eyJ"]').all();
    for (const el of keyInputs) {
      const val = await el.inputValue();
      if (val && val.startsWith("eyJ") && val.length > 300) {
        serviceRoleKey = val.trim();
        break;
      }
    }
    if (!serviceRoleKey) {
      const codeBlocks = await page.locator('code:has-text("eyJ")').all();
      for (const el of codeBlocks) {
        const text = await el.textContent();
        if (text && text.startsWith("eyJ") && text.length > 300) {
          serviceRoleKey = text.trim();
          break;
        }
      }
    }
    console.log(`   ✓ Service role key: ${serviceRoleKey ? serviceRoleKey.substring(0, 30) + "..." : "NOT FOUND"}`);
  } catch (e) {
    console.log(`   ⚠ Erreur récupération service role key: ${e.message}`);
  }

  // Step 7: Navigate to SQL Editor and run the schema
  console.log("📍 Exécution du schéma SQL...");
  await page.goto(`https://supabase.com/dashboard/project/${projectRef}/sql/new`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(3000);

  // The SQL editor is usually a Monaco/CodeMirror editor
  // We'll try to find it and paste the SQL
  try {
    const editor = page.locator('.monaco-editor textarea, [role="textbox"], .cm-content').first();
    await editor.click({ timeout: 5000 });
    await page.waitForTimeout(500);

    // Read the SQL file
    const sqlContent = `
CREATE TABLE qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT NULL,
  short_code VARCHAR(12) UNIQUE NOT NULL,
  target_url TEXT NOT NULL,
  label VARCHAR(255),
  fg_color VARCHAR(7) DEFAULT '#000000',
  bg_color VARCHAR(7) DEFAULT '#ffffff',
  is_dynamic BOOLEAN DEFAULT false,
  scan_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE TABLE scans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_id UUID REFERENCES qr_codes(id) ON DELETE CASCADE NOT NULL,
  ip VARCHAR(45),
  user_agent TEXT,
  country VARCHAR(2),
  city VARCHAR(100),
  device VARCHAR(20),
  referer TEXT,
  scanned_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_scans_qr_id ON scans(qr_id);
CREATE INDEX idx_scans_scanned_at ON scans(scanned_at);
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE OR REPLACE FUNCTION increment_scan_count() RETURNS TRIGGER AS $$ BEGIN UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = NEW.qr_id; RETURN NEW; END; $$ LANGUAGE plpgsql;
CREATE TRIGGER on_scan_insert AFTER INSERT ON scans FOR EACH ROW EXECUTE FUNCTION increment_scan_count();
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own QR codes" ON qr_codes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own QR codes" ON qr_codes FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own QR codes" ON qr_codes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own QR codes" ON qr_codes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view scans of own QR codes" ON scans FOR SELECT USING (EXISTS (SELECT 1 FROM qr_codes WHERE qr_codes.id = scans.qr_id AND qr_codes.user_id = auth.uid()));
CREATE POLICY "Service can insert scans" ON scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
`;

    await editor.fill(sqlContent);
    console.log("   ✓ SQL collé dans l'éditeur");

    // Click Run
    const runBtn = page.locator('button:has-text("Run"), button:has-text("Execute"), button[aria-label*="Run"]').first();
    await runBtn.click({ timeout: 5000 });
    console.log("   ⏳ Exécution du SQL...");
    await page.waitForTimeout(5000);
    console.log("   ✅ SQL exécuté !");
  } catch (e) {
    console.log(`   ⚠ Erreur SQL editor: ${e.message}`);
    console.log("   → Vous devrez exécuter le SQL manuellement dans le SQL Editor");
  }

  // Save keys to file
  const keys = {
    NEXT_PUBLIC_SUPABASE_URL: supabaseUrl,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey,
    SUPABASE_SERVICE_ROLE_KEY: serviceRoleKey,
    projectRef,
  };

  writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2));
  console.log(`\n📁 Clés sauvegardées dans ${KEYS_FILE}`);
  console.log("\n=== RÉSUMÉ ===");
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Anon key: ${anonKey ? "✓" : "✗ (à récupérer manuellement)"}`);
  console.log(`Service key: ${serviceRoleKey ? "✓" : "✗ (à récupérer manuellement)"}`);

  console.log("\n🎉 Terminé ! Le navigateur va rester ouvert 30 secondes...");
  await page.waitForTimeout(30000);
  await browser.close();
}

main().catch(console.error);
