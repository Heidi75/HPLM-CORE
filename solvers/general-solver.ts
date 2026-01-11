import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

// 1. Initialize the provider at the TOP LEVEL
const googleProvider = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

export interface SolverToken {
  payload: {
    subject: string;
    parameters: {
      input: string;
    };
  };
}

export interface SolverResult {
  status: string;
  message: string;
  domain: string;
}

// 2. RENAMED function to avoid clashing with the 'process' keyword
export async function executeGeneralSolver(token: SolverToken): Promise<SolverResult> {
  console.log("🔧 GENERAL SOLVER ACTIVE");
  
  try {
    const userInput = token.payload.parameters.input;
    
    const result = await streamText({
      model: googleProvider('gemini-2.0-flash-exp'),
      messages: [
        {
          role: 'user',
          content: userInput
        }
      ],
      system: 'You are a helpful AI assistant. Provide clear, accurate responses.',
    });
    
    const response = await result.text();
    
    return {
      status: 'SUCCESS',
      message: response,
      domain: 'GENERAL'
    };
    
  } catch (error: any) {
    console.error("General solver failed:", error);
    return {
      status: 'FAILED',
      message: `Error: ${error.message}`,
      domain: 'GENERAL'
    };
  }
}
