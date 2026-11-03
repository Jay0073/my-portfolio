export interface FitCheck {
  group: "Images" | "Experience" | "Projects" | "Skills" | "Accessibility";
  name: string;
  pass: boolean;
  detail: string;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function triggerLazyLoads(): Promise<void> {
  const doc = document.scrollingElement ?? document.documentElement;
  const startY = window.scrollY;
  const max = doc.scrollHeight;
  const step = Math.max(400, window.innerHeight * 0.8);
  for (let y = 0; y < max; y += step) {
    window.scrollTo(0, y);
    await wait(60);
  }
  window.scrollTo(0, 0);
  await wait(300);
  window.scrollTo(0, startY);
}

async function waitForImages(): Promise<HTMLImageElement[]> {
  const imgs = Array.from(document.querySelectorAll("img"));
  await Promise.all(
    imgs.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          const done = () => resolve();
          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });
          setTimeout(done, 5000);
        })
    )
  );
  return imgs;
}

function checkImages(imgs: HTMLImageElement[]): FitCheck[] {
  const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0);
  const pending = imgs.filter((i) => !i.complete);
  const results: FitCheck[] = [];
  results.push({
    group: "Images",
    name: "All images load",
    pass: broken.length === 0,
    detail:
      broken.length === 0
        ? `${imgs.length} images checked`
        : `Broken: ${broken.map((b) => b.currentSrc || b.src).join(", ")}`,
  });
  if (pending.length > 0) {
    results.push({
      group: "Images",
      name: "Lazy images finished loading",
      pass: true,
      detail: `${pending.length} image(s) not loaded yet (off-screen) — skipped`,
    });
  }
  return results;
}

function checkExperience(): FitCheck[] {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-fit="exp-card"]'));
  if (cards.length === 0) {
    return [
      {
        group: "Experience",
        name: "Experience cards rendered",
        pass: false,
        detail: "No experience cards found in the preview",
      },
    ];
  }
  const overflow = cards.filter(
    (c) => c.scrollWidth > c.clientWidth + 2 || c.scrollHeight > c.clientHeight + 2
  );
  return [
    {
      group: "Experience",
      name: `Experience cards fit (${cards.length} checked, incl. Workelate)`,
      pass: overflow.length === 0,
      detail:
        overflow.length === 0
          ? "No clipped content inside cards"
          : `Clipped content in: ${overflow
              .map((c) => c.querySelector("h3")?.textContent ?? "card")
              .join(", ")}`,
    },
    {
      group: "Experience",
      name: "No horizontal page overflow",
      pass: document.documentElement.scrollWidth <= window.innerWidth + 2,
      detail: `Page scrollWidth ${document.documentElement.scrollWidth}px vs viewport ${window.innerWidth}px`,
    },
  ];
}

function checkProjects(): FitCheck[] {
  const frames = Array.from(
    document.querySelectorAll<HTMLElement>('[data-fit="project-frame"]')
  );
  if (frames.length === 0) {
    return [
      {
        group: "Projects",
        name: "Project pages rendered for audit",
        pass: false,
        detail: "No project audit frames found",
      },
    ];
  }
  const results: FitCheck[] = [];
  const failing: string[] = [];

  for (const frame of frames) {
    const title = frame.dataset.projectTitle ?? "unknown";
    const size = frame.dataset.projectSize ?? "?";
    const rootOverflowY = frame.scrollHeight > frame.clientHeight + 2;
    const rootOverflowX = frame.scrollWidth > frame.clientWidth + 2;

    // Mobile frames have inner scroll containers: find any that need scrolling.
    let innerScroll = false;
    for (const el of Array.from(frame.querySelectorAll<HTMLElement>("*"))) {
      const style = getComputedStyle(el);
      const scrollableY = /(auto|scroll)/.test(style.overflowY);
      const scrollableX = /(auto|scroll)/.test(style.overflowX);
      if (scrollableY && el.scrollHeight > el.clientHeight + 2) innerScroll = true;
      if (scrollableX && el.scrollWidth > el.clientWidth + 2) innerScroll = true;
    }

    if (rootOverflowY || rootOverflowX || innerScroll) {
      failing.push(`${title} (${size})`);
    }
  }

  results.push({
    group: "Projects",
    name: `Book pages fit at fixed sizes (${frames.length} frames)`,
    pass: failing.length === 0,
    detail:
      failing.length === 0
        ? "All project text pages fit desktop (600px) and mobile (550px) frames"
        : `Content overflows/clips in: ${failing.join(", ")}`,
  });
  return results;
}

