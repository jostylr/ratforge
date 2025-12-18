import { file } from "bun";
import { join } from "path";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".ogg": "audio/ogg",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
};

const PUBLIC_DIR = join(import.meta.dir, "../public");

export async function serveStatic(pathname: string): Promise<Response | null> {
  const filePath = join(PUBLIC_DIR, pathname);
  
  // Security: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  const bunFile = file(filePath);
  if (await bunFile.exists()) {
    const ext = pathname.substring(pathname.lastIndexOf("."));
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    return new Response(bunFile, {
      headers: { "Content-Type": contentType },
    });
  }

  return null;
}
