import { z } from "zod";

export const reviewStatusSchema = z.enum(["draft", "reviewed"]);
export const philosopherTierSchema = z.enum(["standard", "seed"]);
export const relationshipTypeSchema = z.enum([
  "direct_student",
  "influence",
  "school",
  "shared_problem",
  "critique",
  "reception",
]);

// En 字段统一 optional：内容翻译渐进推进（codex 产 → 盲审 → admit），
// 缺失时前端经 pickText/pickName 回退 Zh。填了就必须非空（validate-data 把关）。
export const sourceNoteSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
  noteZh: z.string().min(1),
  noteEn: z.string().min(1).optional(),
});

export const thoughtEvidenceSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  summaryZh: z.string().min(20),
  summaryEn: z.string().min(1).optional(),
  source: z.object({
    workId: z.string().min(1).optional(),
    locator: z.string().min(1).optional(),
    publicDomainExcerptZh: z.string().optional(),
    publicDomainExcerptEn: z.string().min(1).optional(),
    excerptStatus: z.enum(["none", "public_domain", "summary_only"]),
  }),
});

export const thoughtClaimSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  claimZh: z.string().min(1),
  claimEn: z.string().min(1).optional(),
  explanationZh: z.string().min(20),
  explanationEn: z.string().min(1).optional(),
  themeIds: z.array(z.string().min(1)).min(1),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  evidence: z.array(thoughtEvidenceSchema).min(1),
});

export const thoughtProblemSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  questionZh: z.string().min(1),
  questionEn: z.string().min(1).optional(),
  summaryZh: z.string().min(20),
  summaryEn: z.string().min(1).optional(),
  themeIds: z.array(z.string().min(1)).min(1),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  claims: z.array(thoughtClaimSchema).min(1),
});

export const philosopherThoughtSystemSchema = z.object({
  problems: z.array(thoughtProblemSchema).min(1),
});

export const philosopherIndexEntrySchema = z.object({
  id: z.string().min(1),
  tier: philosopherTierSchema,
  names: z.object({
    zh: z.string().min(1),
    en: z.string().min(1),
    native: z.string().min(1).optional(),
  }),
  life: z.object({
    birth: z.number().optional(),
    death: z.number().optional(),
    display: z.string().min(1),
  }),
  civilization: z.string().min(1),
  traditions: z.array(z.string().min(1)).min(1),
  periods: z.array(z.string().min(1)).min(1),
  themes: z.array(z.string().min(1)).min(1),
  keywordsZh: z.array(z.string().min(1)),
  keywordsEn: z.array(z.string().min(1)).optional(),
  oneLineZh: z.string().min(1),
  oneLineEn: z.string().min(1).optional(),
  influenceWeight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reviewStatus: reviewStatusSchema,
});

export const philosopherSchema = philosopherIndexEntrySchema.extend({
  summaryZh: z.string().min(20),
  summaryEn: z.string().min(1).optional(),
  works: z.array(z.string().min(1)),
  sourceNotes: z.array(sourceNoteSchema),
  thoughtSystem: philosopherThoughtSystemSchema.optional(),
});

export const argumentSchema = z.object({
  id: z.string().min(1),
  philosopherId: z.string().min(1),
  themeIds: z.array(z.string().min(1)).min(1),
  questionZh: z.string().min(1),
  questionEn: z.string().min(1).optional(),
  claimZh: z.string().min(1),
  claimEn: z.string().min(1).optional(),
  explanationZh: z.string().min(20),
  explanationEn: z.string().min(1).optional(),
  source: z.object({
    workId: z.string().min(1).optional(),
    locator: z.string().min(1).optional(),
    publicDomainExcerptZh: z.string().optional(),
    publicDomainExcerptEn: z.string().min(1).optional(),
    excerptStatus: z.enum(["none", "public_domain", "summary_only"]),
  }),
  keywordsZh: z.array(z.string().min(1)),
  keywordsEn: z.array(z.string().min(1)).optional(),
  reviewStatus: reviewStatusSchema,
});

export const relationshipSchema = z.object({
  id: z.string().min(1),
  from: z.string().min(1),
  to: z.string().min(1),
  type: relationshipTypeSchema,
  strength: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  confidence: z.enum(["high", "medium", "low"]),
  themeIds: z.array(z.string().min(1)),
  noteZh: z.string().min(1),
  noteEn: z.string().min(1).optional(),
  reviewStatus: reviewStatusSchema,
});

export const themeSchema = z.object({
  id: z.string().min(1),
  zh: z.string().min(1),
  en: z.string().min(1),
  aliasesZh: z.array(z.string().min(1)),
  aliasesEn: z.array(z.string().min(1)).optional(),
  parentId: z.string().min(1).optional(),
});

export const workSchema = z.object({
  id: z.string().min(1),
  philosopherId: z.string().min(1),
  titleZh: z.string().min(1),
  titleEn: z.string().min(1).optional(),
  originalTitle: z.string().min(1).optional(),
  yearDisplay: z.string().min(1).optional(),
  noteZh: z.string().min(1),
  noteEn: z.string().min(1).optional(),
});

export type ReviewStatus = z.infer<typeof reviewStatusSchema>;
export type PhilosopherTier = z.infer<typeof philosopherTierSchema>;
export type RelationshipType = z.infer<typeof relationshipTypeSchema>;
export type ThoughtEvidence = z.infer<typeof thoughtEvidenceSchema>;
export type ThoughtClaim = z.infer<typeof thoughtClaimSchema>;
export type ThoughtProblem = z.infer<typeof thoughtProblemSchema>;
export type PhilosopherThoughtSystem = z.infer<typeof philosopherThoughtSystemSchema>;
export type PhilosopherIndexEntry = z.infer<typeof philosopherIndexEntrySchema>;
export type Philosopher = z.infer<typeof philosopherSchema>;
export type Argument = z.infer<typeof argumentSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type Work = z.infer<typeof workSchema>;
