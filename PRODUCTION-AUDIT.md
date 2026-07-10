# Production Security & Bug Audit Report

**Project:** MOSAI Website (Next.js 16 + Payload CMS 3.85)  
**Date:** July 8, 2026  
**Auditor:** Kiro AI  
**Scope:** Security vulnerabilities, bugs, misconfigurations, and data exposure risks

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 5 |
| HIGH     | 8 |
| MEDIUM   | 9 |
| LOW      | 7 |

---

## CRITICAL Severity

### 1. Stored XSS via dangerouslySetInnerHTML with CMS Content

**Files:**
- `src/blocks/FlexibleRow/Component.tsx` (line 371)
- `src/blocks/Hero/Component.tsx` (line 119)

**Issue:** Raw HTML from CMS fields (`block.html`, `slide.dataVizEmbed`) is rendered directly into the DOM without any sanitization. If any CMS editor account is compromised (or a lower-privilege editor injects malicious content), arbitrary JavaScript executes in every visitor's browser.

```tsx
// FlexibleRow - renders arbitrary HTML from CMS
dangerouslySetInnerHTML={{ __html: block.html }}

// Hero - renders arbitrary embed code
dangerouslySetInnerHTML={{ __html: slide.dataVizEmbed }}
```

**Impact:** Session hijacking, credential theft, defacement, redirects to malicious sites.  
**Fix:** Sanitize all CMS HTML output using DOMPurify before rendering. Only allow safe HTML tags/attributes.

---

### 2. No Security Headers (Missing CSP, HSTS, X-Frame-Options)

**File:** `next.config.ts`

**Issue:** No security headers are configured anywhere in the application. There is no `middleware.ts` file, no `headers()` configuration in `next.config.ts`, and no CSP (Content-Security-Policy) defined.

**Missing headers:**
- `Content-Security-Policy` - Allows inline scripts, third-party script injection
- `Strict-Transport-Security` - No HSTS, vulnerable to SSL stripping
- `X-Frame-Options` / `frame-ancestors` - Site can be framed (clickjacking)
- `X-Content-Type-Options` - MIME type sniffing possible
- `Referrer-Policy` - May leak sensitive URL paths
- `Permissions-Policy` - No restriction on browser features

**Impact:** The site is vulnerable to clickjacking, XSS amplification (no CSP), protocol downgrade attacks, and MIME confusion.  
**Fix:** Add a `middleware.ts` or `headers()` config in `next.config.ts` setting all standard security headers.

---

### 3. Members Collection Exposes PII via REST/GraphQL API

**File:** `src/collections/Members.ts`

**Issue:** The Members collection has `read: anyone` (fully public) access. While the frontend page (`src/app/(frontend)/members/page.tsx`) filters by `isPublic: true`, the raw Payload REST API (`/api/members`) and GraphQL endpoint return ALL member records including those with `isPublic: false`.

Exposed sensitive fields for ALL members:
- `email` (personal email addresses)
- `phone` (personal phone numbers)
- `presentAddress` (home addresses)
- `city`, `university`, `specialisation`

**Impact:** Full data breach of member PII. Violates privacy regulations (GDPR, India DPDP Act). Anyone can query `/api/members` and extract all data.  
**Fix:** Change `read` access to filter by `isPublic` at the collection level:
```ts
read: ({ req: { user } }) => {
  if (user) return true // Authenticated users see all
  return { isPublic: { equals: true } } // Public only sees public members
}
```

---

### 4. Weak PAYLOAD_SECRET in Production .env

**File:** `.env`

**Issue:** `PAYLOAD_SECRET=5e0eaaa7d6b9c38b905ccc0e` is only 24 hex characters (96 bits of entropy). This secret is used to sign JWT tokens. A weak secret can be brute-forced, allowing JWT forgery and full admin access.

Additionally, `CRON_SECRET=YOUR_CRON_SECRET_HERE` and `PREVIEW_SECRET=YOUR_SECRET_HERE` are still set to placeholder values.

