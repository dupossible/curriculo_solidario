const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

async function generatePdfFromTemplate(cvData) {
  const html = await ejs.renderFile(
    path.join(__dirname, '..', 'templates', 'curriculo.ejs'),
    { cv: cvData }
  );

  const browser = await puppeteer.launch({
    args: ['--no-sandbox','--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', bottom: '16mm', left: '16mm', right: '16mm' }
  });

  await browser.close();
  return pdf;
}

module.exports = { generatePdfFromTemplate };
