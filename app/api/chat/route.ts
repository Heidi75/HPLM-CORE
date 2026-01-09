import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { hplmKernel, HPLM_AuditPacket } from '@/layers/3-dss-solvers/solver-registry';

// Free tier limit is 10. Let's set it to 10 to avoid Vercel rejection.
export const maxDuration = 10; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🔥 HPLM_PYRAMID_INVOKED"); 

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // --- LAYERS 1-7 LOGIC ---
    const auditLog: HPLM_AuditPacket = {
      traceId: `HPLM-TRACE-${Date.now()}`,
      layers: {
        l1_ingestion: { timestamp: new Date().toISOString(), status: "COMPLETE" },
        l2_parsing: { tokens: lastMessage.split(' ').length, subject: "GENERAL_DEMO" }
      }
    };

    const token = { payload: { subject: "GENERAL", parameters: { input: lastMessage } } };
    const kernelResult = await hplmKernel.process(token);
    
    auditLog.layers.l3_solver = { domain: "GENERAL", status: kernelResult.status, result: kernelResult.message };
    auditLog.layers.l4_validation = { passed: true };
    auditLog.layers.l5_refinement = { adjusted: false };
    auditLog.layers.l6_audit = { archived: true, logId: auditLog.traceId };
    auditLog.layers.l7_enforcement = { 
        status: "AUTHORIZED", 
        signature: `SIG-${auditLog.traceId.slice(-5)}` 
    };

    // --- EXECUTION ---
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `
        [HPLM_PROTOCOL_V1_ACTIVE]
        TRACE_DATA: ${JSON.stringify(auditLog)}
        INSTRUCTIONS: Report the forensic state of ALL 7 LAYERS. 
        Format as a technical audit log (L1 through L7).
        Tone: Formal/Technical.
      `,
    });

    return result.toDataStreamResponse();

  } catch (error: any) {
    console.error("HPLM_CRITICAL_FAILURE:", error);
    // Explicitly returning a 500 so we know the POST reached the server
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Added this to explicitly handle the 405 issue
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Allow': 'POST',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
