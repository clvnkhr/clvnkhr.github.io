# GitHub Pages Deployment

## Overview

This blog is deployed to GitHub Pages using GitHub Actions. The deployment process builds the static site locally using Bun + TypeScript and uploads the generated HTML/CSS/JS to GitHub Pages.

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Source Code (GitHub Repository)                          │
│  - blog/posts/*.typ          ← Typst blog posts          │
│  - src/build/*.ts            ← TypeScript build scripts │
│  - src/components/*.tsx     ← JSX templates            │
│  - tailwind.config.js        ← Tailwind configuration   │
│  - package.json              ← Dependencies              │
└─────────────────────────────────────────────────────────┘
                         │ Push to ts-blog or main
                         ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow (.github/workflows/deploy.yml)  │
│  1. Checkout repository                                  │
│  2. Setup Node.js 20 + npm cache                         │
│  3. Install Typst CLI                                    │
│  4. Install dependencies (npm ci)                        │
│  5. Build site (npm run build → ./dist/)                │
│  6. Upload artifact (./dist)                             │
│  7. Deploy to GitHub Pages                              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Pages (Production)                               │
│  - https://clvnkhr.github.io                             │
│  - Serves static files from dist/                        │
│  - HTTPS automatically configured                        │
└─────────────────────────────────────────────────────────┘
```

---

## GitHub Actions Workflow

### Workflow Configuration

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ts-blog, main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install Typst CLI
        uses: fufexan/typst-action@v2

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Build Process

### What Gets Built

The build process (`npm run build`) executes these steps:

1. **Scan blog posts** - Finds all `.typ` files in `blog/posts/yyyy/mm/dd/`
2. **Parse metadata** - Extracts frontmatter from Typst comments (`// title:`, `// date:`, etc.)
3. **Compile Typst to HTML** - Uses Typst CLI to convert `.typ` files to HTML
4. **Render JSX templates** - Wraps content in React components (`renderToString`)
5. **Generate pages:**
   - `index.html` - Homepage/splash
   - `blog/index.html` - Blog post listing
   - `blog/yyyy/mm/dd/post/index.html` - Individual blog posts
   - `tags/*/index.html` - Tag pages
   - `projects/index.html` - Projects showcase
   - `pagefind/` - Search index data
6. **Build Tailwind CSS** - Compiles styles with Catppuccin theme
7. **Copy static assets** - Images, favicon, robots.txt to `dist/`

### Build Output

```
dist/
├── index.html              → Homepage
├── blog/
│   ├── index.html          → Blog listing
│   └── 2025/
│       └── 01/
│           └── 15/
│               └── my-post/index.html
├── tags/
│   └── tutorial/index.html
├── projects/
│   └── index.html
├── pagefind/               → Search index files
└── assets/
    ├── css/
    │   └── main.css
    ├── js/
    │   └── dark-mode.js
    └── img/
        └── *.png
```

---

## Branching Strategy

### Branches

| Branch | Purpose | Deployed? |
|--------|---------|-----------|
| `main` | Stable production | ✅ Yes (via push) |
| `ts-blog` | Development branch for new blog system | ✅ Yes (via push) |
| Other branches | Feature work | ❌ No |

### Deployment Triggers

The workflow runs on:
1. **Push to `ts-blog` or `main`** - Automatic deployment
2. **Pull request to `main`** - Build verification (no deployment)
3. **Manual trigger** - `workflow_dispatch` button in Actions tab

---

## Package.json Scripts

```json
{
  "scripts": {
    "build": "bun run src/build/index.ts",
    "dev": "bun run src/build/index.ts --watch",
    "serve": "bun dist",
    "clean": "rm -rf dist"
  }
}
```

### Local Development

```bash
# Install dependencies
bun install

# Watch mode (auto-rebuild on changes)
bun run dev

# Single build
bun run build

# Serve locally
bun run serve

# Preview production build
bun run build && bun run serve
```

---

## Permissions & Security

### GitHub Actions Permissions

```yaml
permissions:
  contents: read      # Read repository code
  pages: write        # Write to GitHub Pages
  id-token: write     # OIDC token for deployment
