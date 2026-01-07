import { HPLM_Token_Schema, HPLM_Token } from './token-generator';

/**
 * Function: Translates natural language patterns into Symbolic Logic.
 * Engineering Role: Converts "textual claims" into rigid variables.
 */
export async function formalizeNeuralOutput(rawJson: any): Promise<HPLM_Token> {
  // 1. Validate the incoming neural data against the FTL Schema
  const validation = HPLM_Token_Schema.safeParse(rawJson);

  if (!validation.success) {
    // This triggers the early stages of a Layer 5 Veto if the data is "messy" [cite: 22]
    throw new Error(`FTL_VALIDATION_FAILED: Neural output did not match Symbolic requirements.`);
  }

  // 2. Map the data to the computational format for Layer 3 Solvers 
  const formalizedToken = validation.data;

  console.log(`[LAYER_2_FTL] Claim ${formalizedToken.claim_id} formalized successfully.`);
  
  return formalizedToken;
}