**Impact:** JWT token forgery leading to complete admin takeover. Cron and preview endpoints essentially unprotected.  
**Fix:** Generate a cryptographically strong secret (minimum 256 bits / 64 hex chars) using `openssl rand -hex 32`. Replace all placeholder secrets with unique, strong values.

---

### 5. Database Seed Route Accessible in Production

**File:** `src/app/(frontend)/next/seed/route.ts`

**Issue:** The seed endpoint is a POST route that, while requiring authentication, will **wipe all collections** (media, pages, news, gallery, events, services, committee) and recreate them with test data. Any authenticated user (even a viewer) can trigger this because the only check is `if (!user)`.

The seed also creates a superAdmin user with hardcoded credentials:
```ts
email: 'admin@mosai.org.in'
password: 'password123'
```

**Impact:** Complete data destruction by any authenticated user. Known credentials could grant superAdmin access if the seed was ever triggered.  
**Fix:** Remove this route entirely before production deployment, or gate it behind `process.env.NODE_ENV !== 'production'` AND a superAdmin role check.

---

## HIGH Severity

### 6. No CSRF Protection Configured

**File:** `src/payload.config.ts`

**Issue:** The Payload configuration does not include a `csrf` array. While Payload has some built-in CSRF protection via SameSite cookies, explicitly configuring allowed origins for CSRF is a defense-in-depth requirement.

```ts
// Missing from payload.config.ts:
csrf: [getServerSideURL()].filter(Boolean),
```

**Impact:** Cross-site request forgery attacks against authenticated admin users could modify content, create users, or delete data.  
**Fix:** Add `csrf: [getServerSideURL()].filter(Boolean)` to the Payload config.

---

### 7. Unrestricted Public File Upload via Job Applications

**File:** `src/collections/JobApplications.ts`

**Issue:** The `create` access is set to `() => true` (fully public, no authentication required). This collection accepts file uploads (resume field linked to Media collection). The Media collection accepts `image/*`, `application/pdf`, and `video/*` MIME types with no file size limit configured.

**Impact:**
- Denial of Service: Attackers can upload massive files to exhaust disk space
- Storage abuse: Free file hosting for malicious content
- Potential malware distribution via uploaded files
- No rate limiting means automated abuse is trivial

**Fix:**
- Add rate limiting (e.g., IP-based throttling)
- Configure `upload.staticDir` with maxSize limits in the Media collection
- Add CAPTCHA or honeypot validation for public form submissions
- Restrict resume uploads to PDF only with a size limit

---

### 8. No Rate Limiting on Any Endpoint

**Issue:** No rate limiting is implemented anywhere in the application. There is no middleware, no third-party rate limiting package, and no Payload plugin for throttling.

**Affected endpoints:**
- `/api/users/login` - Brute force attacks on admin credentials
- `/api/job-applications` - Spam/abuse of public create endpoint
- `/api/form-submissions` - Form spam
- Preview route - Secret enumeration
- All API endpoints - DDoS amplification

**Impact:** Brute force attacks, credential stuffing, form spam, and resource exhaustion.  
**Fix:** Implement rate limiting via middleware (e.g., `next-rate-limit`, Cloudflare, or a reverse proxy like nginx).

---

### 9. Open Redirect in Preview Route

**File:** `src/app/(frontend)/next/preview/route.ts`

**Issue:** The preview route accepts a `path` parameter and only validates that it starts with `/`. However, paths like `//evil.com` or `/\evil.com` can be interpreted as protocol-relative URLs by browsers, leading to open redirect.

```ts
if (!path.startsWith('/')) {
  return new Response('This endpoint can only be used for relative previews', { status: 500 })
}
// ... later:
redirect(path) // Could redirect to //evil.com
```

**Impact:** Phishing attacks using the legitimate domain as a redirect vector.  
**Fix:** Validate that the path does not start with `//` and does not contain backslashes. Use a stricter regex like `/^\/[a-zA-Z0-9]/.test(path)`.

---

### 10. XSS via Dynamic CSS Injection in Layout

**File:** `src/app/(frontend)/layout.tsx` (lines 109-132)

