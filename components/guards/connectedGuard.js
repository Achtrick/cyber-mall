import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// This guard only needs to bounce an already-logged-in admin away from the
// public marketing pages (home, pricing, login, ...) to their dashboard --
// `userInfo` only ever exists client-side (read from localStorage), so that
// redirect can only happen after mount either way. It used to also hide
// `props.children` (and therefore every meta tag declared by the page's
// <Layout>/<Head>) behind a loading spinner until that check ran. Crawlers
// (WhatsApp, Facebook, Twitter/X, ...) never run client-side JS, so they saw
// nothing but a bare spinner and no title/og tags at all on every one of
// these pages, including the homepage. Rendering children immediately fixes
// that; the redirect effect below still runs exactly as before for the rare
// case of a signed-in admin browsing the storefront.
function ConnectedGuard(props) {
  const router = useRouter();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo !== null && userInfo.role === "ADMIN") {
      router.push("admin/account");
    } else if (userInfo !== null && userInfo.role === "SUPER-ADMIN") {
      router.push("super-admin/shops");
    }
  }, [userInfo, router]);

  return <div>{props.children}</div>;
}

export default ConnectedGuard;
