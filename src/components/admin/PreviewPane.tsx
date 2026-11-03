import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Monitor, RotateCw, Smartphone } from "lucide-react";
import { PREVIEW_DEVICES, type PreviewDevice, type PreviewDeviceId } from "../../lib/previewDevices";

interface PreviewPaneProps {
  frameRef: React.RefObject<HTMLIFrameElement>;
  ready: boolean;
  error: string | null;
  device: PreviewDevice;
  onDevice: (id: PreviewDeviceId) => void;
  onReload: () => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ frameRef, ready, error, device, onDevice, onReload }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const expandRef = useRef<HTMLButtonElement>(null);
  const [space, setSpace] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState<"screen" | "width" | "actual">("width");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => setSpace({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
        expandRef.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [expanded]);

  const scale = zoom === "actual" ? 1 : Math.max(0.05, Math.min(1, (space.width - 32) / device.width, zoom === "screen" ? (space.height - 32) / device.height : 1));
  const phone = device.width < 768;

  return (
    <section className={`preview-pane ${expanded ? "preview-pane-expanded" : ""}`} aria-label="Draft preview">
      <div className="preview-toolbar">
        <div className="preview-toolbar-row">
          <div className="editor-segmented" role="group" aria-label="Preview device">
            <button onClick={() => onDevice("desktop")} aria-pressed={!phone} aria-label="Desktop preview"><Monitor size={15} /> Desktop</button>
            <button onClick={() => onDevice("phone")} aria-pressed={phone} aria-label="Mobile preview"><Smartphone size={15} /> Mobile</button>
          </div>
          <div className="flex items-center gap-1">
            <button className="editor-icon-button" onClick={onReload} aria-label="Reload preview" title="Reload preview"><RotateCw size={16} /></button>
            <button ref={expandRef} className="editor-icon-button" onClick={() => setExpanded(!expanded)} aria-label={expanded ? "Close expanded preview" : "Expand preview"} title={expanded ? "Close (Esc)" : "Expand preview"}>
              {expanded ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
            </button>
          </div>
        </div>
        <div className="preview-toolbar-row preview-size-row">
          <label className="sr-only" htmlFor="preview-device">Screen size</label>
          <select id="preview-device" value={device.id} onChange={(e) => onDevice(e.target.value as PreviewDeviceId)}>
            {PREVIEW_DEVICES.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.width} × {item.height}</option>)}
          </select>
          <div className="editor-segmented preview-zoom" role="group" aria-label="Preview zoom">
            <button onClick={() => setZoom("screen")} aria-pressed={zoom === "screen"}>Fit screen</button>
            <button onClick={() => setZoom("width")} aria-pressed={zoom === "width"}>Fit width</button>
            <button onClick={() => setZoom("actual")} aria-pressed={zoom === "actual"}>100%</button>
          </div>
          <output className="preview-scale" aria-label="Preview scale">{Math.round(scale * 100)}%</output>
        </div>
      </div>
      {error && <p className="preview-error" role="alert">{error}</p>}
      <div ref={stageRef} className="preview-stage" data-preview-stage>
        <div className="preview-stage-inner" style={{ minWidth: zoom === "actual" ? device.width + 32 : undefined, minHeight: zoom === "screen" ? undefined : device.height * scale + 32 }}>
          <div className={`preview-screen ${phone ? "preview-screen-phone" : ""}`} style={{ width: device.width * scale, height: device.height * scale }}>
            <iframe ref={frameRef} src="/preview" title="Site preview" sandbox="allow-scripts allow-same-origin allow-popups" onLoad={() => frameRef.current?.contentWindow?.postMessage({ source: "portfolio-editor", type: "ping" }, window.location.origin)} style={{ width: device.width, height: device.height, transform: `scale(${scale})`, transformOrigin: "top left" }} />
            {!ready && <div className="preview-loading" role="status">Loading draft preview…</div>}
          </div>
        </div>
      </div>
      <div className="preview-caption"><span className="preview-live-dot" /> Draft preview <span className="ml-auto">{device.width} × {device.height} · {zoom === "actual" ? "Actual size" : zoom === "width" ? "Fit to width" : "Fit to screen"}</span></div>
    </section>
  );
};
