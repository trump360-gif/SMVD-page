import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('🔄 Opening Work Dashboard...');
    await page.goto('http://localhost:3000/admin/dashboard/work', { 
      waitUntil: 'networkidle' 
    });
    
    await page.waitForTimeout(2000);
    
    // Get initial iframe URL
    const iframe1 = await page.getAttribute('iframe[title="Work Page Preview"]', 'src');
    console.log(`📍 Initial iframe URL: ${iframe1}`);
    
    // Click Exhibition tab
    console.log('🔄 Clicking Exhibition tab...');
    await page.click('button:text("Exhibition")');
    
    await page.waitForTimeout(2000);
    
    // Get updated iframe URL
    const iframe2 = await page.getAttribute('iframe[title="Work Page Preview"]', 'src');
    console.log(`📍 Updated iframe URL: ${iframe2}`);
    
    if (iframe2 && iframe2.includes('tab=exhibition')) {
      console.log('\n✨ Tab switching is working! 🎉');
    } else {
      console.log(`\n⚠️ Issue detected:`);
      console.log(`Expected: /work?tab=exhibition`);
      console.log(`Got: ${iframe2}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
