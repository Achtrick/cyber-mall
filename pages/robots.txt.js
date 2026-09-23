import { SITE_URL } from "../utils/config/site";

// Served at /robots.txt. Generated from SITE_URL so it always points at the
// right domain -- see utils/config/site.js.
function RobotsTxt() {
  return null;
}

export const getServerSideProps = async ({ res }) => {
  const body = `user-agent: *
Allow: /
Allow: /#customize
Allow: /#dashboard
Allow: /#receipts
Allow: /#domain
Allow: /#how-to
Allow: /pricing
Allow: /contact
Allow: /login
Allow: /register
Allow: /forgot-password
Allow: /condition-of-use
Allow: /privacy-policy
Allow: /:shop
Allow: /:shop/:product
Sitemap: ${SITE_URL}/sitemap.xml
`;
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(body);
  res.end();
  return { props: {} };
};

export default RobotsTxt;
