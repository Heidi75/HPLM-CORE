import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { HPLM_Token_Schema } from '@/layers/2-ftl-formalizer/token-generator';
import { parseIncomingFile } from '@/layers/1-nil-intake/file-parser'; 

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, data } = await req.json();

  // 1. NIL PRE-PROCESSING: Run files through the parser logic first [cite: 26, 71]
  let parsedContext = "";
  if (data?.files) {
    const analysis = await Promise.all(
      data.files.map((f: any) => parseIncomingFile(f))
    );
    parsedContext = analysis.map(result => `EXTRACTED_DATA: ${result.rawContent}`).join("\n");
  }

  // 2. MULTI-MODAL MAPPING: Prepare the messages with raw files for Gemini [cite: 63, 67]
  const initialMessages = messages.map((m: any) => {
    if (m.role === 'user' && data?.files) {
      return {
        ...m,
        content: [
          { type: 'text', text: m.content },
          ...data.files.map((file: any) => ({
            type: file.type.startsWith('image/') ? 'image' : 'file',
            data: file.base64,
            mimeType: file.type,
          })),
        ],
      };
    }
    return m;
  });

  // 3. EXECUTION: Stream with strict Truth-Engine instructions [cite: 9, 40]
  const result = await streamText({
    model: google('gemini-1.5-flash'),
    system: `You are the Neural Intake Layer (NIL)[cite: 53].
             Your role: Linguistic Interface for "messy reality"[cite: 5].
             
             PARSED_CONTEXT: ${parsedContext}

             TASK: 
             1. Ingest raw unstructured data[cite: 24].
             2. Map patterns into Rigid Variables for the Layer 2 Schema[cite: 31]: 
                ${JSON.stringify(HPLM_Token_Schema)}
             
             FAILURE STATE: Do not prioritize "narrative fluency" over "physical truth"[cite: 9, 40].`,
    messages: initialMessages,
  });

  return result.toDataStreamResponse();
}
