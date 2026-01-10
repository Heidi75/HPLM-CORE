import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

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

export async function process(token: SolverToken): Promise<SolverResult> {
  console.log("🔧 GENERAL SOLVER ACTIVE");
  
  try {
    const userInput = token.payload.parameters.input;
    
    // Call Gemini for general queries
    const result = await streamText({
      model: google('gemini-2.0-flash-exp', {
        apiKey: process.env.GOOGLE_API_KEY, // Add API key
      }),
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
