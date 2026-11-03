import { SignJWT, jwtVerify } from "jose";
import { timingSafeEqual } from "crypto";
import { kv } from "@vercel/kv";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 60 * 60 * 24 * 7;
const RATE_LIMIT_WINDOW = 60 * 15;
const RATE_LIMIT_MAX = 5;

function getSessionSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret) return null;
  return new TextEncoder().encode(secret);
}

export async function createSession(): Promise<string | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secret);
  return token;
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = value;
  }
  return out;
}

export async function verifySession(req: VercelRequest): Promise<{ role: string } | null> {
  const secret = getSessionSecret();
  if (!secret) return null;
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { role: string };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_DURATION}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

export function timingSafeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress ?? "unknown";
}

export async function isRateLimited(ip: string): Promise<boolean> {
  const key = `admin:ratelimit:${ip}`;
  try {
    const count = await kv.incr(key);
    if (count === 1) await kv.expire(key, RATE_LIMIT_WINDOW);
    return count > RATE_LIMIT_MAX;
  } catch {
    return false;
  }
}

export async function clearRateLimit(ip: string): Promise<void> {
  try {
    await kv.del(`admin:ratelimit:${ip}`);
  } catch {
    // ignore
  }
}

export function checkOrigin(req: VercelRequest): boolean {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    const originUrl = new URL(origin);
    const host = req.headers.host;
    if (!host) return false;
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export async function requireAdmin(
  req: VercelRequest
): Promise<{ role: string } | null> {
  return verifySession(req);
}

export function rejectMutation(req: VercelRequest, res: VercelResponse): boolean {
  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
    if (!checkOrigin(req)) {
      res.status(403).json({ message: "Invalid origin" });
      return true;
    }
    const contentType = req.headers["content-type"] ?? "";
    if (!contentType.includes("application/json")) {
      res.status(415).json({ message: "Content-Type must be application/json" });
      return true;
    }
  }
  return false;
}
