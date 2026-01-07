import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// This is the FTL (Layer 2) Schema - The "Rigid Variables"
const HPLM_Token_Schema = z.object({
  claim_id: z.string(),
  subject: z.string().describe('The entity being audited (User, Physics Paper, etc)'),
  variables: z.record(z.any()).describe('The formalized math/data extracted from the claim'),
  certainty_score: z.number().min(0).max(1),
});

export async function intakeAndFormalize(userInput: string) {
  // Layer 1 (NIL) uses the LLM as a high-dimensional pattern recognizer
  const { object } = await generateObject({
    model: google('gemini-1.5-flash'),
    system: `You are the Neural Intake Layer (NIL) of the HPLM. 
             Convert the messy user input into the HPLM Token Format. 
             Be precise; Layer 4 (The Truth Engine) will audit your work.`,
    schema: HPLM_Token_Schema,
    prompt: userInput,
  });

  // PASS TO LAYER 3 (Solver) or LAYER 4 (Arena)
  return object; 
}
