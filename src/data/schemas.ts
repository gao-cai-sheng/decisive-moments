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

export const sourceNoteSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().optional(),
  noteZh: z.string().min(1),
});

export const thoughtEvidenceSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  summaryZh: z.string().min(20),
  source: z.object({
    workId: z.string().min(1).optional(),
    locator: z.string().min(1).optional(),
    publicDomainExcerptZh: z.string().optional(),
    excerptStatus: z.enum(["none", "public_domain", "summary_only"]),
  }),
});

export const thoughtClaimSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  claimZh: z.string().min(1),
  explanationZh: z.string().min(20),
  themeIds: z.array(z.string().min(1)).min(1),
  weight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  evidence: z.array(thoughtEvidenceSchema).min(1),
});

export const thoughtProblemSchema = z.object({
  id: z.string().min(1),
  titleZh: z.string().min(1),
  questionZh: z.string().min(1),
  summaryZh: z.string().min(20),
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
  oneLineZh: z.string().min(1),
  influenceWeight: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  reviewStatus: reviewStatusSchema,
});

export const philosopherSchema = philosopherIndexEntrySchema.extend({
  summaryZh: z.string().min(20),
  works: z.array(z.string().min(1)),
  sourceNotes: z.array(sourceNoteSchema),
  thoughtSystem: philosopherThoughtSystemSchema.optional(),
});

export const argumentSchema = z.object({
  id: z.string().min(1),
  philosopherId: z.string().min(1),
  themeIds: z.array(z.string().min(1)).min(1),
  questionZh: z.string().min(1),
  claimZh: z.string().min(1),
  explanationZh: z.string().min(20),
  source: z.object({
    workId: z.string().min(1).optional(),
    locator: z.string().min(1).optional(),
    publicDomainExcerptZh: z.string().optional(),
    excerptStatus: z.enum(["none", "public_domain", "summary_only"]),
  }),
  keywordsZh: z.array(z.string().min(1)),
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
  reviewStatus: reviewStatusSchema,
});

export const themeSchema = z.object({
  id: z.string().min(1),
  zh: z.string().min(1),
  en: z.string().min(1),
  aliasesZh: z.array(z.string().min(1)),
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
