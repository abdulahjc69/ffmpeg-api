const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs');
const path = require('path');

const TEMPLATES_DIR = path.join(__dirname);
const PREVIEWS_DIR = path.join(__dirname, 'previews');

const VARIABLES = {
  '{{nombre_proveedor}}': 'Proveedor de prueba',
  '{{ciudad}}': 'Córdoba',
  '{{persona_contacto}}': 'Departamento Comercial',
  '{{referencia_contacto}}': 'REF-TEST-001',
  '{{fecha_envio}}': '14 de junio de 2026',
  '{{telefono_proveedor}}': '+34 000 000 000',
  '{{email_destino}}': 'prueba@proveedor.com',
};

const TEMPLATES = [
  'email_hoteles.html',
  'email_transporte.html',
  'email_restaurantes_halal.html',
  'email_agencias.html',
  'email_guias.html',
];

function injectVariables(html) {
  let result = html;
  for (const [key, value] of Object.entries(VARIABLES)) {
    result = result.split(key).join(value);
  }
  return result;
}

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 680, height: 900 });

  for (const template of TEMPLATES) {
    const srcPath = path.join(TEMPLATES_DIR, template);
    if (!fs.existsSync(srcPath)) {
      console.log(`SKIP: ${template} not found`);
      continue;
    }

    const rawHtml = fs.readFileSync(srcPath, 'utf8');
    const html = injectVariables(rawHtml);

    // Write temp file
    const tmpPath = path.join(PREVIEWS_DIR, `_tmp_${template}`);
    fs.writeFileSync(tmpPath, html, 'utf8');

    await page.goto(`file://${tmpPath}`);
    await page.waitForTimeout(500);

    const baseName = template.replace('.html', '');

    // Get full page height
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    await page.setViewportSize({ width: 680, height: bodyHeight });
    await page.waitForTimeout(200);

    // PNG screenshot
    const pngPath = path.join(PREVIEWS_DIR, `${baseName}.png`);
    await page.screenshot({ path: pngPath, fullPage: true });
    console.log(`PNG: ${pngPath}`);

    // PDF
    const pdfPath = path.join(PREVIEWS_DIR, `${baseName}.pdf`);
    await page.pdf({
      path: pdfPath,
      width: '680px',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    console.log(`PDF: ${pdfPath}`);

    fs.unlinkSync(tmpPath);
  }

  await browser.close();
  console.log('\nDone.');
})();
