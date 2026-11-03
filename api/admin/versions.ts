import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "./_lib/auth.js";
import { listVersions, getVersionContent } from "./_lib/kv.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const session = await requireAdmin(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (id) {
    const content = await getVersionContent(id);
    if (!content) {
      return res.status(404).json({ message: "Version not found" });
    }
    return res.status(200).json({ content });
  }

  const versions = await listVersions();
  return res.status(200).json({ versions });
}
