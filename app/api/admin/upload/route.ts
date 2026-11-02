import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

/* Client uploads (audio and cover) go straight to Vercel Blob, so the file never
   passes through this function (avoids the request body size limit). Admin only. */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("No autorizado");
        return {
          allowedContentTypes: ["audio/mpeg", "audio/mp3", "image/png", "image/jpeg", "image/gif", "image/webp"],
          maximumSizeInBytes: 60 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
}
