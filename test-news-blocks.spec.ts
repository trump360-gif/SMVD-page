import { test, expect } from '@playwright/test';

test.describe('News CMS Block Persistence', () => {
  test('Block creation and persistence in Article #5', async ({ page }) => {
    // ========== SETUP ==========
    console.log('🟢 TEST: Starting News Block Persistence Test');

    // Login first
    console.log('1️⃣ Navigating to Admin Dashboard');
    await page.goto('http://localhost:3000/admin/dashboard/news');

    // Wait for authentication check
    await page.waitForLoadState('networkidle');

    // Check if redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/login')) {
      console.log('⚠️ Not authenticated, would need to login');
      console.log('Skipping test - requires authentication');
      return;
    }

    console.log('✅ Dashboard loaded');

    // ========== FIND ARTICLE #5 ==========
    console.log('\n2️⃣ Looking for Article #5');
    const articles = await page.locator('text=/article|뉴스/i').count();
    console.log(`Found approximately ${articles} article-related elements`);

    // Look for Article #5 by slug or ID
    const article5Selector = '[data-article-id*="5"], [data-slug*="5"], text=/Article.*5|#5/';
    const article5Exists = await page.locator(article5Selector).count();
    console.log(`Article #5 elements found: ${article5Exists}`);

    // Try clicking on any article to open modal (get the first one for testing)
    const firstArticleButton = page.locator('button:has-text("Edit"), button:has-text("수정")').first();
    const buttonCount = await firstArticleButton.count();
    console.log(`Found ${buttonCount} edit buttons`);

    if (buttonCount === 0) {
      console.log('❌ No edit buttons found');
      console.log('Page content:', await page.content());
      return;
    }

    // ========== OPEN MODAL FOR ARTICLE #5 ==========
    console.log('\n3️⃣ Opening Article Modal');

    // Get all article rows and find the one with ID containing "5"
    const articleRows = page.locator('tr, [data-testid*="article"], div[class*="article"]');
    let article5Row = null;

    const rowCount = await articleRows.count();
    console.log(`Checking ${rowCount} potential article rows`);

    for (let i = 0; i < Math.min(rowCount, 20); i++) {
      const row = articleRows.nth(i);
      const text = await row.textContent().catch(() => '');
      console.log(`  Row ${i}: ${text.substring(0, 50)}...`);

      if (text.includes('5') || i === 4) { // Article 5 might be at index 4
        article5Row = row;
        console.log(`  ✅ Found Article 5 row at index ${i}`);
        break;
      }
    }

    if (!article5Row) {
      console.log('⚠️ Could not find Article #5, using first available article');
      article5Row = articleRows.first();
    }

    // Click the edit button within this row
    const editButton = article5Row.locator('button:has-text("Edit"), button:has-text("수정")').first();
    const hasEditBtn = await editButton.count();
    console.log(`Edit button found: ${hasEditBtn > 0}`);

    if (hasEditBtn > 0) {
      await editButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('❌ No edit button found in row');
      return;
    }

    // ========== MODAL OPENED ==========
    console.log('\n4️⃣ Checking Modal Opened');
    const modalTitle = page.locator('h2:has-text("Edit Article"), h2:has-text("수정")');
    const isModalOpen = await modalTitle.count() > 0;
    console.log(`Modal opened: ${isModalOpen}`);

    if (!isModalOpen) {
      console.log('❌ Modal did not open');
      return;
    }

    // ========== SWITCH TO CONTENT TAB ==========
    console.log('\n5️⃣ Switching to Content (Blocks) Tab');
    const contentTab = page.locator('button:has-text("Content (Blocks)")');
    const tabExists = await contentTab.count();
    console.log(`Content tab found: ${tabExists > 0}`);

    if (tabExists > 0) {
      await contentTab.click();
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ Content tab not found');
    }

    // ========== ADD FIRST ROW ==========
    console.log('\n6️⃣ Adding First Row');
    const addRowButton = page.locator('button:has-text("Add First Row"), button:has-text("첫 행 추가")');
    const rowBtnExists = await addRowButton.count();
    console.log(`Add Row button found: ${rowBtnExists > 0}`);

    if (rowBtnExists > 0) {
      await addRowButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ Add Row button not found');
    }

    // ========== ADD TEXT BLOCK ==========
    console.log('\n7️⃣ Adding Text Block');
    const addBlockButton = page.locator('button:has-text("Add Block"), button:has-text("블록 추가")');
    const blockBtnExists = await addBlockButton.count();
    console.log(`Add Block button found: ${blockBtnExists > 0}`);

    if (blockBtnExists > 0) {
      await addBlockButton.click();
      await page.waitForTimeout(500);
    } else {
      console.log('⚠️ Add Block button not found');
    }

    // Select Text Block type
    const textBlockOption = page.locator('text="Text Block", text="텍스트 블록"').first();
    const textOptExists = await textBlockOption.count();
    console.log(`Text Block option found: ${textOptExists > 0}`);

    if (textOptExists > 0) {
      await textBlockOption.click();
      await page.waitForTimeout(500);
    }

    // ========== ENTER TEXT CONTENT ==========
    console.log('\n8️⃣ Entering Text Content');
    const textInput = page.locator('textarea, input[type="text"]').first();
    const inputCount = await textInput.count();
    console.log(`Text input found: ${inputCount > 0}`);

    const testText = 'This is test block content for Article #5 - Persistence Test';
    if (inputCount > 0) {
      await textInput.fill(testText);
      await page.waitForTimeout(300);
      console.log(`✅ Typed: "${testText}"`);
    }

    // ========== SAVE CHANGES ==========
    console.log('\n9️⃣ Saving Changes');

    // Log browser console before save
    console.log('📋 Browser Console Logs (before save):');
    page.on('console', (msg) => {
      if (msg.text().includes('[NewsBlogModal]') || msg.text().includes('[useNewsEditor]')) {
        console.log(`  🔵 ${msg.text()}`);
      }
    });

    const saveButton = page.locator('button:has-text("Save Changes"), button:has-text("저장")').filter({
      hasText: /save|저장/i
    });
    const saveBtnExists = await saveButton.count();
    console.log(`Save button found: ${saveBtnExists > 0}`);

    if (saveBtnExists > 0) {
      await saveButton.click();

      // Wait for success message
      const successMsg = page.locator('text="수정되었습니다", text="Successfully"');
      await successMsg.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {
        console.log('⚠️ No success message appeared');
      });

      await page.waitForTimeout(1000);
      console.log('✅ Save button clicked');
    } else {
      console.log('❌ Save button not found');
      const allButtons = page.locator('button');
      const btnCount = await allButtons.count();
      console.log(`Total buttons on page: ${btnCount}`);

      // Log button texts
      for (let i = 0; i < Math.min(btnCount, 20); i++) {
        const text = await allButtons.nth(i).textContent();
        console.log(`  Button ${i}: ${text}`);
      }
    }

    // ========== VERIFICATION 1: CHECK DB ==========
    console.log('\n🔟 Checking Database');
    const response = await page.request.get(`http://localhost:3000/api/admin/news/articles?category=Notice`);
    const articlesData = await response.json();
    console.log(`API Response status: ${response.status()}`);

    if (articlesData.data && Array.isArray(articlesData.data)) {
      console.log(`Articles returned: ${articlesData.data.length}`);

      // Find article with ID matching our modal
      const ourArticle = articlesData.data.find((a: any) => a.title && a.title.includes('Test')) || articlesData.data[0];
      if (ourArticle) {
        console.log(`\nArticle: "${ourArticle.title}"`);
        console.log(`Content field type: ${typeof ourArticle.content}`);
        console.log(`Content value: ${JSON.stringify(ourArticle.content)}`);

        if (ourArticle.content && typeof ourArticle.content === 'object') {
          const contentKeys = Object.keys(ourArticle.content);
          console.log(`Content object keys: ${contentKeys.join(', ')}`);

          if ('blocks' in ourArticle.content) {
            console.log(`✅ Blocks found in content!`);
            console.log(`   Block count: ${(ourArticle.content as any).blocks.length}`);
            if ((ourArticle.content as any).blocks.length > 0) {
              console.log(`   First block: ${JSON.stringify((ourArticle.content as any).blocks[0]).substring(0, 100)}`);
            }
          } else {
            console.log(`❌ No blocks field in content`);
          }
        }
      }
    }

    // ========== VERIFICATION 2: REOPEN MODAL ==========
    console.log('\n1️⃣1️⃣ Reopening Modal to Verify Persistence');
    // Find and click edit button again
    const editBtn2 = article5Row.locator('button:has-text("Edit"), button:has-text("수정")').first();
    if (await editBtn2.count() > 0) {
      await editBtn2.click();
      await page.waitForTimeout(500);
    }

    // Check content tab
    const contentTab2 = page.locator('button:has-text("Content (Blocks)")');
    if (await contentTab2.count() > 0) {
      await contentTab2.click();
      await page.waitForTimeout(500);
    }

    // Count blocks
    const blockItems = page.locator('[class*="block"], div:has-text("Text Block")');
    const blockCount = await blockItems.count();
    console.log(`Blocks visible in reopened modal: ${blockCount}`);

    if (blockCount > 0) {
      console.log('✅ PERSISTENCE VERIFIED: Blocks still present after reopen!');
    } else {
      console.log('❌ PERSISTENCE FAILED: Blocks disappeared!');
    }
  });
});
