import { SITE_URL } from "../utils/config/site";

// Served at /robots.txt. Generated from SITE_URL so it always points at the
// right domain -- see utils/config/site.js.
function RobotsTxt() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const body = `user-agent: *
Allow: /
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
