import { SITE_URL } from "../utils/config/site";

// Served at /robots.txt. Generated from SITE_URL so it always points at the
// right domain -- see utils/config/site.js.
function RobotsTxt() {
  return null;
}

// /api stays disallowed, except the two image routes that link-preview
// crawlers must be able to fetch: shop/product og:images and shop icons are
// served from /api/og/ and /api/images/ (crawlers that honor robots.txt, e.g.
// Twitterbot, otherwise drop the image). Longest match wins (RFC 9309), so these
// Allow lines override "Disallow: /api".
export const getServerSideProps = async ({ res }) => {
  const body = `user-agent: *
Allow: /
Allow: /api/og/
Allow: /api/images/
Disallow: /admin
Disallow: /api
Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();
  return { props: {} };
};

export default RobotsTxt;
