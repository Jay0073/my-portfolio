import type { PortfolioContent } from "./contentSchema";
import type { PreviewDeviceId } from "./previewDevices";

export type FitStatus = "pass" | "fail" | "warning" | "skipped";
export interface FitCheck {
  group: string;
  section: string;
  name: string;
  status: FitStatus;
  detail: string;
  deviceId?: PreviewDeviceId;
  viewport?: string;
}

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const label = (element: Element) => (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 90);
const shown = (element: Element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== "hidden";
const sectionOf = (element: Element) => element.closest("section[id], footer[id]")?.id ?? "hero";

function result(section: string, group: string, name: string, status: FitStatus, detail: string): FitCheck {
  return { section, group, name, status, detail };
}

async function preparePage(): Promise<FitCheck[]> {
  const checks: FitCheck[] = [];
  const fontsReady = await Promise.race([document.fonts.ready.then(() => true), wait(6000).then(() => false)]);
  if (!fontsReady) checks.push(result("hero", "Page", "Fonts finished loading", "skipped", "Fonts were still loading. Run Fit Check again before judging text fit."));
  // Lazy imports and responsive components must have mounted before measuring.
  const sections = ["hero", "about", "experience", "projects", "skills", "education", "certificates", "footer"];
  for (let attempt = 0; attempt < 130; attempt++) {
    if (sections.every((section) => document.getElementById(section))) break;
    await wait(100);
  }
  document.querySelectorAll<HTMLImageElement>("img").forEach((image) => { image.loading = "eager"; });
  const maxY = document.documentElement.scrollHeight;
  for (let y = 0; y < maxY; y += Math.max(600, innerHeight)) {
    window.scrollTo({ top: y, behavior: "instant" });
    await wait(35);
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  await wait(450);
  return checks;
}

async function checkMedia(content: PortfolioContent): Promise<FitCheck[]> {
  const sources = [
    ...content.experience.map((entry) => ({ src: entry.logo, section: "experience", name: entry.company })),
    ...content.projects.map((entry) => ({ src: entry.image, section: "projects", name: entry.title })),
    ...content.certificates.map((entry) => ({ src: entry.src, section: "certificates", name: entry.name })),
  ];
  const unique = [...new Map(sources.map((source) => [source.section + source.src, source])).values()];
  const states = await Promise.all(unique.map(async (source) => {
    const video = /\.(mp4|webm|ogg)(?:[?#]|$)/i.test(source.src);
    const media = video ? document.createElement("video") : new Image();
    const status = await new Promise<FitStatus>((resolve) => {
      let settled = false;
      const finish = (value: FitStatus) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        media.onload = null;
        media.onerror = null;
        if (media instanceof HTMLVideoElement) { media.onloadedmetadata = null; media.removeAttribute("src"); media.load(); }
        resolve(value);
      };
      const timer = setTimeout(() => finish("skipped"), 7000);
      media.onerror = () => finish("fail");
      if (media instanceof HTMLVideoElement) { media.preload = "metadata"; media.onloadedmetadata = () => finish("pass"); }
      else media.onload = () => finish(media.naturalWidth > 0 ? "pass" : "fail");
      media.src = source.src;
    });
    return { ...source, status };
  }));
  const checks: FitCheck[] = [];
  for (const section of ["experience", "projects", "certificates"]) {
    const entries = states.filter((state) => state.section === section);
    if (!entries.length) continue;
    const failed = entries.filter((entry) => entry.status === "fail");
    const pending = entries.filter((entry) => entry.status === "skipped");
    checks.push(result(section, "Media", "Images and videos load", failed.length ? "fail" : pending.length ? "skipped" : "pass",
      failed.length ? "Could not load: " + failed.map((entry) => entry.name + " (" + entry.src + ")").join("; ")
        : pending.length ? "Still loading: " + pending.map((entry) => entry.name).join(", ") + ". These assets were not verified."
        : entries.length + " unique media assets loaded."));
  }
  return checks;
}

function checkPage(content: PortfolioContent): FitCheck[] {
  const checks: FitCheck[] = [];
  checks.push(result("hero", "Page", "Page fits the screen", document.documentElement.scrollWidth > innerWidth + 2 ? "fail" : "pass",
    "Page width " + document.documentElement.scrollWidth + "px; screen width " + innerWidth + "px."));
  for (const section of ["hero", "about", "experience", "projects", "skills", "education", "certificates", "footer"]) {
    const root = document.getElementById(section);
    if (!root || !shown(root)) {
      checks.push(result(section, "Layout", "Section could not be checked", "skipped", "This section did not finish rendering. Reload the preview and try again."));
      continue;
    }
    const clipped = new Set<string>();
    for (const text of root.querySelectorAll<HTMLElement>("h1, h2, h3, p, li, [data-fit-text]")) {
      if (!shown(text) || text.closest('[data-fit="audit-root"]') || !label(text)) continue;
      let node: HTMLElement | null = text;
      let intentionalScroll = false;
      while (node && node !== root) {
        const style = getComputedStyle(node);
        if (/(auto|scroll)/.test(style.overflowY + style.overflowX)) { intentionalScroll = true; break; }
        node = node.parentElement;
      }
      if (intentionalScroll) continue;
      const style = getComputedStyle(text);
      const clippedX = text.scrollWidth > text.clientWidth + 3 && /(hidden|clip)/.test(style.overflowX);
      const clippedY = text.scrollHeight > text.clientHeight + 3 && /(hidden|clip)/.test(style.overflowY);
      if (clippedX || clippedY) clipped.add(label(text));
      node = text.parentElement;
      const bounds = text.getBoundingClientRect();
      while (node && node !== root) {
        const parentStyle = getComputedStyle(node);
        const parent = node.getBoundingClientRect();
        // Ignore rotated book layers and decorative SVG viewports.
        if (parentStyle.transform !== "none" || node.closest("svg")) break;
        if (/(hidden|clip)/.test(parentStyle.overflowY) && (bounds.bottom > parent.bottom + 4 || bounds.top < parent.top - 4)) clipped.add(label(text));
        if (/(hidden|clip)/.test(parentStyle.overflowX) && (bounds.right > parent.right + 4 || bounds.left < parent.left - 4)) clipped.add(label(text));
        node = node.parentElement;
      }
    }
    checks.push(result(section, "Layout", "Text remains readable", clipped.size ? "fail" : "pass", clipped.size ? "Clipped text: " + [...clipped].slice(0, 5).join("; ") : "No clipped headings, paragraphs, or list text detected."));
  }
  const stats = Array.from(document.querySelectorAll<HTMLElement>('#about [data-fit="about-stat"]')).filter(shown);
  const statsMatch = stats.length === content.about.stats.length && stats.every((element, index) => {
    const text = element.textContent ?? "";
    return text.includes(content.about.stats[index].label) && text.includes(content.about.stats[index].value);
  });
  checks.push(result("about", "Content", "Stat labels match your draft", statsMatch ? "pass" : "fail", statsMatch ? "Every visible value and label matches the editor." : "A stat value or label differs from your draft."));
  return checks;
}

async function checkAnimation(content: PortfolioContent): Promise<FitCheck[]> {
  if (!content.about.lottieUrl) return [result("about", "Animation", "About illustration", "skipped", "No animation URL is set. The section uses its text-only layout.")];
  if (innerWidth < 768) return [result("about", "Animation", "About illustration", "skipped", "Hidden on phones by design, just as on the website.")];
  let animation = document.querySelector<HTMLElement>('[data-fit="about-animation"]');
  for (let attempt = 0; attempt < 60 && (!animation || animation.dataset.loadState === "loading"); attempt++) {
    await wait(100);
    animation = document.querySelector<HTMLElement>('[data-fit="about-animation"]');
  }
  const state = animation?.dataset.loadState;
  const checks = [result("about", "Animation", "About illustration loads", state === "loaded" ? "pass" : state === "error" ? "fail" : "skipped",
    state === "loaded" ? "The Lottie player loaded the animation." : state === "error" ? "The animation could not load. Check its URL." : "The animation did not finish loading; its appearance was not verified.")];
  if (animation && state === "loaded") {
    const bounds = animation.getBoundingClientRect();
    const canvas = animation.querySelector("canvas");
    checks.push(result("about", "Animation", "Illustration keeps its proportions", canvas && bounds.width > 0 && Math.abs(bounds.width - bounds.height) < 3 ? "pass" : "fail", "The illustration uses contain sizing in a bounded square; artwork keeps its original proportions."));
  }
  return checks;
}

function checkProjects(content: PortfolioContent): FitCheck[] {
  if (!content.projects.length) return [result("projects", "Content", "Project pages", "skipped", "No projects in this draft.")];
  const frames = Array.from(document.querySelectorAll<HTMLElement>('[data-fit="project-frame"]'));
  if (frames.length !== content.projects.length) return [result("projects", "Content", "Every project page is checked", "skipped", "Project measurement pages were not ready. Run the check again.")];
  return frames.map((frame) => {
    const clipped = frame.scrollHeight > frame.clientHeight + 3 || frame.scrollWidth > frame.clientWidth + 3;
    const scrollers = Array.from(frame.querySelectorAll<HTMLElement>("*")).filter((element) => {
      const style = getComputedStyle(element);
      return (/(auto|scroll)/.test(style.overflowY) && element.scrollHeight > element.clientHeight + 3) || (/(auto|scroll)/.test(style.overflowX) && element.scrollWidth > element.clientWidth + 3);
    });
    return result("projects", "Content", frame.dataset.projectTitle ?? "Project page", clipped ? "fail" : scrollers.length ? "warning" : "pass",
      clipped ? "Content extends beyond the project page and may be cut off."
        : scrollers.length ? "All content is reachable, but this page needs internal scrolling. Shorten the description for a cleaner fit."
        : "Content fits its actual " + frame.clientWidth + " × " + frame.clientHeight + "px book page.");
  });
}

function checkSkills(content: PortfolioContent): FitCheck[] {
  if (!content.skills.length) return [result("skills", "Content", "Skill descriptions", "skipped", "No skills in this draft.")];
  const nodes = Array.from(document.querySelectorAll<SVGGElement>("#skills .bubble-node"));
  if (nodes.length !== content.skills.length) return [result("skills", "Content", "Skill descriptions", "skipped", "Skill bubbles did not finish rendering.")];
  const clipped: string[] = [];
  nodes.forEach((node, index) => {
    const frame = node.querySelector("foreignObject");
    const hoverText = node.querySelector<HTMLElement>("foreignObject > div > div:nth-child(2) > div");
    if (!frame || !hoverText) return;
    if (hoverText.scrollHeight > frame.height.baseVal.value - 4 || hoverText.scrollWidth > frame.width.baseVal.value - 12) clipped.push(content.skills[index].name);
  });
  return [result("skills", "Content", "Hover text fits inside bubbles", clipped.length ? "warning" : "pass", clipped.length ? "Long descriptions in: " + clipped.join(", ") + ". Shorten these in the editor if the bubble clips on hover." : nodes.length + " hover descriptions checked inside their circles.")];
}

function checkAccessibility(): FitCheck[] {
  const mainElements = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector)).filter((element) => !element.closest('[data-fit="audit-root"]') && shown(element));
  const headings = mainElements("h1");
  const missingAlt = mainElements<HTMLImageElement>("img").filter((image) => !image.hasAttribute("alt"));
  const unnamed = mainElements<HTMLElement>("a, button").filter((element) => !label(element) && !element.getAttribute("aria-label")?.trim() && !element.getAttribute("title")?.trim() && !element.querySelector("img[alt]:not([alt=''])"));
  return [
    result("hero", "Accessibility", "One main heading", headings.length === 1 ? "pass" : "fail", "Found " + headings.length + " visible main headings."),
    result(missingAlt.length ? sectionOf(missingAlt[0]) : "hero", "Accessibility", "Images have alternative text", missingAlt.length ? "warning" : "pass", missingAlt.length ? missingAlt.length + " images have no alt attribute." : "Every image has an alt attribute; decorative images may use empty alt text."),
    result(unnamed.length ? sectionOf(unnamed[0]) : "hero", "Accessibility", "Links and buttons have names", unnamed.length ? "warning" : "pass", unnamed.length ? unnamed.length + " visible controls need an accessible label." : "Every visible link and button has a name."),
  ];
}

export async function runFitChecks(content: PortfolioContent): Promise<FitCheck[]> {
  const preparation = await preparePage();
  const [media, animation] = await Promise.all([checkMedia(content), checkAnimation(content)]);
  return [...preparation, ...checkPage(content), ...media, ...animation, ...checkProjects(content), ...checkSkills(content), ...checkAccessibility()];
}
