import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host");

  let basePath = "";

  // DOMAIN NAMES SECTION
  if (hostname === "ashref-mtir.dev" || hostname === "www.ashref-mtir.dev") {
    basePath = "/demo";
  }

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
