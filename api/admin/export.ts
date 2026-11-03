import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_lib/auth.js";
import { getDraftContent } from "./_lib/kv.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireAdmin(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const content = await getDraftContent();
  if (!content) {
    return res.status(404).json({ message: "No draft found" });
  }

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Disposition", 'attachment; filename="portfolio-content.json"');
  return res.status(200).send(JSON.stringify(content, null, 2));
}
