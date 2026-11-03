import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin, rejectMutation } from "./_lib/auth";
import { getDraftContent, publishContent } from "./_lib/kv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireAdmin(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (rejectMutation(req, res)) return;

  const draft = await getDraftContent();
  if (!draft) {
    return res.status(400).json({ message: "No draft to publish" });
  }

  const revision = await publishContent(draft);
  return res.status(200).json({ success: true, revision });
}