**Issue:** Admin-defined color values from SiteSettings are injected directly into a `<style>` tag via `dangerouslySetInnerHTML`. If a superAdmin account is compromised, or if there's an API vulnerability allowing settings modification, an attacker could inject arbitrary CSS/JS:

```ts
dangerouslySetInnerHTML={{
  __html: `
    :root {
      --brand-red: ${primaryColor};  // If this contains: "; } </style><script>alert(1)</script><style>
      ...
    }
  `,
}}
```

**Impact:** XSS via CSS injection if color values aren't validated.  
**Fix:** Validate all color values against a strict hex/rgb regex pattern before rendering. Use CSS custom property APIs instead of string interpolation.

---

### 11. Exit Preview Route Has No Authentication

**File:** `src/app/(frontend)/next/exit-preview/route.ts`

**Issue:** The exit-preview route disables draft mode without any authentication check:
```ts
export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
```

While the impact is low (it only disables draft mode), it means anyone can disable draft mode for any session by visiting this URL. More critically, this pattern shows missing auth checks on API routes.

**Impact:** Minor disruption to content editors using live preview.  
**Fix:** Add authentication check or at minimum validate the request origin.

---

### 12. Docker Compose Exposes Database Port Publicly

**File:** `docker-compose.yml`

**Issue:** MongoDB port 27017 is mapped to the host (`ports: '27017:27017'`). Additionally, the docker-compose references MongoDB while the actual application uses PostgreSQL (mismatch). If this file is used in production, the database would be publicly accessible.

```yaml
mongo:
  image: mongo:latest
  ports:
    - '27017:27017'  # Publicly accessible!
```

**Impact:** Direct database access from the internet, potential data exfiltration or manipulation.  
**Fix:** Remove port mapping or restrict to localhost (`127.0.0.1:27017:27017`). Update docker-compose to use PostgreSQL to match the actual application config.

---

### 13. Database Password Exposed in .env

**File:** `.env`

**Issue:** The database connection string contains a trivial password:
```
DATABASE_URL=postgresql://postgres:123@localhost:5432/mosai_fresh
```

The password `123` is extremely weak and the username is the default `postgres` superuser.

**Impact:** If the database is network-accessible, trivial credential guessing gives full database access.  
**Fix:** Use a strong, unique password. Never use the `postgres` superuser for application connections; create a dedicated role with minimal required permissions.

---

## MEDIUM Severity

### 14. NEXT_PUBLIC_SERVER_URL Set to localhost

**File:** `.env`

**Issue:** `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` - This value is embedded in the client bundle and used for API calls, sitemap generation, and canonical URLs.

**Impact:** Broken API calls in production, incorrect sitemap URLs, SEO issues, and potentially exposing internal network topology.  
**Fix:** Set this to the actual production domain before deployment.

---

### 15. No Input Validation on CMS Content Fields

**Issue:** There is no server-side validation (zod, yup, or custom Payload validators) on fields that accept HTML content, embed URLs, or iframe sources. The only validation found is for URL fields in the Lexical editor.

**Affected fields:**
- `dataVizEmbed` (Hero block) - accepts raw HTML
- `html` (FlexibleRow embedType) - accepts raw HTML  
- `iframeUrl` (FlexibleRow) - accepts arbitrary URLs

**Impact:** Stored XSS, iframe injection to malicious sites, content injection.  
**Fix:** Add field-level `validate` hooks to sanitize HTML and validate URLs against an allowlist.

---

### 16. No File Size Limit on Media Uploads

**File:** `src/collections/Media.ts`

**Issue:** The Media upload configuration accepts `image/*`, `application/pdf`, and `video/*` MIME types but defines no `staticDir` size limits or per-file size restrictions.

**Impact:** Disk exhaustion via large file uploads (especially video). A single video upload could be multiple gigabytes.  
**Fix:** Add `filesizeLimit` to the upload config (e.g., 10MB for images, 50MB for videos).

---

### 17. SiteSettings Global Readable by Anyone

**File:** `src/globals/SiteSettings.ts`

**Issue:** `read: publicAccess` exposes the entire site configuration via `/api/globals/site-settings`. This includes theme configuration, font choices, popup notification content, and potentially any future sensitive settings added to this global.

