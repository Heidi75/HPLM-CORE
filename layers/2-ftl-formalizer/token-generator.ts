import { z } from 'zod';

/**
 * The Universal HPLM Token.
 * Every claim entering the Truth Engine must fit this schema.
 */
export const HPLM_Token_Schema = z.object({
  claim_id: z.string().uuid().default(() => crypto.randomUUID()),
  timestamp: z.number().default(() => Date.now()),
  
  // The Formalized Data
  payload: z.object({
    subject: z.string().describe('The core entity being audited'),
    // FIX: Added z.string() as the first argument to satisfy the 2-argument requirement
    parameters: z.record(z.string(), z.any()).describe('The numerical or categorical variables'),
    constraints: z.array(z.string()).optional().describe('Known limits or rules'),
  }),

  // Metadata for the Audit Layer (TAL)
  metadata: z.object({
    neural_confidence: z.number().min(0).max(1),
    source_layer: z.string().default('NIL'),
  })
});

export type HPLM_Token = z.infer<typeof HPLM_Token_Schema>;
