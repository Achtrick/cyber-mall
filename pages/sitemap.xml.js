import { SITE_URL } from "../utils/config/site";

// Served at /sitemap.xml. Generated from SITE_URL so it always points at the
// right domain -- see utils/config/site.js.
const PATHS = [
  { path: "/", priority: "1.00" },
  { path: "/pricing", priority: "0.80" },
  { path: "/contact", priority: "0.80" },
  { path: "/#dashboard", priority: "0.80" },
  { path: "/#customize", priority: "0.80" },
  { path: "/#receipts", priority: "0.80" },
  { path: "/#domain", priority: "0.80" },
  { path: "/#how-to", priority: "0.80" },
  { path: "/login", priority: "0.80" },
  { path: "/register", priority: "0.80" },
  { path: "/forgot-password", priority: "0.80" },
  { path: "/condition-of-use", priority: "0.80" },
  { path: "/privacy-policy", priority: "0.80" },
];

function SitemapXml() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const lastmod = new Date().toISOString();
  const urls = PATHS.map(
    ({ path, priority }) => `    <url>
        <loc>${SITE_URL}${path}</loc>
        <lastmod>${lastmod}</lastmod>
        <priority>${priority}</priority>
    </url>`
  ).join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();
  return { props: {} };
};

export default SitemapXml;
