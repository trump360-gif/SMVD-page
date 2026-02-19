# Phase 6: Deployment - Comprehensive Plan

**Date:** 2026-02-19
**Status:** In Progress
**Estimated Duration:** 2 hours
**Priority:** High

---

## Overview

Phase 6 deployment covers the rollout of Tiptap WYSIWYG Editor implementation to staging and production environments. This phase ensures the system is production-ready before full rollout.

---

## Pre-Deployment Checklist (30 minutes)

### 1. Code Quality Verification ✅

- [x] TypeScript: 0 errors (`npx tsc --noEmit`)
- [x] Build: 57/57 pages generated (`npm run build`)
- [x] Tests: 31/31 passing (Phase 5 completed)
- [x] No console errors
- [x] All imports resolved
- [x] Git status: Clean (ready to commit)

### 2. Dependency Verification ✅

- [x] Tiptap packages installed (73 packages)
- [x] React 19 compatible
- [x] Next.js 15 compatible
- [x] TypeScript strict mode compliant

### 3. Database Preparation ✅

- [x] Prisma schema updated (no new models, just type field additions)
- [x] Migration script created (`migrate-markdown-to-tiptap.ts`)
- [x] Backward compatibility maintained

### 4. Configuration Review ✅

- [x] Environment variables set
- [x] Upload directory configured (`/uploads`)
- [x] WebP conversion enabled (sharp)
- [x] Image processing pipeline ready

---

## Deployment Strategy

### Strategy: Blue-Green Deployment

```
Current Production (BLUE)
         ↓
Deploy New Version (GREEN)
         ↓
Run Tests on GREEN
         ↓
Switch Traffic: BLUE → GREEN
         ↓
Monitor
```

**Advantages:**
- Zero downtime during deployment
- Quick rollback if issues
- Can test before switching traffic
- Current users unaffected during deployment

---

## Phase 6 Steps

### Step 1: Create Git Commit (10 min)

**Current Status:**
```bash
git status
# Changes: ~14 files modified/created
# Size: ~1,800 lines added
```

**Commit Command:**
```bash
git add -A
git commit -m "feat: Complete Tiptap WYSIWYG Editor implementation (Phases 1-5)

- Phase 1: Extended upload API with thumbnails and metadata
- Phase 2: Implemented TiptapEditor with 15 formatting buttons
- Phase 3: Integrated TiptapEditor into TextBlockEditor
- Phase 4: Created migration script for markdown→Tiptap conversion
- Phase 5: Comprehensive testing (31/31 tests passed)

Features:
- 15 formatting options (bold, italic, headings, lists, code, etc.)
- Image upload with WebP conversion
- Drag-and-drop support
- Keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+Z, etc.)
- Syntax highlighting for code blocks
- Full backward compatibility with markdown

Type Safety: 0 errors
Build: 57/57 pages
Tests: 31/31 passed ✅

Commits summary:
- 9 files created (~41.2KB)
- 6 files modified
- ~1,800 lines of code
- Migration script for lazy migration

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

### Step 2: Environment Setup (15 min)

**Local Development (Already Done):**
```bash
✅ Development server running
✅ Database configured (PostgreSQL)
✅ NextAuth configured
✅ File uploads enabled
```

**Staging Environment (Pre-requisite):**
```bash
# On staging server:
1. Clone repository
2. Install dependencies: npm install
3. Configure .env.staging:
   DATABASE_URL=<staging-db-url>
   NEXTAUTH_URL=https://staging.smvd.ac.kr
   NEXTAUTH_SECRET=<staging-secret>
4. Run migrations: npx prisma migrate deploy
5. Start server: npm run build && npm run start
```

**Production Environment (Pre-requisite):**
```bash
# On production server:
1. Same as staging
2. Configure .env.production:
   DATABASE_URL=<production-db-url>
   NEXTAUTH_URL=https://smvd.ac.kr
   NEXTAUTH_SECRET=<production-secret>
3. Verify SSL certificates
```

### Step 3: Staging Deployment (45 min)

**Deployment Command (Using Vercel):**
```bash
# Option A: Deploy to Vercel (Recommended for Next.js)
vercel --prod --env-file .env.staging

