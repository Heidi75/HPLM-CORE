// 1. ADD THIS IMPORT
import { executeGeneralSolver } from '../../solvers/general-solver';

export interface HPLM_AuditPacket {
  traceId: string;
  layers: {
    l1_ingestion?: { timestamp: string; status: string };
    l2_parsing?: { tokens: number; subject: string };
    l3_solver?: {
      domain: string; 
      result: string;
      status: string;
      modelError?: string;
    };
    l4_validation?: { passed: boolean };
    l5_refinement?: { adjusted: boolean };
    l6_audit?: { archived: boolean; logId: string };
    l7_enforcement?: { status: string; signature: string };
  };
}

export interface LayerResult {
  layer: number;
  status: 'SUCCESS' | 'FAIL' | 'BYPASSED' | 'UNCONFIGURED';
  message: string;
  data?: any;
}

// --- THE KERNEL ---
class HPLM_Kernel {
  // 2. INITIALIZE with the general solver we fixed
  private activeSolver: any = executeGeneralSolver;

  public install(solver: any) {
    this.activeSolver = solver;
  }

  async process(token: any): Promise<LayerResult> {
    if (!this.activeSolver) {
      return {
        layer: 3,
        status: 'UNCONFIGURED',
        message: `HPLM Skeleton: No solver for ${token.payload.subject}`
      };
    }

    try {
      // 3. EXECUTE the solver and wait for Gemini's response
      const solverResponse = await this.activeSolver(token);

      return {
        layer: 3,
        status: solverResponse.status === 'SUCCESS' ? 'SUCCESS' : 'FAIL',
        message: solverResponse.message, // This is the actual AI response
        data: { domain: solverResponse.domain }
      };
    } catch (error: any) {
      return {
        layer: 3,
        status: 'FAIL',
        message: `Kernel Error: ${error.message}`
      };
    }
  }
}

export const hplmKernel = new HPLM_Kernel();
