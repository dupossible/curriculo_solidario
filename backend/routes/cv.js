import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import CV from '../models/CV.js';
import puppeteer from 'puppeteer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post('/create', async (req,res)=>{
  try{
    const body = req.body;
    const code = uuidv4().slice(0,8).toUpperCase();
    const doc = await CV.create({ ...body, printCode: code });
    res.json({ ok:true, id: doc._id, printCode: code });
  }catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

router.get('/by-code/:code', async (req,res)=>{
  try{
    const cv = await CV.findOne({ printCode: req.params.code.toUpperCase() });
    if (!cv) return res.json({ ok:false, error:'Não encontrado' });
    res.json({ ok:true, cv });
  }catch(err){
    res.status(500).json({ ok:false, error: err.message });
  }
});

// Lista todos os currículos (nome, código e e-mail), mais recentes primeiro
router.get('/all', async (req, res) => {
  try {
    const sortField = (CV.schema.paths.createdAt ? { createdAt: -1 } : { _id: -1 });
    const docs = await CV.find({}, 'name printCode email').sort(sortField).lean();
    res.json({ ok: true, data: docs });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

router.get('/:code/pdf', async (req,res)=>{
  try{
    const cv = await CV.findOne({ printCode: req.params.code.toUpperCase() });
    if (!cv) return res.status(404).send('Não encontrado');

    const html = await ejs.renderFile(path.join(__dirname,'../views/template.ejs'), { cv });
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox','--disable-setuid-sandbox','--font-render-hinting=medium']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil:'load' });
    const pdf = await page.pdf({ format:'A4', printBackground:true, margin:{top:'18mm',right:'16mm',bottom:'18mm',left:'16mm'} });
    await browser.close();

    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition',`inline; filename="curriculo.pdf"`);
    res.send(pdf);
  }catch(err){
    res.status(500).send('Erro ao gerar PDF: ' + err.message);
  }
});

export default router;
