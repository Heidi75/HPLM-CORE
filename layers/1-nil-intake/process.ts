import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// 1. Initialize the provider using your specific variable name
// This maps GOOGLE_API_KEY to the SDK's internal apiKey field
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY, 
});

const HPLM_Token_Schema = z.object({
  claim_id: z.string(),
  subject: z.string().describe('The entity being audited'),
  variables: z.record(z.any()).describe('Formalized data extracted'),
  certainty_score: z.number().min(0).max(1),
});

export async function intakeAndFormalize(userInput: string) {
  // 2. Use the provider instance 'google' to select the model
  // Note: We no longer pass an object here, which fixes the Railway Type Error
  const { object } = await generateObject({
    model: google('gemini-2.0-flash-exp'),
    system: `You are the Neural Intake Layer (NIL) of the HPLM. 
             Convert the messy user input into the HPLM Token Format. 
             Be precise; Layer 4 (The Truth Engine) will audit your work.`,
    schema: HPLM_Token_Schema,
    prompt: userInput,
  });

  return object; 
}