# Option B: Manual deployment to VPS
git push origin main  # assumes CI/CD configured
```

**Staging Verification:**
```bash
# 1. Check deployment status
curl https://staging.smvd.ac.kr -I
# Should return: HTTP 200

# 2. Verify pages render
curl https://staging.smvd.ac.kr/work/9 | grep "Studio Knot"
# Should find content

# 3. Verify API endpoints
curl https://staging.smvd.ac.kr/api/pages
# Should return: JSON with pages array

# 4. Test admin authentication
curl -X POST https://staging.smvd.ac.kr/api/auth/callback/credentials \
  -d '{"username":"admin@example.com","password":"..."}'
# Should return: session cookie

# 5. Verify TiptapEditor loads
curl https://staging.smvd.ac.kr/admin/dashboard/work | grep "TiptapEditor"
# Should find component script
```

**Staging Smoke Tests:**
```bash
✓ Homepage loads (HTTP 200)
✓ Work pages load (HTTP 200)
✓ News pages load (HTTP 200)
✓ About page loads (HTTP 200)
✓ Admin login works
✓ API endpoints respond
✓ Database queries succeed
```

**Sign-off:**
- [ ] All tests pass on staging
- [ ] Performance acceptable (<1s page load)
- [ ] No errors in logs
- [ ] Ready for production

### Step 4: Production Deployment (30 min)

**Pre-Production Checklist:**
- [ ] Backup database
- [ ] Backup current code
- [ ] Verify staging sign-off
- [ ] Have rollback plan ready

**Production Deployment:**

```bash
# 1. Final code verification
npm run build
npx tsc --noEmit

# 2. Deploy to production
vercel --prod  # or your deployment command

# 3. Monitor deployment
# Watch logs for errors:
# - Database connection issues
# - API failures
# - File upload issues
# - Authentication problems

# 4. Verify production
curl https://smvd.ac.kr -I
# Should return: HTTP 200
```

**Production Verification Checklist:**
- [ ] All pages load (HTTP 200)
- [ ] API endpoints functional
- [ ] Admin login works
- [ ] Database connected
- [ ] Images serving correctly
- [ ] No 5xx errors in logs
- [ ] Performance metrics normal

### Step 5: Post-Deployment Monitoring (30 min)

**Real-Time Monitoring:**
```bash
# Monitor error logs
tail -f /var/log/app/error.log | grep -i "error\|exception"

# Monitor API response times
curl -w "@curl-format.txt" -o /dev/null -s https://smvd.ac.kr/api/pages

# Monitor database connections
SELECT count(*) FROM pg_stat_activity;
```

**Key Metrics to Watch:**
| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Error rate | <0.1% | >0.5% |
| Page load time | <1s | >3s |
| API response time | <200ms | >500ms |
| Database connections | <20 | >50 |
| Uptime | 99.9% | <99% |

**First 24 Hours Checklist:**
- [ ] No critical errors in logs
- [ ] Performance metrics stable
- [ ] Users can log in
- [ ] Content renders correctly
- [ ] Images load properly
- [ ] No spike in error rate

---

## Rollback Plan

If critical issues occur:

### Immediate Rollback (Within 5 minutes)

```bash
# Option 1: Vercel rollback
vercel rollback

# Option 2: Git rollback
git revert HEAD
git push origin main

# Option 3: Manual restart with previous version
docker pull smvd:previous-tag
docker run -d smvd:previous-tag
```

### Database Rollback

```bash
# If migrations failed:
npx prisma migrate resolve --rolled-back <migration-name>

