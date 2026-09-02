const puppeteer = require('puppeteer');

async function verifyEditorDraftPersistence() {
  console.log("=== CHECKING EXACT EDITOR FIELD & DRAFT PERSISTENCE WITH NATIVE TYPING ===");
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto("http://localhost:3000/dashboard/websites/come-here-baby/edit", { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Focus partnerName input and type with Puppeteer native keyboard
  const partnerInputSelector = 'input[value="My Baby"]';
  await page.click(partnerInputSelector);

  // Select all & type "Sona Baby"
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.up('Control');
  await page.keyboard.type('Sona Baby');

  await new Promise(r => setTimeout(r, 500));

  // Click Save Keepsake button
  await page.evaluate(() => {
    const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes("Save Keepsake"));
    if (saveBtn) saveBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Verify localStorage directly before reload
  const rawSaved = await page.evaluate(() => localStorage.getItem("lws:draft:come-here-baby:demo"));
  console.log("1. Raw Saved localStorage Content:", rawSaved ? JSON.parse(rawSaved).partnerName : "null");

  // Reload page
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  const partnerInputValAfter = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const partnerInput = inputs.find(i => i.value === "Sona Baby" || i.value === "My Baby");
    return partnerInput ? partnerInput.value : "not-found";
  });
  console.log("2. Partner Name Input Value After Reload:", partnerInputValAfter);

  await browser.close();
}

verifyEditorDraftPersistence();
