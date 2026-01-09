// app/api/chat/route.ts
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { hplmKernel, HPLM_AuditPacket } from '@/layers/3-dss-solvers/solver-registry';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    // --- LAYER 1 & 2: INGESTION & PARSING ---
    // Initializing the Audit Suitcase with the first two stamps
    const auditLog: HPLM_AuditPacket = {
      traceId: `HPLM-TRACE-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      layers: {
        l1_ingestion: { 
          timestamp: new Date().toISOString(), 
          status: "COMPLETE" 
        },
        l2_parsing: { 
          tokens: lastMessage.split(' ').length, 
          subject: "GENERAL_DEMO" 
        }
      }
    };

    // Prepare the execution token
    const token = {
      payload: { 
        subject: "GENERAL", 
        parameters: { input: lastMessage } 
      }
    };

    // --- LAYER 3: DOMAIN SOLVER (KERNEL) ---
    // Passing the data through the reasoning engine
    const kernelResult = await hplmKernel.process(token);
    
    auditLog.layers.l3_solver = { 
      domain: token.payload.subject, 
      status: kernelResult.status,
      result: kernelResult.message 
    };

    // --- LAYER 4 & 5: VALIDATION & REFINEMENT ---
    // Stamping the suitcase with skeleton state-checks
    auditLog.layers.l4_validation = { 
      passed: kernelResult.status !== 'FAIL' 
    };
    auditLog.layers.l5_refinement = { 
      adjusted: false 
    };

    // --- LAYER 6: FORENSIC AUDIT ---
    // Archiving the trace data for the final report
    auditLog.layers.l6_audit = { 
      archived: true, 
      logId: auditLog.traceId 
    };

    // --- LAYER 7: ENFORCEMENT & OUTPUT ---
    // The final gatekeeper check before stream generation
    const isEnforced = auditLog.layers.l4_validation.passed;
    auditLog.layers.l7_enforcement = { 
      status: isEnforced ? "AUTHORIZED" : "BLOCKED",
      signature: `SIG-${auditLog.traceId.split('-').pop()}`
    };

    // --- FINAL STREAM EXECUTION ---
    const result = await streamText({
      model: google('gemini-1.5-flash'),
      messages,
      system: `
        [HPLM_PROTOCOL_V1_ACTIVE]
        
        TRACE_DATA: ${JSON.stringify(auditLog)}
        
        SYSTEM_INSTRUCTIONS:
        1. You are the HPLM Layer 7 Enforcement Interface.
        2. You must report the forensic state of ALL 7 LAYERS to the user.
        3. Format the output as a technical audit log:
           L1: Ingestion Status
           L2: Parsing Metadata
           L3: Solver Execution Result
           L4: Validation Check
           L5: Refinement Note
           L6: Forensic Archive ID
           L7: Final Enforcement Signature
        4. If Layer 3 is UNCONFIGURED, notify the user that the Chassis is in Skeleton Mode.
        5. If Layer 7 status is BLOCKED, do not reveal content; output a Security Exception.
        6. Use a formal, technical tone. Do not engage in casual chat.
      `,
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("HPLM Audit Chain Failure:", error);
    return new Response("Critical Kernel Reporting Error", { status: 500 });
  }
}
