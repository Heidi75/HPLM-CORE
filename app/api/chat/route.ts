// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { hplmKernel } from '@/layers/3-dss-solvers/solver-registry'; // Importing the Kernel

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // 1. Layer 1 & 2 Simulation (Creating the Token)
    // In a full build, this comes from the parser. For the Skeleton, we simulate it.
    const token = {
      id: "TOK-001",
      payload: {
        subject: "GENERAL",
        parameters: { input: lastMessage }
      }
    };

    // 2. Layer 3: The Kernel Process
    // This is the line that fixes your "Stuck" error
    const kernelResult = await hplmKernel.process(token);

    // 3. Layer 6: Audit Stream
    // We stream the Kernel's result back to the user
    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `
        You are the HPLM Interface. 
        LAYER 3 STATUS: ${kernelResult.status}
        LAYER 3 MESSAGE: ${kernelResult.message || JSON.stringify(kernelResult)}
        
        Report this status to the user clearly.
      `,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("HPLM Critical Failure:", error);
    return new Response("Internal HPLM Error", { status: 500 });
  }
}
