import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPublishedContent } from "./admin/_lib/kv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  res.setHeader("Cache-Control", "no-store");

  try {
    const content = await getPublishedContent();
    return res.status(200).json({ content: content ?? null });
  } catch (err) {
    console.error("Failed to read published content:", err);
    // Fail open: the client falls back to bundled default content.
    return res.status(200).json({ content: null });
  }
}
