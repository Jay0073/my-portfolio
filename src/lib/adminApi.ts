export class UnauthorizedError extends Error {
  constructor() {
    super("Session expired");
    this.name = "UnauthorizedError";
  }
}

/**
 * fetch() for admin endpoints. On 401 it emits `admin:unauthorized`
 * so the editor can show the re-login modal, and throws UnauthorizedError.
 */
export async function adminFetch(
  path: string,
  init?: RequestInit
): Promise<Response> {
  const res = await fetch(path, {
    credentials: "include",
    ...init,
  });
  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent("admin:unauthorized"));
    throw new UnauthorizedError();
  }
  return res;
}

export function uploadImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] ?? "";
        const res = await adminFetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            type: file.type,
            data: base64,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || "Upload failed");
        }
        const { url } = (await res.json()) as { url: string };
        resolve(url);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}
