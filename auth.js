const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false }); // on veut voir la fenêtre
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://suno.com');
  console.log("🧠 Connecte-toi manuellement avec Google dans la fenêtre ouverte");

  // Attends que tu sois connecté
  await page.waitForTimeout(60000); // Tu as 60 sec pour te connecter

  // Sauvegarde la session
  const cookies = await context.storageState();
  fs.writeFileSync('suno-cookies.json', JSON.stringify(cookies));

  await browser.close();
})();
