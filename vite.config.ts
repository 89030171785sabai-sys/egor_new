import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { models } from './src/data/models'
import { SITE_ORIGIN } from './src/lib/site'

/**
 * Writes sitemap.xml from the same model data the pages are built from, so the
 * two cannot drift apart. Legal pages are noindex and stay out of it.
 */
function sitemap(): Plugin {
  return {
    name: 'zhar-dym-sitemap',
    apply: 'build',
    async closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const paths = ['/', ...models.map((model) => `/${model.slug}`)]

      const urls = paths
        .map(
          (path) =>
            `  <url>\n` +
            `    <loc>${SITE_ORIGIN}${path}</loc>\n` +
            `    <lastmod>${today}</lastmod>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n` +
            `  </url>`,
        )
        .join('\n')

      const xml =
        `<?xml version="1.0" encoding="UTF-8"?>\n` +
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`

      await writeFile(resolve(__dirname, 'dist/sitemap.xml'), xml, 'utf8')
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
  build: { target: 'es2022' },
})
