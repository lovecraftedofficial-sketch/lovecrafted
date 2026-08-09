const puppeteer = require('puppeteer');

async function investigateSpotifyMobileDRM() {
  console.log("==========================================================");
  console.log("   SPOTIFY EMBED MOBILE DRM & AUTH EVIDENCE INVESTIGATION   ");
  console.log("==========================================================");

  let browser;
  try {
    browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    
    // Set iPhone 13 Pro mobile viewport & user agent
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1");

    const consoleLogs = [];
    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    console.log("\n1. Navigating to Mobile Template Page (http://localhost:3000/story/come-here-baby)...");
    await page.goto("http://localhost:3000/story/come-here-baby", { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1000));

    // Click "Tap to Open" button to unbox
    const clicked = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Open') || b.innerText.includes('Tap') || b.innerText.includes('Unbox') || b.innerText.includes('Open Letter'));
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    console.log("   Clicked unboxing envelope button:", clicked);
    await new Promise(r => setTimeout(r, 1500));

    // Scroll down to #songs section
    await page.evaluate(() => {
      const el = document.getElementById('songs');
      if (el) el.scrollIntoView();
      else window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 1000));

    // Inspect Spotify iframe attributes explicitly
    const spotifyIframeInfo = await page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="spotify.com"]');
      if (!iframe) return null;

      return {
        title: iframe.getAttribute('title'),
        src: iframe.getAttribute('src'),
        allow: iframe.getAttribute('allow'),
        allowFullScreen: iframe.hasAttribute('allowfullscreen'),
        frameBorder: iframe.getAttribute('frameBorder') || iframe.getAttribute('frameborder'),
        width: iframe.getAttribute('width'),
        height: iframe.getAttribute('height'),
        loading: iframe.getAttribute('loading'),
        outerHTML: iframe.outerHTML
      };
    });

    console.log("\n2. RENDERED SPOTIFY MOBILE DOM IFRAME ATTRIBUTES:");
    console.log(JSON.stringify(spotifyIframeInfo, null, 2));

    console.log("\n3. CONSOLE LOGS & EME/DRM WARNINGS:");
    const drmLogs = consoleLogs.filter(l => l.text.toLowerCase().includes("spotify") || l.text.toLowerCase().includes("drm") || l.text.toLowerCase().includes("encrypted"));
    if (drmLogs.length === 0) {
      console.log("   No DRM or Encrypted-Media console errors reported by mobile browser.");
    } else {
      console.log("   DRM / Encrypted-Media Logs:", drmLogs);
    }

    console.log("\n4. SPOTIFY IFRAME PERMISSION VERIFICATION:");
    if (spotifyIframeInfo) {
      const hasEncryptedMedia = spotifyIframeInfo.allow && spotifyIframeInfo.allow.includes("encrypted-media");
      const hasAutoplay = spotifyIframeInfo.allow && spotifyIframeInfo.allow.includes("autoplay");
      const hasFullscreen = spotifyIframeInfo.allow && spotifyIframeInfo.allow.includes("fullscreen");
      const hasPictureInPicture = spotifyIframeInfo.allow && spotifyIframeInfo.allow.includes("picture-in-picture");

      console.log(`   - allow="encrypted-media" present: ${hasEncryptedMedia}`);
      console.log(`   - allow="autoplay" present: ${hasAutoplay}`);
      console.log(`   - allow="fullscreen" present: ${hasFullscreen}`);
      console.log(`   - allow="picture-in-picture" present: ${hasPictureInPicture}`);
      console.log(`   - allowFullScreen attribute present: ${spotifyIframeInfo.allowFullScreen}`);
    }

  } catch (err) {
    console.error("❌ Investigation Error:", err.message);
  } finally {
    if (browser) await browser.close();
  }

  console.log("\n==========================================================");
}

investigateSpotifyMobileDRM();
