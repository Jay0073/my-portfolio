import type { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

const PUBLISHED_KEY = "portfolio:content:published";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  try {
    const content = await kv.get(PUBLISHED_KEY);
    return res.status(200).json({ content: content ?? null });
  } catch (err) {
    console.error("Failed to read published content:", err);
    // Fail open: the client falls back to bundled default content.
    return res.status(200).json({ content: null });
  }
}