**Impact:** Information disclosure. While current fields are mostly cosmetic, future additions could leak sensitive configuration.  
**Fix:** Create a specific `publicFields` access control or separate public settings from admin-only settings.

---

### 18. Form Builder Plugin - No Spam Protection

**File:** `src/plugins/index.ts`

**Issue:** The `formBuilderPlugin` is configured without any spam protection (no CAPTCHA, no honeypot field, no rate limiting). Form submissions go directly to the `form-submissions` collection.

**Impact:** Form spam, database pollution, potential email relay abuse if forms trigger email notifications.  
**Fix:** Add a honeypot field, implement reCAPTCHA/hCaptcha, or add custom beforeChange hooks with spam detection.

---

### 19. Missing `alt` Text Requirement on Media

**File:** `src/collections/Media.ts`

**Issue:** The `alt` field has `required: false`. While an admin description mentions accessibility, it's not enforced.

**Impact:** Accessibility (WCAG) non-compliance. Screen readers cannot describe images without alt text.  
**Fix:** Make `alt` required, or add a beforeValidate hook that requires it for image MIME types.

---

### 20. Image Quality Set to 100%

**File:** `next.config.ts`

**Issue:** `qualities: [100]` forces all Next.js optimized images to maximum quality.

**Impact:** Significantly larger image file sizes, slower page loads, higher bandwidth costs. This is especially impactful given the 853 media files in `public/media/`.  
**Fix:** Use quality values between 75-85 for a good balance of quality and performance.

---

### 21. No Error Boundary Implementation

**Issue:** No React Error Boundaries are implemented in the frontend. If any component throws during render, the entire page crashes with a Next.js error screen that may expose internal file paths in development mode.

**Impact:** Poor user experience, potential information disclosure.  
**Fix:** Add `error.tsx` files in route segments and wrap client components with Error Boundaries.

---

### 22. GraphQL Introspection Likely Enabled

**Issue:** Payload CMS exposes a GraphQL endpoint at `/api/graphql`. By default in Payload 3.x, GraphQL introspection is enabled. This allows attackers to enumerate the entire schema including all collections, fields, and relationships.

**Impact:** Full schema discovery aids targeted attacks. Reveals field names, relationships, and access patterns.  
**Fix:** Disable GraphQL introspection in production via Payload config: `graphQL: { disable: true }` or disable introspection specifically.

---

## LOW Severity

### 23. Docker Compose Uses Outdated MongoDB (Application Uses PostgreSQL)

**File:** `docker-compose.yml`

**Issue:** The docker-compose file references `mongo:latest` but the application is configured to use PostgreSQL (`@payloadcms/db-postgres`). This file is stale and could confuse deployment.

**Fix:** Either remove the docker-compose file or update it to use PostgreSQL matching the production setup.

---

### 24. `password123` Hardcoded in Seed Script

**File:** `src/endpoints/seed/index.ts` (line 56)

**Issue:** The seed script creates a superAdmin with password `password123`. Even if the seed route is protected, this credential exists in the git history.

**Fix:** Remove hardcoded credentials. Use environment variables for seed user creation.

---

### 25. Missing `robots.txt` Restrictive Rules for API

**File:** `public/robots.txt`

**Issue:** Without explicit disallow rules for `/api/`, `/admin/`, and other sensitive paths, search engines may index API responses and the admin panel login page.

**Fix:** Add disallow rules:
```
User-agent: *
Disallow: /api/
Disallow: /admin/
Disallow: /next/
```

---

### 26. No Cookie Security Configuration Verified

**Issue:** Payload uses JWT tokens stored in cookies. Without explicit `httpOnly`, `secure`, and `SameSite=strict` configuration in Payload's auth settings, cookies may be vulnerable to JavaScript access or cross-site attacks.

**Fix:** Verify that Payload's default cookie settings include `httpOnly: true`, `secure: true` (in production), and appropriate SameSite settings.

---

### 27. TypeScript Strict Mode Configuration