```

### Why These Permissions?

- **`contents: read`** - Allows workflow to checkout code (no write access needed)
- **`pages: write`** - Required to deploy to GitHub Pages
- **`id-token: write`** - Enables OIDC authentication (more secure than PAT)

No personal access tokens (PATs) are used. Deployment uses GitHub's built-in OIDC support.

---

## Deployment URL

### Production URL

- **URL:** `https://clvnkhr.github.io`
- **Source branch:** `main` or `ts-blog`
- **Source directory:** `/` (root)

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to `public/`:
   ```
   yourdomain.com
   ```

2. Configure DNS at your domain registrar:
   - Add `CNAME` record: `www.yourdomain.com → clvnkhr.github.io`
   - Or `A` record: `@ → 185.199.108.153` (and the other 3 IPs)

3. GitHub Pages will automatically configure HTTPS via Let's Encrypt

---

## Troubleshooting

### Build Fails on GitHub Actions

1. **Check Actions logs** - Look at which step failed
2. **Verify package.json** - Ensure `build` script exists
3. **Check dependencies** - Ensure all packages are in `package.json`
4. **Test locally** - Run `npm run build` locally to reproduce

### Deployment succeeds but 404 on site

1. **Wait 1-2 minutes** - GitHub Pages takes time to propagate
2. **Check Pages settings** - Ensure source is set correctly:
   - Settings → Pages → Source: Deploy from a branch
   - Branch: `main` or `ts-blog`, folder: `/ (root)`
3. **Check DNS** - If using custom domain, verify DNS records

### Typst CLI not found

The workflow uses `fufexan/typst-action@v2` to install Typst. If this fails:
- Check GitHub Actions marketplace for latest version
- Alternative: Install manually:
  ```yaml
  - name: Install Typst
    run: curl -fsSL https://typst.app/install.sh | sh
  ```

---

## Migration from Jekyll

The old Jekyll blog has been preserved in `archive/` for reference. The new system:

- **Content format:** Typst (`.typ`) instead of Markdown (`.md`)
- **Build tool:** Bun + TypeScript instead of Jekyll (Ruby)
- **Templates:** JSX instead of Liquid
- **Styling:** Tailwind CSS instead of custom SCSS
- **Deployment:** Same GitHub Actions workflow (updated build command)

### Old Deployment (Jekyll)

```yaml
# Old Jekyll workflow (no longer used)
- uses: jekyll-build-and-deploy@v2
```

### New Deployment (Typst + Bun)

```yaml
# Current workflow
- name: Install Typst CLI
  uses: fufexan/typst-action@v2

- name: Install dependencies
  run: npm ci

- name: Build
  run: npm run build  # Runs Bun build script
```

---

## Monitoring & Logs

### View Deployment Status

1. Go to **Actions** tab in GitHub repository
2. Select **Deploy to GitHub Pages** workflow
3. Click on the latest run to see:
   - Build logs
   - Deployment status
   - Page URL after deployment

### View Live Deployments

1. Go to **Settings** → **Pages**
2. See the latest deployment status and URL

---

## Key Differences from Old Workflow

| Aspect | Old (Jekyll) | New (Typst + Bun) |
|--------|-------------|-------------------|
| **Build tool** | jekyll-build-and-deploy action | Custom TypeScript scripts |
| **Runtime** | Ruby | Bun (JavaScript) |
| **Content format** | Markdown | Typst |
| **Build command** | Handled by action | `npm run build` (runs `bun src/build/index.ts`) |
| **Dependencies** | Gemfile | package.json |
| **CI/CD** | Single Jekyll action | Multi-step (Node.js + Typst + Bun) |
| **Build time** | ~1-2 minutes | ~30 seconds - 1 minute |

---

## Summary

- **Build tool:** Bun + TypeScript scripts
- **Trigger:** Push to `ts-blog` or `main`
- **Output:** Static files in `dist/`
- **Deployment:** GitHub Actions `deploy-pages` action
- **URL:** https://clvnkhr.github.io
- **Permissions:** `contents: read`, `pages: write`, `id-token: write`
- **No PATs required** - Uses OIDC for secure deployment
