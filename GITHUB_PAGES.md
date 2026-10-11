# GitHub Pages Deployment

Deployed via GitHub Actions on push to `master` or `ts-blog`. Workflow: `.github/workflows/deploy.yml`.

## Workflow Steps

1. **Checkout** — `actions/checkout@v5`
2. **Setup Bun** — `oven-sh/setup-bun@v2` (v1.3.14)
3. **Install Typst** — curl+extract the version pinned in `package.json` to `/usr/local/bin/typst`
4. **Install deps** — `bun install --frozen-lockfile`
5. **Build and test** — `bun run build` (typecheck → lint → compile posts → bundle browser scripts and copy assets → Tailwind CSS → render pages), then `bun run test`
6. **Deploy** — `actions/configure-pages@v6` + `upload-pages-artifact@v5` + `deploy-pages@v5`. Pull requests build and test without deploying.

## URL

**https://clvnkhr.github.io** — served from `dist/` via GitHub Pages with auto HTTPS.

## Permissions

- `contents: read` — checkout code
- `pages: write` — deploy to Pages
- `id-token: write` — OIDC auth (no PATs)
