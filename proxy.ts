import { clerkMiddleware } from "@clerk/nextjs/server";

// /tangente is a standalone public piece with no login, so it skips Clerk entirely.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|tangente|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|otf|ico|csv|docx?|xlsx?|zip|webmanifest|mp3)).*)",
    "/(api|trpc)(.*)",
  ],
};
