import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createSession,
  setSessionCookie,
  clearSessionCookie,
  timingSafeCompare,
  getClientIp,
  isRateLimited,
  clearRateLimit,
  checkOrigin,
} from "./_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "DELETE") {
    res.setHeader("Set-Cookie", clearSessionCookie());
    return res.status(200).json({ success: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!checkOrigin(req)) {
    return res.status(403).json({ message: "Invalid origin" });
  }

  const ip = getClientIp(req);
  if (await isRateLimited(ip)) {
    return res.status(429).json({ message: "Too many attempts. Try again later." });
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  const validPassword = process.env.ADMIN_PASSWORD;

  if (!validPassword) {
    console.error("ADMIN_PASSWORD not configured");
    return res.status(500).json({ message: "Server configuration error" });
  }

  if (!password || !timingSafeCompare(password, validPassword)) {
    return res.status(401).json({ message: "Invalid password" });
  }

  await clearRateLimit(ip);
  const token = await createSession();
  if (!token) {
    console.error("SESSION_SECRET not configured");
    return res.status(500).json({ message: "Server configuration error" });
  }

  res.setHeader("Set-Cookie", setSessionCookie(token));
  return res.status(200).json({ success: true, redirect: "/admin/editor" });
}
