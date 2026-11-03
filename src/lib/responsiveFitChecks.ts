import type { PortfolioContent } from "./contentSchema";
import type { FitCheck } from "./fitChecks";
import { PREVIEW_DEVICES, type PreviewDevice } from "./previewDevices";

function checkDevice(content: PortfolioContent, device: PreviewDevice, signal: AbortSignal): Promise<FitCheck[]> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement("iframe");
    const requestId = crypto.randomUUID();
    let sent = false;
    let checking = false;
    frame.title = "Fit Check: " + device.label;
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    frame.setAttribute("sandbox", "allow-scripts allow-same-origin");
    Object.assign(frame.style, { position: "fixed", top: "0", left: "-20000px", width: device.width + "px", height: device.height + "px", border: "0", pointerEvents: "none", opacity: "0" });
    const cleanup = () => {
      clearTimeout(timeout);
      window.removeEventListener("message", receive);
      signal.removeEventListener("abort", abort);
      frame.remove();
    };
    const abort = () => { cleanup(); reject(new DOMException("Fit Check cancelled", "AbortError")); };
    const timeout = setTimeout(() => { cleanup(); reject(new Error("This screen did not finish loading within 35 seconds. Retry the check.")); }, 35000);
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
      const message = event.data;
      if (!message || message.source !== "portfolio-preview") return;
      if (message.type === "ready" && !sent) {
        sent = true;
        frame.contentWindow?.postMessage({ source: "portfolio-editor", type: "content", content, contentId: requestId }, window.location.origin);
      }
      if (message.contentId !== requestId) return;
      if (message.type === "content-error") { cleanup(); reject(new Error(message.detail || "The draft could not be loaded.")); }
      if (message.type === "content-applied" && !checking) {
        checking = true;
        frame.contentWindow?.postMessage({ source: "portfolio-editor", type: "fit-check", contentId: requestId }, window.location.origin);
      }
      if (message.type === "fit-results") { cleanup(); resolve(message.results); }
    };
    window.addEventListener("message", receive);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) { abort(); return; }
    frame.src = "/preview?audit=1";
    document.body.appendChild(frame);
  });
}

export async function runResponsiveFitChecks(content: PortfolioContent, onProgress: (detail: string) => void, signal: AbortSignal): Promise<FitCheck[]> {
  const results: FitCheck[] = [];
  for (const [index, device] of PREVIEW_DEVICES.entries()) {
    if (signal.aborted) throw new DOMException("Fit Check cancelled", "AbortError");
    onProgress("Checking " + device.label.toLowerCase() + " · " + device.width + " × " + device.height + " · " + (index + 1) + " of " + PREVIEW_DEVICES.length);
    let checks: FitCheck[];
    try {
      checks = await checkDevice(content, device, signal);
    } catch (error) {
      if (signal.aborted) throw error;
      checks = [{ section: "hero", group: "Page", name: "Screen could not be checked", status: "skipped", detail: error instanceof Error ? error.message : "Reload the preview and try again." }];
    }
    results.push(...checks.map((check) => ({ ...check, deviceId: device.id, viewport: device.label + " · " + device.width + " × " + device.height })));
  }
  return results;
}
