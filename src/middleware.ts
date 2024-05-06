import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
	const url = request.nextUrl.pathname;

	const sessionToken = request.cookies.get("next-auth.session-token")?.value;

	if (url.startsWith("/dashboard") && !sessionToken)
		return NextResponse.redirect(new URL("/login", request.url));

	return NextResponse.next();
}

export const config = {
	matcher: "/dashboard",
};
