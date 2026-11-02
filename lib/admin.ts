import { auth } from "@clerk/nextjs/server";

/* Only the Clerk user whose id is in ADMIN_USER_ID can manage the catalog. */
export async function isAdmin(): Promise<boolean> {
  const { userId } = await auth();
  return !!userId && !!process.env.ADMIN_USER_ID && userId === process.env.ADMIN_USER_ID;
}
