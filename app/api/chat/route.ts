// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { hplmKernel } from '@/layers/3-dss-solvers/solver-registry';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // Simulation of Layers 1 & 2
    const token = {
      payload: { subject: "GENERAL", parameters: { input: lastMessage } }
    };

    // Layer 3: Semantic Signaling
    const kernelResult = await hplmKernel.process(token);

    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `
        HPLM CORE STATUS REPORT:
        -------------------------
        LAYER 1: [SUCCESS] - Ingestion complete.
        LAYER 2: [SUCCESS] - Tokenization simulated.
        LAYER 3: [${kernelResult.status}] - ${kernelResult.message}
        -------------------------
        
        INSTRUCTIONS:
        1. Report the status of all layers to the user.
        2. If Layer 3 is UNCONFIGURED, explain that the system is in "SKELETON_DEMO" mode.
        3. Do NOT provide a general AI answer. Act only as the HPLM System Interface.
      `,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    return new Response("Kernel Reporting Error", { status: 500 });
  }
}
