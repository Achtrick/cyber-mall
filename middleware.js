export async function middleware(request) {
  // const { pathname } = request.nextUrl;
  // const hostname = request.headers.get("host");
  // const url = new URL(request.url);
  // const domainsJsonUrl = `${url.origin}/domainNames/domainNames.json`;
  // let basePath = "";
  // // READ DOMAIN NAME FILE
  // const domains = await (await fetch(domainsJsonUrl)).json();
  // // DOMAIN NAMES SECTION
  // domains.forEach((_) => {
  //   if (hostname === _.domain || hostname === `www.${_.domain}`) {
  //     basePath = `/${_.shop}`;
  //   }
  // });
  // // URL REWRITE SECTION
  // if (basePath && !pathname.startsWith(basePath)) {
  //   const newurl = new URL(`${basePath}${pathname}`, request.url);
  //   return NextResponse.rewrite(newurl);
  // }
  // return NextResponse.next();
}

export const config = {
  // matcher: [
  //   "/((?!api|_next/static|_next/image|favicon.ico|images|manifests).*)",
  // ],
};
