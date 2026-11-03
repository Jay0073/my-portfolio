import { kv } from "@vercel/kv";

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
  return kv.get<T>(DRAFT_KEY);
}

export async function getPublishedContent<T>(): Promise<T | null> {
  return kv.get<T>(PUBLISHED_KEY);
}

export async function saveDraftContent(content: unknown): Promise<void> {
  await kv.set(DRAFT_KEY, content);
}

export async function publishContent(content: unknown): Promise<VersionMeta> {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const json = JSON.stringify(content);
  const meta: VersionMeta = {
    id,
    publishedAt: new Date().toISOString(),
    bytes: Buffer.byteLength(json, "utf8"),
  };

  await kv.set(PUBLISHED_KEY, content);
  await kv.set(`${VERSION_PREFIX}${id}`, content);

  const versions = (await kv.get<VersionMeta[]>(VERSIONS_KEY)) ?? [];
  const next = [meta, ...versions].slice(0, MAX_VERSIONS);
  await kv.set(VERSIONS_KEY, next);

  const removed = versions.slice(MAX_VERSIONS);
  if (removed.length > 0) {
    await kv.del(removed.map((v) => `${VERSION_PREFIX}${v.id}`));
  }

  return meta;
}

export async function listVersions(): Promise<VersionMeta[]> {
  return (await kv.get<VersionMeta[]>(VERSIONS_KEY)) ?? [];
}

export async function getVersionContent<T>(id: string): Promise<T | null> {
  if (!/^[a-z0-9-]+$/i.test(id)) return null;
  return kv.get<T>(`${VERSION_PREFIX}${id}`);
}

export async function getContent<T>(mode: "draft" | "published" = "published"): Promise<T | null> {
  if (mode === "draft") {
    const draft = await getDraftContent<T>();
    if (draft) return draft;
  }
  return getPublishedContent<T>();
}
