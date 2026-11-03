import { kv } from "@vercel/kv";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Local dev fallback: without Vercel KV credentials (and not in production),
// store data in a local JSON file so the admin editor works with `npm run dev`.
const useLocalStore =
  !process.env.KV_REST_API_URL && process.env.NODE_ENV !== "production";
const LOCAL_FILE = join(process.cwd(), ".local-kv.json");

type LocalData = Record<string, unknown>;

function readLocal(): LocalData {
  try {
    return existsSync(LOCAL_FILE)
      ? (JSON.parse(readFileSync(LOCAL_FILE, "utf8")) as LocalData)
      : {};
  } catch {
    return {};
  }
}

function writeLocal(data: LocalData): void {
  writeFileSync(LOCAL_FILE, JSON.stringify(data, null, 2));
}

async function storeGet<T>(key: string): Promise<T | null> {
  if (useLocalStore) {
    const value = readLocal()[key];
    return value === undefined ? null : (structuredClone(value) as T);
  }
  return kv.get<T>(key);
}

async function storeSet(key: string, value: unknown): Promise<void> {
  if (useLocalStore) {
    const data = readLocal();
    data[key] = value;
    writeLocal(data);
    return;
  }
  await kv.set(key, value);
}

async function storeDel(keys: string | string[]): Promise<void> {
  if (useLocalStore) {
    const data = readLocal();
    for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key];
    writeLocal(data);
    return;
  }
  await kv.del(keys);
}

const DRAFT_KEY = "portfolio:content:draft";
const PUBLISHED_KEY = "portfolio:content:published";
const VERSIONS_KEY = "portfolio:versions";
const VERSION_PREFIX = "portfolio:version:";
const MAX_VERSIONS = 20;

export interface VersionMeta {
  id: string;
  publishedAt: string;
  bytes: number;
}

export async function getDraftContent<T>(): Promise<T | null> {
  return storeGet<T>(DRAFT_KEY);
}

export async function getPublishedContent<T>(): Promise<T | null> {
  return storeGet<T>(PUBLISHED_KEY);
}

export async function saveDraftContent(content: unknown): Promise<void> {
  await storeSet(DRAFT_KEY, content);
}

export async function publishContent(content: unknown): Promise<VersionMeta> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const json = JSON.stringify(content);
  const meta: VersionMeta = {
    id,
    publishedAt: new Date().toISOString(),
    bytes: Buffer.byteLength(json, "utf8"),
  };

  await storeSet(PUBLISHED_KEY, content);
  await storeSet(`${VERSION_PREFIX}${id}`, content);

  const versions = (await storeGet<VersionMeta[]>(VERSIONS_KEY)) ?? [];
  const next = [meta, ...versions].slice(0, MAX_VERSIONS);
  await storeSet(VERSIONS_KEY, next);

  const removed = versions.slice(MAX_VERSIONS);
  if (removed.length > 0) {
    await storeDel(removed.map((v) => `${VERSION_PREFIX}${v.id}`));
  }

  return meta;
}

export async function listVersions(): Promise<VersionMeta[]> {
  return (await storeGet<VersionMeta[]>(VERSIONS_KEY)) ?? [];
}

export async function getVersionContent<T>(id: string): Promise<T | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null;
  return storeGet<T>(`${VERSION_PREFIX}${id}`);
}

const LIKE_KEY = "footer-likes";

export async function getLikeCount(): Promise<number> {
  if (useLocalStore) return (await storeGet<number>(LIKE_KEY)) ?? 0;
  return (await kv.get<number>(LIKE_KEY)) ?? 0;
}

export async function incrementLikeCount(): Promise<number> {
  if (useLocalStore) {
    const next = ((await storeGet<number>(LIKE_KEY)) ?? 0) + 1;
    await storeSet(LIKE_KEY, next);
    return next;
  }
  return kv.incr(LIKE_KEY);
}

export async function getContent<T>(mode: "draft" | "published" = "published"): Promise<T | null> {
  if (mode === "draft") {
    const draft = await getDraftContent<T>();
    if (draft) return draft;
  }
  return getPublishedContent<T>();
}
