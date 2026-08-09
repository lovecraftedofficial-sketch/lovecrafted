const puppeteer = require('puppeteer');

async function testRender() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/", { waitUntil: 'networkidle0' });
  
  const text = await page.evaluate(() => document.body.innerText);
  console.log("PAGE TEXT PREVIEW:");
  console.log(text.substring(0, 1500));
  console.log("\nSEARCH FOR FEEDBACK:");
  console.log("Includes 'How did LoveCrafted feel?':", text.includes("How did LoveCrafted feel?"));
  console.log("Includes 'YOUR WORDS MATTER':", text.includes("YOUR WORDS MATTER"));
  
  await browser.close();
}

testRender();
