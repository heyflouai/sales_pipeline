import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/",
  "/api/webhooks/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Protect all other routes
  await auth.protect();

  // Get org context after authentication
  const { orgId } = await auth();

  // If user has an organization, pass it via header for server-side tenant context
  // NOTE: We can't call setTenantContext here because middleware runs on Edge
  // and postgres driver doesn't work on Edge. Instead, we pass orgId via header
  // and server-side code (API routes, Server Actions) reads it and sets context.
  if (orgId) {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-organization-id", orgId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)",
  ],
};
