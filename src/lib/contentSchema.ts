import { z } from "zod";

// Safe URL: http(s), mailto, relative path, blob, or inline image data.
// Rejects javascript: and other dangerous schemes.
export const safeUrl = z
  .string()
  .min(1)
  .refine(
    (v) =>
      /^(https?:\/\/|mailto:|\/(?!\/)|\.\/|\.\.\/|blob:|data:image\/)/i.test(v),
    { message: "Must be http(s), mailto, relative path, blob, or image data" }
  )
  .refine((v) => !/^\s*javascript:/i.test(v), {
    message: "javascript: URLs are not allowed",
  });

const SocialLinkSchema = z.object({
  icon: z.string().min(1),
  href: safeUrl,
  label: z.string(),
});

const ExperienceSchema = z.object({
  company: z.string().min(1),
  logo: safeUrl,
  role: z.string().min(1),
  dates: z.string(),
  description: z.string(),
  skills: z.array(z.string()),
  stickyTop: z.number(),
});

const ProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  image: safeUrl,
  tags: z.array(z.string()),
  links: z
    .object({
      demo: safeUrl.optional(),
      repo: safeUrl.optional(),
    })
    .optional(),
});

const SkillSchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
  percent: z.number().min(0).max(100),
  desc: z.array(z.string()),
});

const EducationSchema = z.object({
  year: z.string(),
  institution: z.string().min(1),
  course: z.string(),
  icon: z.string(),
});

const CertificateSchema = z.object({
  src: safeUrl,
  name: z.string().min(1),
  issuer: z.string(),
  year: z.string().optional(),
});

const QuoteSchema = z.object({
  text: z.string().min(1),
  author: z.string().min(1),
});

export const PortfolioContentSchema = z.object({
  schemaVersion: z.number().default(1),
  meta: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    canonical: safeUrl,
    ogImage: safeUrl,
  }),
  hero: z.object({
    name: z.string().min(1),
    phrases: z.array(z.string().min(1)).min(1),
    buttonText: z.string(),
  }),
  about: z.object({
    bio: z.string(),
    stats: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .min(1),
    values: z.array(z.string()).min(1),
    socialLinks: z.array(SocialLinkSchema),
    resumeUrl: safeUrl,
    lottieUrl: safeUrl.optional(),
  }),
  experience: z.array(ExperienceSchema),
  projects: z.array(ProjectSchema),
  skills: z.array(SkillSchema),
  education: z.array(EducationSchema),
  certificates: z.array(CertificateSchema),
  quotes: z.array(QuoteSchema),
  footer: z.object({
    quote: z.string(),
    words: z.array(z.string()).min(1),
    socialLinks: z.array(SocialLinkSchema),
    tagline: z.string(),
    copyright: z.string(),
  }),
  header: z.object({
    socialLinks: z.array(SocialLinkSchema),
  }),
});

export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type ExperienceEntry = z.infer<typeof ExperienceSchema>;
export type ProjectEntry = z.infer<typeof ProjectSchema>;
export type SkillEntry = z.infer<typeof SkillSchema>;
export type EducationEntry = z.infer<typeof EducationSchema>;
export type CertificateEntry = z.infer<typeof CertificateSchema>;
export type QuoteEntry = z.infer<typeof QuoteSchema>;
