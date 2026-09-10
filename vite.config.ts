import { copyFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { models } from './src/data/models'

const PRODUCTION_ORIGIN = 'https://xn----7sbnf7av3f.xn--p1ai'

/**
 * Prepares the built output for static hosting:
 *
 * - sitemap.xml from the same model data the pages are built from, so the two
 *   cannot drift apart; legal pages are noindex and stay out of it
 * - 404.html as a copy of index.html, because a static host has no server to
 *   route deep links back to the app
 * - .nojekyll, so GitHub Pages serves the asset directories untouched
 */
function staticHostAssets(origin: string): Plugin {
  return {
    name: 'zhar-dym-static-host-assets',
    apply: 'build',
    async closeBundle() {
      const dist = (file: string) => resolve(__dirname, 'dist', file)
      const today = new Date().toISOString().slice(0, 10)
      const paths = ['/', ...models.map((model) => `/${model.slug}`)]

      const urls = paths
        .map(
          (path) =>
            `  <url>\n` +
            `    <loc>${origin}${path}</loc>\n` +
            `    <lastmod>${today}</lastmod>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n` +
            `  </url>`,
        )
        .join('\n')

      await writeFile(
        dist('sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        'utf8',
      )

      await copyFile(dist('index.html'), dist('404.html'))
      await writeFile(dist('.nojekyll'), '', 'utf8')
    },
  }
}

export default defineConfig(({ mode }) => {
  const base = process.env.VITE_BASE_PATH ?? '/'
  const origin = process.env.VITE_SITE_ORIGIN ?? PRODUCTION_ORIGIN

  return {
    base,
    // Passed through to the client so canonicals match where the build lives.
    define: { 'import.meta.env.VITE_SITE_ORIGIN': JSON.stringify(origin) },
    plugins: [react(), tailwindcss(), staticHostAssets(origin)],
    build: { target: 'es2022', sourcemap: mode !== 'production' },
  }
})
