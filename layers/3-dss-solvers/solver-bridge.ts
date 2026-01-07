import { HPLM_Token } from '../2-ftl-formalizer/token-generator';

// Define the shape that every Domain Solver must follow
export interface IDomainSolver {
  domainName: string;
  execute: (params: any) => Promise<any>;
}

// This is the "Universal Adapter" for all your AIs
class SolverRegistry {
  private solvers: Map<string, IDomainSolver> = new Map();

  // This allows you to "Plug In" a new domain (e.g., Justice Guard) at any time
  registerSolver(solver: IDomainSolver) {
    this.solvers.set(solver.domainName, solver);
    console.log(`[LAYER_3_DSS] Registered Domain: ${solver.domainName}`);
  }

  async runSolver(token: HPLM_Token) {
    const domain = token.payload.subject;
    const solver = this.solvers.get(domain);

    if (!solver) {
      throw new Error(`CRITICAL_FAILURE: No solver found for domain: ${domain}`);
    }

    return await solver.execute(token.payload.parameters);
  }
}

export const hplmRegistry = new SolverRegistry();
