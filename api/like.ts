import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

const KEY = "footer-likes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const count = (await kv.get(KEY)) ?? 0;
      return res.status(200).json({ count });
    }

    if (req.method === "POST") {
      const newCount = await kv.incr(KEY);
      return res.status(200).json({ count: newCount });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
