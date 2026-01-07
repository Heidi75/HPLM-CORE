import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { HPLM_Token_Schema } from '@/layers/2-ftl-formalizer/token-generator';
// This tells Vercel: "Use the Core Skeleton logic to package this chat."

export const maxDuration = 30; // Necessary for cloud functions

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    // Strict System Instructions for the Core Skeleton
    system: `You are the Neural Intake Layer (NIL) of the HPLM Core. 
             Your role is Linguistic Interface only. 
             1. Ingest user claims. 
             2. Prepare data for Layer 2 Formalization. 
             Do not assume domain-specific rules unless provided.`,
    messages,
  });

  return result.toDataStreamResponse();
}
