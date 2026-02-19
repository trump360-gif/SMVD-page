# Phase 5: Testing & Validation - Comprehensive Test Plan

**Date:** 2026-02-19
**Status:** In Progress
**Duration:** 6 hours estimated

---

## 1. Test Scope

### 1.1 Components to Test
- ✓ TiptapEditor component (WYSIWYG editor)
- ✓ TextBlockEditor integration (TextBlock using Tiptap)
- ✓ Backward compatibility (markdown content rendering)
- ✓ Public page renderers (Work, News detail pages)
- ✓ Type safety (TypeScript compilation)
- ✓ API endpoints (upload, content save)

### 1.2 Test Categories
1. **Unit Tests** - Component rendering, hooks
2. **Integration Tests** - Editor → TextBlock → Public page
3. **Backward Compatibility Tests** - Markdown content rendering
4. **Edge Cases** - Long content, special characters, CJK text
5. **Browser Compatibility** - Chrome, Firefox, Safari, Edge
6. **API Tests** - Upload, content save, migration

---

## 2. Test Cases

### 2.1 TextBlock Editor Tests

#### TC-2.1.1: TextBlock Editor UI Renders
- **Precondition:** Admin logged in, Work project opened
- **Steps:**
  1. Navigate to Admin → Work CMS
  2. Open any project's TextBlock editor
  3. Verify TiptapEditor component loads
- **Expected:** TiptapEditor component visible with toolbar and 15 buttons
- **Status:** ⏳ Pending

#### TC-2.1.2: Markdown Content Loads in TiptapEditor
- **Precondition:** Existing markdown content in TextBlock
- **Steps:**
  1. Open Work project with markdown content
  2. Click TextBlock to edit
  3. Verify TiptapEditor shows markdown converted to formatted text
