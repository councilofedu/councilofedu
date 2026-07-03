import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target domain
const DOMAIN = 'https://councilofedu.vercel.app';

// Static routes
const staticRoutes = [
  '/',
  '/about',
  '/programs',
  '/publications',
  '/membership',
  '/member-portal',
  '/team',
  '/inquiry',
  '/faq',
  '/search',
  '/blogs'
];

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  const urls = [];
  
  // Add static routes
  for (const route of staticRoutes) {
    urls.push({
      loc: `${DOMAIN}${route}`,
      changefreq: 'weekly',
      priority: route === '/' ? '1.0' : '0.8',
      lastmod: new Date().toISOString().split('T')[0]
    });
  }
  
  // Add dynamic blog posts
  const blogsPath = path.join(__dirname, '../local_db/blogs.json');
  if (fs.existsSync(blogsPath)) {
    try {
      const blogsData = JSON.parse(fs.readFileSync(blogsPath, 'utf-8'));
      const blogIds = Object.keys(blogsData);
      
      for (const id of blogIds) {
        urls.push({
          loc: `${DOMAIN}/blog/${id}`,
          changefreq: 'weekly',
          priority: '0.6',
          lastmod: new Date().toISOString().split('T')[0]
        });
      }
      console.log(`Added ${blogIds.length} dynamic blog routes to sitemap.`);
    } catch (e) {
      console.error('Error parsing local_db/blogs.json for sitemap:', e);
    }
  } else {
    console.log('No local_db/blogs.json file found. Skipping dynamic blog routes.');
  }

  // Construct sitemap XML content
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  for (const url of urls) {
    xmlContent += '  <url>\n';
    xmlContent += `    <loc>${url.loc}</loc>\n`;
    xmlContent += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xmlContent += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xmlContent += `    <priority>${url.priority}</priority>\n`;
    xmlContent += '  </url>\n';
  }
  
  xmlContent += '</urlset>\n';
  
  // Ensure public directory exists
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xmlContent, 'utf-8');
  console.log(`Sitemap written successfully to ${sitemapPath}`);
}

generateSitemap().catch(err => {
  console.error('Failed to generate sitemap:', err);
  process.exit(1);
});
