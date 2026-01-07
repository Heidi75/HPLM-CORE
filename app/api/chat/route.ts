import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { HPLM_Token_Schema } from '@/layers/2-ftl-formalizer/token-generator';

export const maxDuration = 30;

export async function POST(req: Request) {
  // 1. Extract 'messages' and the 'data' (which contains your files/photos)
  const { messages, data } = await req.json();

  // 2. Multi-Modal Integration: Attach files to the last user message
  const initialMessages = messages.map((m: any) => {
    if (m.role === 'user' && data?.files) {
      return {
        ...m,
        content: [
          { type: 'text', text: m.content },
          ...data.files.map((file: any) => ({
            type: 'file',
            data: file.base64,
            mimeType: file.type,
          })),
        ],
      };
    }
    return m;
  });

  const result = await streamText({
    model: google('gemini-1.5-flash'),
    // 3. Strict System Instructions + Schema Awareness
    system: `You are the Neural Intake Layer (NIL) of the HPLM Core. [cite: 6]
             Your role: Linguistic Interface for "messy reality" (papers, images, charts). 
             
             TASK: 
             1. Ingest raw unstructured data. [cite: 6]
             2. Identify patterns to be mapped into Rigid Variables. [cite: 12]
             3. Format your internal reasoning to satisfy this Layer 2 Schema: 
                ${JSON.stringify(HPLM_Token_Schema)}
             
             FAILURE STATE: Do not prioritize "narrative fluency" over "physical truth." [cite: 9]`,
    messages: initialMessages,
  });

  return result.toDataStreamResponse();
}
