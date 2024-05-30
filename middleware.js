import { NextResponse } from "next/server";
import { domains } from "./utils/config/domains";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");

  let basePath = "";

  // DOMAIN NAMES SECTION
  domains.forEach((domain) => {
    if (hostname === domain.name || hostname === `www.${domain.name}`) {
      basePath = `/${domain.shop}`;
    }
  });

  // URL REWRITE SECTION
  if (basePath && !pathname.startsWith(basePath)) {
    const newurl = new URL(`${basePath}${pathname}`, request.url);
    return NextResponse.rewrite(newurl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
