const { chromium } = require('playwright');
const fs = require('fs');

const prompt = process.argv[2];

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ✅ Charger la session avec les cookies
  const context = await browser.newContext({
    storageState: 'suno-cookies.json'
  });

  const page = await context.newPage();

  try {
    await page.goto('https://suno.com/create');
    await page.waitForTimeout(3000);

    await page.fill('textarea[name="prompt"]', prompt);
    await page.click('button:has-text("Create")');
    console.log("🎵 Génération en cours...");

    await page.waitForSelector('audio', { timeout: 90000 });
    const audioUrl = await page.getAttribute('audio', 'src');

    fs.writeFileSync('output.json', JSON.stringify({ audioUrl }));
    console.log("✅ Audio généré :", audioUrl);
  } catch (error) {
    console.error("❌ Erreur pendant la génération :", error);
    fs.writeFileSync('output.json', JSON.stringify({ audioUrl: null }));
  } finally {
    await browser.close();
  }
})();
