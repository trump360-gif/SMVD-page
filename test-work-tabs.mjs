import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // 1. Navigate to Work dashboard
    console.log('📍 Opening Work Dashboard...');
    await page.goto('http://localhost:3000/admin/dashboard/work', { waitUntil: 'networkidle' });
    
    // Wait for page to be ready
    await page.waitForTimeout(3000);
    
    // 2. Check initial URL in iframe
    const iframeUrl1 = await page.getAttribute('iframe[title="Work Page Preview"]', 'src');
    console.log(`📍 Preview iframe URL (Achieve): ${iframeUrl1}`);
    
    // 3. Click Exhibition tab in dashboard
    console.log('🔄 Clicking Exhibition tab...');
    await page.click('button:has-text("Exhibition")');
    await page.waitForTimeout(2000);
    
    // 4. Check if iframe URL changed
    const iframeUrl2 = await page.getAttribute('iframe[title="Work Page Preview"]', 'src');
    console.log(`📍 Preview iframe URL (Exhibition): ${iframeUrl2}`);
    
    if (iframeUrl1.includes('tab=achieve') && iframeUrl2.includes('tab=exhibition')) {
      console.log('\n✨ Tab switching working correctly!');
    } else {
      console.log('\n⚠️ URLs:');
      console.log(`  Achieve: ${iframeUrl1}`);
      console.log(`  Exhibition: ${iframeUrl2}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();
