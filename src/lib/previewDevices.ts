export const PREVIEW_DEVICES = [
  { id: "desktop", label: "Desktop", width: 1440, height: 900 },
  { id: "laptop", label: "Laptop", width: 1280, height: 800 },
  { id: "phone", label: "Phone", width: 390, height: 844 },
  { id: "small-phone", label: "Small phone", width: 360, height: 800 },
  { id: "large-phone", label: "Large phone", width: 430, height: 932 },
] as const;

export type PreviewDevice = (typeof PREVIEW_DEVICES)[number];
export type PreviewDeviceId = PreviewDevice["id"];

export function previewSection(section: string): string {
  if (section === "header" || section === "meta") return "hero";
  if (section === "quotes") return "footer";
  return section;
}