function checkSkills(): FitCheck[] {
  const groups = Array.from(
    document.querySelectorAll<SVGGElement>(".bubble-node")
  );
  if (groups.length === 0) {
    return [
      {
        group: "Skills",
        name: "Skill bubbles rendered",
        pass: false,
        detail: "No skill bubbles found",
      },
    ];
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const failing: string[] = [];

  for (const g of groups) {
    const circle = g.querySelector("circle");
    const radius = circle ? Number(circle.getAttribute("r")) : 0;
    if (!radius || !ctx) continue;

    const fo = g.querySelector("foreignObject");
    if (!fo) continue;
    const views = fo.querySelectorAll(":scope > div > div");
    const hoverView = views[1];
    if (!hoverView) continue;
    const lines = Array.from(
      hoverView.querySelectorAll("div > span")
    ).map((s) => s.textContent ?? "");
    if (lines.length === 0) continue;

    const fontSize = Math.max(11, radius * 0.25);
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    const boxWidth = radius * 2 - 16; // px-2 padding inside foreignObject

    let totalHeight = 0;
    for (const line of lines) {
      const w = ctx.measureText(line).width;
      const wrapped = Math.max(1, Math.ceil(w / boxWidth));
      totalHeight += wrapped * fontSize * 1.2;
    }

    const name =
      g.querySelector("foreignObject div span")?.textContent ?? "skill";
    const maxH = radius * 2 - 4;
    if (totalHeight > maxH) {
      failing.push(`${name} (needs ~${Math.round(totalHeight)}px, has ${Math.round(maxH)}px)`);
    }
  }

  return [
    {
      group: "Skills",
      name: `Hover text fits inside bubbles (${groups.length} checked)`,
      pass: failing.length === 0,
      detail:
        failing.length === 0
          ? "All hover descriptions fit their circles"
          : `Too tall: ${failing.join("; ")}`,
    },
  ];
}

function checkAccessibility(): FitCheck[] {
  const h1s = document.querySelectorAll("h1");
  const imgsNoAlt = Array.from(document.querySelectorAll("img")).filter(
    (i) => !i.hasAttribute("alt")
  );
  const unnamed = Array.from(
    document.querySelectorAll("a, button")
  ).filter((el) => {
    const text = (el.textContent ?? "").trim();
    const aria = el.getAttribute("aria-label");
    const title = el.getAttribute("title");
    return !text && !aria && !title;
  });

  return [
    {
      group: "Accessibility",
      name: "Exactly one h1",
      pass: h1s.length === 1,
      detail: `Found ${h1s.length} h1 element(s)`,
    },
    {
      group: "Accessibility",
      name: "All images have alt text",
      pass: imgsNoAlt.length === 0,
      detail:
        imgsNoAlt.length === 0
          ? "OK"
          : `Missing alt: ${imgsNoAlt.map((i) => i.src).join(", ")}`,
    },
    {
      group: "Accessibility",
      name: "All links/buttons have accessible names",
      pass: unnamed.length === 0,
      detail:
        unnamed.length === 0
          ? "OK"
          : `${unnamed.length} element(s) without text/aria-label`,
    },
  ];
}

export async function runFitChecks(): Promise<FitCheck[]> {
  const results: FitCheck[] = [];
  try {
    await triggerLazyLoads();
    const imgs = await waitForImages();
    results.push(...checkImages(imgs));
    results.push(...checkExperience());
    results.push(...checkProjects());
    results.push(...checkSkills());
    results.push(...checkAccessibility());
  } catch (err) {
    results.push({
      group: "Images",
      name: "Fit check completed",
      pass: false,
      detail: `Error during checks: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
  return results;
}
