import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { hplmKernel, HPLM_AuditPacket } from '@/layers/3-dss-solvers/solver-registry'; 

export const maxDuration = 10;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  console.log("🔥 HPLM_PYRAMID_INVOKED");

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1]?.content || "";

    // --- Layer 1-7 skeleton ---
    const auditLog: HPLM_AuditPacket = {
      traceId: `HPLM-TRACE-${Date.now()}`,
      layers: {
        l1_ingestion: { timestamp: new Date().toISOString(), status: "COMPLETE" },
        l2_parsing: { tokens: lastMessage.split(" ").length, subject: "GENERAL_DEMO" },
      },
    };

    // Layer 3: Kernel
    let kernelResult;
    try {
      const token = { payload: { subject: "GENERAL", parameters: { input: lastMessage } } };
      kernelResult = await hplmKernel.process(token);
      auditLog.layers.l3_solver = { domain: "GENERAL", status: kernelResult.status, result: kernelResult.message };
    } catch (err) {
      console.error("Layer 3 failed:", err);
      auditLog.layers.l3_solver = { domain: "GENERAL", status: "FAILED", result: String(err) };
    }

    // Layers 4-7 placeholders
    auditLog.layers.l4_validation = { passed: true };
    auditLog.layers.l5_refinement = { adjusted: false };
    auditLog.layers.l6_audit = { archived: true, logId: auditLog.traceId };
    auditLog.layers.l7_enforcement = { status: "AUTHORIZED", signature: `SIG-${auditLog.traceId.slice(-5)}` };

    // --- Optional: call external model ---
    let modelResponse = "Skeleton response only";
    try {
      const result = await streamText({
        model: google('models/gemini-1.5-flash-latest'),
        messages,
        system: `
          [HPLM_PROTOCOL_V1_ACTIVE]
          TRACE_DATA: ${JSON.stringify(auditLog)}
          INSTRUCTIONS: Report the forensic state of ALL 7 LAYERS. Format as technical audit log.
        `,
      });
      modelResponse = await result.text(); // Convert stream to text
    } catch (err) {
      console.error("External model failed:", err);
    }

    return new Response(JSON.stringify({ auditLog, modelResponse }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });

  } catch (error: any) {
    console.error("HPLM_CRITICAL_FAILURE:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
