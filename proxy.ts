import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/site";

const NON_DEFAULT_LOCALES = locales.filter((l) => l !== defaultLocale);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const stripped = pathname === `/${defaultLocale}`
      ? "/"
      : pathname.slice(`/${defaultLocale}`.length);
    request.nextUrl.pathname = stripped;
    return NextResponse.redirect(request.nextUrl, 308);
  }

  for (const locale of NON_DEFAULT_LOCALES) {
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return;
    }
  }

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.rewrite(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|panel|login|favicon.ico|.*\\..*).*)"],
};