# Restore from backup:
pg_restore -d smvd_production <backup-file>
```

### Communication

- [ ] Notify development team
- [ ] Update status page
- [ ] Send incident report
- [ ] Schedule post-mortem

---

## Deployment Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Database migration fails | Low | High | Test migrations on staging first, backup DB |
| API compatibility break | Low | High | Comprehensive testing, gradual rollout |
| Performance degradation | Low | Medium | Load testing on staging, monitor metrics |
| Authentication issues | Very Low | High | Test admin login on staging, session verification |
| File upload failures | Low | Medium | Test image upload, verify permissions |
| TypeScript errors | Very Low | High | tsc check, build verification |

---

## Success Criteria

### ✅ Deployment Successful If:

1. **Code Quality**
   - [x] TypeScript: 0 errors
   - [x] Build: 57/57 pages
   - [x] Tests: 31/31 passing

2. **Staging Environment**
   - [ ] All endpoints respond (HTTP 200)
   - [ ] Admin login works
   - [ ] Content renders
   - [ ] No errors in logs

3. **Production Environment**
   - [ ] Zero downtime deployment
   - [ ] All users unaffected
   - [ ] Page load time <1s
   - [ ] Error rate <0.1%

4. **User Acceptance**
   - [ ] Stakeholders approve
   - [ ] No critical issues reported
   - [ ] Performance acceptable
   - [ ] Feature works as designed

### ❌ Deployment Failed If:

- [ ] TypeScript errors present
- [ ] Build fails
- [ ] Critical tests fail
- [ ] Database migration fails
- [ ] API endpoints down
- [ ] Authentication broken
- [ ] Performance unacceptable

---

## Deployment Schedule

**Phase 6 Timeline:**

| Step | Duration | Scheduled Time |
|------|----------|-----------------|
| Pre-deployment checklist | 30 min | 14:00-14:30 |
| Git commit | 10 min | 14:30-14:40 |
| Environment setup | 15 min | 14:40-14:55 |
| Staging deployment | 45 min | 14:55-15:40 |
| Production deployment | 30 min | 15:40-16:10 |
| Post-deployment monitoring | 30 min | 16:10-16:40 |
| **TOTAL** | **2.5 hours** | 14:00-16:40 |

---

## Deployment Commands Reference

### Quick Deploy (Vercel)

```bash
# Full deployment
npm run build
vercel --prod

# With environment variables
vercel --prod --env-file .env.production
```

### Quick Deploy (Docker)

```bash
# Build image
docker build -t smvd:latest .

# Push to registry
docker push smvd:latest

# Pull and run on server
docker pull smvd:latest
docker run -d -p 3000:3000 smvd:latest
```

### Verification Commands

```bash
# TypeScript check
npx tsc --noEmit

# Build check
npm run build

# Test run
npm run test

# Deployment status
curl -s https://smvd.ac.kr -I | head -10
```

---

## Documentation

### Deployment Runbook
- Create: `DEPLOYMENT_RUNBOOK.md` (step-by-step procedures)
- Include: Command line scripts, error handling, contact info

### Post-Deployment Report
- Template: `DEPLOYMENT_REPORT.md`
- Include: Timestamp, duration, issues, metrics, sign-off

---

## Next Steps After Phase 6

### Immediate (After successful deployment)
1. Monitor for 48 hours
2. Collect user feedback
3. Create deployment report

### Short-term (Week 1)
1. Run E2E tests in production
2. Performance profiling
3. Security audit

### Medium-term (If Phase 7/8 approved)
1. Implement auto-save draft feature
2. Build template system
3. Analytics enhancements

---

## Key Contacts & Resources

```
Deployment Lead: Claude Agent
Tech Lead: [Your Team]
Database Admin: [Your Team]
Operations: [Your Team]

Staging URL: https://staging.smvd.ac.kr
Production URL: https://smvd.ac.kr
Repository: https://github.com/your-org/smvd-cms
Issues: [Link to issue tracker]
```

---

## Summary

Phase 6 deployment involves:
1. ✅ Code quality verification (complete)
2. ⏳ Git commit (pending)
3. ⏳ Staging deployment (pending)
4. ⏳ Production deployment (pending)
5. ⏳ Post-deployment monitoring (pending)

**Estimated Total Duration:** 2-2.5 hours

**Status:** 🟡 READY TO DEPLOY

Next: Execute deployment steps 1-5 and report results.

---

**Plan Generated:** 2026-02-19 02:35 UTC
**Ready for:** Production deployment
**Risk Level:** Low (comprehensive testing completed)
