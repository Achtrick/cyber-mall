import { Head, Html, Main, NextScript } from "next/document";

// No <link rel="icon"> here: this document wraps every page, shops included,
// and browsers pick a global icon over the shop's own. Each layout declares
// its icon instead (SITE_ICON in the platform layouts, the shop's logo in
// components/shop/ShopLayout.js).
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
