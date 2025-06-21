const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/suno', (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  console.log('🧠 Génération pour le prompt :', prompt);

  // Appel du script Playwright avec le prompt
  exec(`node generate.js "${prompt}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Erreur : ${error.message}`);
      return res.status(500).json({ error: 'Erreur de génération' });
    }

    try {
      const output = require('./output.json');
      res.json({ audio_url: output.audioUrl });
    } catch (err) {
      res.status(500).json({ error: 'Erreur lecture output' });
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Serveur Suno API sur http://localhost:${port}`);
});
