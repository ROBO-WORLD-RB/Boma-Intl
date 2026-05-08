import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ============================================
// MAINTENANCE MODE CONFIGURATION
// ============================================
// Set to 'true' to enable maintenance mode
// Set to 'false' to disable and restore normal site access
const MAINTENANCE_MODE = true;
// ============================================

// Paths that should bypass maintenance mode
// Add any paths here that should remain accessible during maintenance
const BYPASS_PATHS = [
    "/maintenance",
    "/api", // Keep API routes accessible if needed
    "/_next", // Next.js internal assets
    "/favicon.ico",
    "/icon.png",
    "/apple-icon.png",
    "/google41d02b5be12a9236.html",
    "/robots.txt",
    "/sitemap.xml",
];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if maintenance mode is enabled
    if (MAINTENANCE_MODE) {
        // Check if the current path should bypass maintenance
        const shouldBypass = BYPASS_PATHS.some((path) =>
            pathname.startsWith(path)
        );

        // If not bypassed and not already on maintenance page, redirect
        if (!shouldBypass) {
            const url = request.nextUrl.clone();
            url.pathname = "/maintenance";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};
