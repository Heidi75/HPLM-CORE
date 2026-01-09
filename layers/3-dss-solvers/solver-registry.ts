// Define the interface so all your future custom solvers speak the same language
export interface IDomainSolver {
  domainName: string;
  execute: (params: any) => Promise<any>;
}

class SolverRegistry {
  private activeSolver: IDomainSolver | null = null;

  // When you sell to a client, you "Plug In" their specific solver here
  injectClientSolver(solver: IDomainSolver) {
    this.activeSolver = solver;
    console.log(`[HPLM_INTERNAL] Client Engine Loaded: ${solver.domainName}`);
  }

  async runSolver(token: any) {
    if (!this.activeSolver) {
      throw new Error("CORE_HALT: No Client Solver Injected. System Idle.");
    }
    // All data flows through the one specific solver you built for this client
    return await this.activeSolver.execute(token.payload.parameters);
  }
}

export const hplmRegistry = new SolverRegistry();