- **Expected:** Markdown syntax (# H1, **bold**, etc.) converted to visual formatting
- **Status:** ⏳ Pending

#### TC-2.1.3: Toolbar Buttons Work
- **Precondition:** TextBlock editor open
- **Steps:**
  1. Select text
  2. Click Bold button
  3. Click Italic button
  4. Click H1 button
  5. Click Bullet List button
- **Expected:** All formatting applied visually
- **Status:** ⏳ Pending

#### TC-2.1.4: Image Upload Works
- **Precondition:** TextBlock editor open
- **Steps:**
  1. Click Image button
  2. Select image file from system
  3. Wait for upload
- **Expected:** Image appears in editor, converted to WebP in `/uploads`
- **Status:** ⏳ Pending

#### TC-2.1.5: Undo/Redo Works
- **Precondition:** TextBlock editor open with content
- **Steps:**
  1. Make changes (add text, format)
  2. Press Ctrl+Z (Undo)
  3. Press Ctrl+Y (Redo)
- **Expected:** Changes undo/redo correctly
- **Status:** ⏳ Pending

### 2.2 Backward Compatibility Tests

#### TC-2.2.1: Public Page Renders Markdown Content
- **Precondition:** Work project with markdown TextBlock exists
- **Steps:**
  1. Navigate to public /work/[id] page
  2. Verify TextBlock content displays
  3. Check formatting (headings, bold, lists, etc.) renders
- **Expected:** Markdown content renders identically to before
- **Status:** ⏳ Pending

#### TC-2.2.2: Public Page Renders Tiptap JSON Content
- **Precondition:** TextBlock with Tiptap JSON format saved
- **Steps:**
  1. Create/edit TextBlock with Tiptap editor
  2. Save
  3. Navigate to public page
  4. Verify content displays correctly
- **Expected:** Tiptap JSON converted to plain text and rendered with ReactMarkdown
- **Status:** ⏳ Pending

#### TC-2.2.3: Mixed Markdown & Tiptap Content Works
- **Precondition:** Project has both markdown and Tiptap TextBlocks
- **Steps:**
  1. Navigate to public page
  2. Verify both types render correctly
- **Expected:** No errors, both formats display properly
- **Status:** ⏳ Pending

### 2.3 Edge Case Tests

#### TC-2.3.1: Long Content (>10,000 words)
- **Precondition:** Create TextBlock with large markdown
- **Steps:**
  1. Paste >10,000 word markdown into Tiptap editor
  2. Save
  3. Check public page rendering
  4. Monitor performance
- **Expected:** Content loads without lag, renders correctly
- **Status:** ⏳ Pending

#### TC-2.3.2: Special Characters (Emoji, CJK)
- **Precondition:** TextBlock with special characters
- **Steps:**
  1. Add emoji (🎨🌟), Korean text (한글), Chinese text (中文)
  2. Save
  3. Check public page
- **Expected:** All characters display correctly
- **Status:** ⏳ Pending

#### TC-2.3.3: Copy-Paste from External Sources
- **Precondition:** TextBlock editor open
- **Steps:**
  1. Copy formatted HTML from web page
  2. Paste into Tiptap editor
  3. Save
  4. Check public page
- **Expected:** Content sanitized, rendered correctly
- **Status:** ⏳ Pending

#### TC-2.3.4: Very Long Headings & Titles
- **Precondition:** TextBlock with long heading
- **Steps:**
  1. Add heading with 100+ characters
  2. Save and check rendering
- **Expected:** Text wraps correctly, no layout break
- **Status:** ⏳ Pending

### 2.4 API Tests

#### TC-2.4.1: Upload API Returns Correct Response
- **Precondition:** Image file ready
- **Steps:**
  1. POST to `/api/admin/upload` with image
  2. Verify response includes: path, width, height, mimeType, size
- **Expected:** HTTP 200, response has all required fields
- **Status:** ⏳ Pending

#### TC-2.4.2: Content Save API Accepts Tiptap JSON
- **Precondition:** TextBlock with Tiptap content
- **Steps:**
  1. POST to `/api/admin/work/projects/[id]` with Tiptap JSON content
  2. Verify save succeeds
- **Expected:** HTTP 200/201, content saved in DB
- **Status:** ⏳ Pending

#### TC-2.4.3: Migration Script --dry-run Works
- **Precondition:** Migration script ready
- **Steps:**
  1. Run: `npx ts-node scripts/migrate-markdown-to-tiptap.ts --dry-run`
  2. Verify output shows statistics
  3. Confirm no changes made
- **Expected:** Summary printed, no DB changes
- **Status:** ⏳ Pending

### 2.5 Type Safety Tests

#### TC-2.5.1: TypeScript Compilation (Zero Errors)
- **Precondition:** All code changes complete
- **Steps:**
  1. Run: `npx tsc --noEmit`
  2. Check for errors
- **Expected:** 0 TypeScript errors
- **Status:** ⏳ Pending

#### TC-2.5.2: Build Success (All Pages Generate)
- **Precondition:** TypeScript check passes
- **Steps:**
  1. Run: `npm run build`
  2. Count generated pages
- **Expected:** 57/57 pages generated, build succeeds
- **Status:** ⏳ Pending

### 2.6 Browser Compatibility Tests

#### TC-2.6.1: Chrome/Chromium (Latest)
- **Precondition:** App running
- **Steps:**
  1. Open App in Chrome
  2. Test TextBlock editor
  3. Test public pages
- **Expected:** All features work correctly
- **Status:** ⏳ Pending

#### TC-2.6.2: Firefox (Latest)
- **Precondition:** App running
- **Steps:**
  1. Open App in Firefox
  2. Test TextBlock editor
  3. Test public pages
- **Expected:** All features work correctly
- **Status:** ⏳ Pending

#### TC-2.6.3: Safari (Latest)
- **Precondition:** App running
- **Steps:**
  1. Open App in Safari
  2. Test TextBlock editor
  3. Test public pages
- **Expected:** All features work correctly
- **Status:** ⏳ Pending

---

## 3. Test Results Summary

| Test Category | Total | Passed | Failed | Status |
|---|---|---|---|---|
| TextBlock Editor | 5 | 0 | 0 | ⏳ |
| Backward Compatibility | 3 | 0 | 0 | ⏳ |
| Edge Cases | 4 | 0 | 0 | ⏳ |
| API Endpoints | 3 | 0 | 0 | ⏳ |
| Type Safety | 2 | 0 | 0 | ⏳ |
| Browser Compatibility | 3 | 0 | 0 | ⏳ |
| **TOTAL** | **20** | **0** | **0** | ⏳ |

---

## 4. Known Issues & Mitigations

### Known Issue 1: iframe Caching
- **Description:** iframe might cache old content on reload
- **Mitigation:** Use useRef to force src reload: `iframeRef.current.src = iframeRef.current.src`
- **Status:** Already implemented in HomeEditor

### Known Issue 2: Markdown Conversion Edge Cases
- **Description:** Some markdown syntax might not convert perfectly to Tiptap JSON
- **Mitigation:** Use lazy migration strategy (content converts on first edit)
- **Status:** Implemented in TextBlockEditor

### Known Issue 3: XSS with Copy-Paste
- **Description:** User might paste malicious HTML
- **Mitigation:** DOMPurify sanitization in renderers
- **Status:** Already implemented in sanitize.ts

---

## 5. Test Execution

**Phase 5A: Automated Tests (1 hour)**
1. ✅ TypeScript compilation (zero errors)
2. ✅ Production build (57 pages)
3. API endpoint tests (curl)

**Phase 5B: Manual Testing (3 hours)**
1. ⏳ Admin CMS TextBlock editor
2. ⏳ Public page rendering
3. ⏳ Image upload functionality
4. ⏳ Backward compatibility check

**Phase 5C: Edge Cases & Performance (1.5 hours)**
1. ⏳ Long content rendering
2. ⏳ Special characters handling
3. ⏳ Copy-paste HTML handling
4. ⏳ Performance monitoring

**Phase 5D: Browser Testing (0.5 hours)**
1. ⏳ Chrome
2. ⏳ Firefox
3. ⏳ Safari

---

## 6. Pass/Fail Criteria

### ✅ **PASS** Conditions (All Must Be Met)
- [ ] TypeScript: 0 errors
- [ ] Build: 57/57 pages generated
- [ ] TextBlock editor loads without errors
- [ ] Markdown content renders correctly on public pages
- [ ] Tiptap JSON content renders correctly on public pages
- [ ] Image upload works (WebP conversion)
- [ ] All 15 toolbar buttons functional
- [ ] Undo/Redo works
- [ ] No console errors during testing
- [ ] Public pages HTTP 200 status

### ❌ **FAIL** Conditions (Any One Fails = FAIL Phase 5)
- [ ] TypeScript errors found
- [ ] Build fails
- [ ] TextBlock editor crashes
- [ ] Markdown content not rendering
- [ ] Image upload fails
- [ ] Performance issues (<1s load time exceeded)
- [ ] Console errors observed

---

## Next Steps After Phase 5

✅ Phase 5 Validation → Phase 6 Deployment
✅ Phase 6 Deployment → Phase 7 Auto-save (OPTIONAL)
✅ Phase 7 Auto-save → Phase 8 Templates (OPTIONAL)

---

**Report Generated:** 2026-02-19
**Executed By:** Claude Agent
**Status:** 🟡 TESTING IN PROGRESS
