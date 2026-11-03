import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getLikeCount, incrementLikeCount } from "./admin/_lib/kv.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === "GET") {
      const count = await getLikeCount();
      return res.status(200).json({ count });
    }

    if (req.method === "POST") {
      const newCount = await incrementLikeCount();
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
