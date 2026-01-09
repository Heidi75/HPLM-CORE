import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { HPLM_Token_Schema } from '@/layers/2-ftl-formalizer/token-generator';
import { parseIncomingFile } from '@/layers/1-nil-intake/file-parser'; 

export const runtime = 'edge'; // Optimizes for mobile speed
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  // 1. NIL PRE-PROCESSING: Convert messy data into Rigid Variables
  let parsedContext = "";
  if (data?.files && data.files.length > 0) {
    const analysis = await Promise.all(
      data.files.map((f: any) => parseIncomingFile(f))
    );
    parsedContext = analysis.map(result => result.rawContent).join("\n");
  }

  // 2. MULTI-MODAL MAPPING: Feed images/files directly to Gemini 1.5 Flash
  const initialMessages = messages.map((m: any) => {
    if (m.role === 'user' && data?.files) {
      return {
        ...m,
        content: [
          { type: 'text', text: m.content },
          ...data.files.map((file: any) => ({
            type: 'file', // Gemini 1.5 handles images and PDFs under the 'file' abstraction in the SDK
            data: file.base64,
            mimeType: file.type,
          })),
        ],
      };
    }
    return m;
  });

  // 3. EXECUTION: The Truth-Engine Safe Harbor
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `SYSTEM_ARCH: 7-LAYER PYRAMID MOAT.
             CURRENT_LAYER: 1 (Neural Intake Layer).
             
             PARSED_CONTEXT_FROM_NIL: ${parsedContext}
             LOGIC_SCHEMA: ${JSON.stringify(HPLM_Token_Schema)}

             OPERATIONAL_DIRECTIVE: 
             1. You are the Linguistic Interface for the user's messy reality.
             2. Use the provided Magnesium Taurate data or design notes to fill the Logic Schema.
             3. If the user asks for an audit, skip narrative fluff and move to Layer 4 (Validation).
             4. Maintain a 100% Truth-to-Input ratio.`,
    messages: initialMessages,
  });

  return result.toDataStreamResponse();
}
