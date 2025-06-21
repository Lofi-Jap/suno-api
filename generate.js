const { chromium } = require('playwright');
const fs = require('fs');

const prompt = process.argv[2];

(async () => {
  const browser = await chromium.launch({ headless: true });

  // ✅ Charger les cookies
  const context = await browser.newContext({
    storageState: 'suno-cookies.json'
  });

  const page = await context.newPage();

  try {
    await page.goto('https://suno.com/create', { timeout: 60000 });
    await page.waitForTimeout(3000);

    // ✅ Utiliser le textarea général (pas de name sur Suno)
    await page.waitForSelector('textarea', { timeout: 30000 });
    await page.fill('textarea', prompt);

    // ✅ Clic plus robuste sur le bouton Create
    await page.click('button:has-text("Create")');

    console.log("🎵 Génération en cours...");

    // ⏳ Attendre l'apparition du <audio> ou timeout
    await page.waitForSelector('audio', { timeout: 120000 });

    const audioUrl = await page.getAttribute('audio', 'src');

    fs.writeFileSync('output.json', JSON.stringify({ audioUrl }));
    console.log("✅ Audio généré :", audioUrl);
  } catch (error) {
    console.error("❌ Erreur pendant la génération :", error);

    // 🐛 Optionnel : dump une capture en cas d’erreur
    // await page.screenshot({ path: 'error.png' });

    fs.writeFileSync('output.json', JSON.stringify({ audioUrl: null }));
  } finally {
    await browser.close();
  }
})();
