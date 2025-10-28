const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

const Cv = require('../models/Cv');
const { generatePdfFromTemplate } = require('../utils/pdf');

// criar currículo, salvar no Mongo e gerar código
router.post('/create', async (req, res) => {
  try {
    const payload = req.body;
    const printCode = uuidv4().replace(/-/g,'').slice(0,8).toUpperCase();

    const cv = new Cv({ ...payload, printCode });
    await cv.save();

    const pdfBuffer = await generatePdfFromTemplate(cv.toObject());
    const tmpDir = path.join(__dirname, '..', 'tmp');
    await fs.mkdir(tmpDir, { recursive: true });
    const filePath = path.join(tmpDir, `cv-${cv._id}.pdf`);
    await fs.writeFile(filePath, pdfBuffer);
    cv.pdfPath = filePath;
    await cv.save();

    res.json({ ok: true, id: cv._id, printCode });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// download por ID (usado pelo botão do admin)
router.get('/download/:id', async (req, res) => {
  try {
    const cv = await Cv.findById(req.params.id);
    if (!cv || !cv.pdfPath) return res.status(404).send('Não encontrado');
    res.download(cv.pdfPath, `${(cv.name||'curriculo')}.pdf`);
  } catch (err) {
    res.status(500).send('Erro ao baixar');
  }
});

// lista para a gráfica (nome + código + link)
router.get('/list', async (req, res) => {
  try {
    const list = await Cv.find({}, { name: 1, printCode: 1, createdAt: 1 }).sort({ createdAt: -1 });
    res.json({ ok: true, items: list });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// busca por código (opcional: validar código)
router.get('/by-code/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase();
    const cv = await Cv.findOne({ printCode: code }, { name: 1, _id: 1, printCode: 1, createdAt: 1 });
    if (!cv) return res.status(404).json({ ok: false, error: 'Código não encontrado' });
    res.json({ ok: true, cv });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
