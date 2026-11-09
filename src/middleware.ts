import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

// Only the CMS needs auth — the public site stays middleware-free for maximum performance.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
