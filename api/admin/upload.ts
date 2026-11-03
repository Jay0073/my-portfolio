import type { VercelRequest, VercelResponse } from "@vercel/node";
import { put } from "@vercel/blob";
import { requireAdmin, rejectMutation } from "./_lib/auth";

const MAX_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireAdmin(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (rejectMutation(req, res)) return;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({
      message: "Blob storage is not configured (BLOB_READ_WRITE_TOKEN missing)",
    });
  }

  const { name, type, data } = req.body as {
    name?: string;
    type?: string;
    data?: string;
  };

  const ext = ALLOWED_TYPES[type ?? ""];
  if (!ext || typeof data !== "string") {
    return res.status(415).json({ message: "Only PNG, JPEG, WebP, GIF, or SVG images are allowed" });
  }

  const buffer = Buffer.from(data, "base64");
  if (buffer.length === 0) {
    return res.status(400).json({ message: "Empty file" });
  }
  if (buffer.length > MAX_BYTES) {
    return res.status(413).json({ message: "Image is larger than 2 MB" });
  }

  const safeBase = (name ?? "image")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";

  try {
    const blob = await put(`portfolio/${Date.now()}-${safeBase}.${ext}`, buffer, {
      access: "public",
      contentType: type,
      allowOverwrite: true,
    });
    return res.status(200).json({ url: blob.url, bytes: buffer.length });
  } catch (err) {
    console.error("Blob upload failed:", err);
    return res.status(500).json({ message: "Upload failed" });
  }
}