**Issue:** Multiple instances of `as any` type assertions in access control functions (`src/access/roles.ts`) bypass TypeScript's type safety, potentially hiding bugs:

```ts
export const isSuperAdmin = ({ req: { user } }: any) => { ... }
```

**Fix:** Use proper Payload types (`AccessArgs<User>`) for all access functions to catch type errors at compile time.

---

### 28. Dev-Only Script `dev:reset` Could Be Accidentally Run

**File:** `package.json`

**Issue:** `"dev:reset": "cross-env PAYLOAD_DROP_DATABASE=true ..."` will drop the entire database. While it's a dev script, having it in package.json for a production-deployed project is risky if someone runs it on the wrong environment.

**Fix:** Add an environment check at the beginning of any destructive operation, or move dev-only scripts to a separate file.

---

### 29. External Redirect Without Validation

**File:** `redirects.ts`

**Issue:** The kizuna redirect points to an external domain (`https://www.kizunamosai.in`). If this domain expires or is compromised, visitors will be redirected to a potentially malicious site.

```ts
const kizunaRedirect = {
  source: '/kizuna-india-japan-study-forum',
  destination: 'https://www.kizunamosai.in',
  permanent: false,
}
```

**Fix:** Monitor external redirect destinations. Consider adding the redirect at the reverse proxy level where monitoring is easier.

---

## Recommendations Priority

### Before Go-Live (Block deployment):
1. Generate strong, unique secrets for PAYLOAD_SECRET, CRON_SECRET, PREVIEW_SECRET
2. Set NEXT_PUBLIC_SERVER_URL to actual production domain
3. Fix Members collection access to filter by `isPublic` at API level
4. Remove or protect the seed route
5. Add security headers via middleware.ts
6. Add `csrf` to Payload config
7. Sanitize all dangerouslySetInnerHTML content with DOMPurify
8. Change database password and use a non-superuser role

### First Sprint After Launch:
9. Implement rate limiting (especially on login and public form endpoints)
10. Add file size limits to Media uploads
11. Add CAPTCHA to public forms
12. Restrict Job Application uploads to PDF with size limit
13. Fix open redirect in preview route
14. Validate color inputs in SiteSettings before CSS injection
15. Disable GraphQL introspection

### Ongoing:
16. Run `npm audit` regularly for dependency vulnerabilities
17. Add Error Boundaries
18. Make alt text required
19. Remove docker-compose.yml or update for PostgreSQL
20. Monitor external redirect destinations

---

## Files Reviewed

| File | Purpose |
|------|---------|
| `.env` | Environment secrets |
| `.env.example` | Environment template |
| `.gitignore` | Git exclusion rules |
| `package.json` | Dependencies |
| `next.config.ts` | Next.js configuration |
| `Dockerfile` | Production Docker image |
| `docker-compose.yml` | Development services |
| `redirects.ts` | URL redirects |
| `src/payload.config.ts` | Payload CMS configuration |
| `src/access/*.ts` | All access control files |
| `src/collections/Users/index.ts` | User authentication |
| `src/collections/Members.ts` | Members directory |
| `src/collections/JobApplications.ts` | Job applications |
| `src/collections/Media.ts` | File uploads |
| `src/globals/SiteSettings.ts` | Site configuration |
| `src/plugins/index.ts` | Plugin configuration |
| `src/endpoints/seed/index.ts` | Database seeding |
| `src/app/(frontend)/layout.tsx` | Root layout |
| `src/app/(frontend)/members/page.tsx` | Members page |
| `src/app/(frontend)/next/preview/route.ts` | Preview API |
| `src/app/(frontend)/next/exit-preview/route.ts` | Exit preview API |
| `src/app/(frontend)/next/seed/route.ts` | Seed API |
| `src/blocks/FlexibleRow/Component.tsx` | Flexible content |
| `src/blocks/Hero/Component.tsx` | Hero component |
| `src/blocks/Form/Component.tsx` | Form handler |
| `src/utilities/getURL.ts` | URL utilities |
| `src/utilities/getMeUser.ts` | Auth utility |

---

*End of audit report.*
