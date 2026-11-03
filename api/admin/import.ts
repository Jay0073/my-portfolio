import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin, rejectMutation } from "./_lib/auth.js";
import { saveDraftContent } from "./_lib/kv.js";
import { PortfolioContentSchema } from "../../src/lib/contentSchema.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireAdmin(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (rejectMutation(req, res)) return;

  const result = PortfolioContentSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ message: "Invalid content", errors: result.error.flatten() });
  }

  await saveDraftContent(result.data);
  return res.status(200).json({ success: true, content: result.data });
}
