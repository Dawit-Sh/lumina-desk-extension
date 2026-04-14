import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

import { getSettings } from './settings';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn('Lumina: VITE_GEMINI_API_KEY is missing from the environment.');
}

const google = createGoogleGenerativeAI({
  apiKey: apiKey || '',
});

async function callAI(params: any, type: 'default' | 'pro' = 'default') {
  const settings = getSettings();
  const modelId = type === 'pro' ? settings.proModel : settings.model;

  try {
    const result = await generateText({
      ...params,
      model: google(modelId),
    });
    return result as any;
  } catch (error: any) {
    // Check for rate limit error (429)
    if (
      error?.status === 429 ||
      error?.statusCode === 429 ||
      error?.message?.includes('429')
    ) {
      throw new Error(
        'Lumina is currently receiving too many requests. Please wait a few seconds and try again (Rate Limit).',
      );
    }
    throw error;
  }
}

export async function checkGrammar(
  text: string,
  preserveInformality: boolean = false,
) {
  const informalityInstruction = preserveInformality
    ? 'IMPORTANT: The user wants to preserve an informal, casual tone. Do not over-formalize slang or casual expressions. Only fix actual spelling errors or structural grammar mistakes that hinder readability.'
    : 'Ensure the text is grammatically correct, well-structured, and professional.';

  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        correctedText: z
          .string()
          .describe('The grammatically corrected version of the text.'),
        explanations: z
          .array(
            z.object({
              original: z
                .string()
                .describe('The original incorrect phrase or sentence.'),
              correction: z
                .string()
                .describe('The corrected phrase or sentence.'),
              explanation: z
                .string()
                .describe(
                  'Why it was incorrect and why the new version is better.',
                ),
            }),
          )
          .describe('List of specific corrections made.'),
      }),
    }),
    prompt: `Analyze the following text for grammar, spelling, and style issues. ${informalityInstruction} Provide a corrected version and explain the corrections.
    
Text:
${text}`,
  });

  return output;
}

export async function paraphraseText(text: string, style: string) {
  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        paraphrasedText: z
          .string()
          .describe('The paraphrased version of the text.'),
        explanation: z
          .string()
          .describe(
            'Explanation of how the text was adapted to fit the requested style.',
          ),
      }),
    }),
    prompt: `Paraphrase the following text in a ${style} style. Provide the paraphrased text and a brief explanation of the changes made to match the style.
    
Text:
${text}`,
  });

  return output;
}

export async function summarizeText(text: string, length: string) {
  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        summary: z.string().describe('The summarized text.'),
        keyPoints: z
          .array(z.string())
          .describe('3-5 key bullet points from the text.'),
      }),
    }),
    prompt: `Summarize the following text. The summary should be ${length} in length. Capture the main points accurately.
    
Text:
${text}`,
  });

  return output;
}

export async function analyzeTone(text: string) {
  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        primaryTone: z
          .string()
          .describe(
            'The single most dominant tone (e.g., Assertive, Joyful, Melancholic, Professional).',
          ),
        secondaryTones: z
          .array(z.string())
          .describe('2-3 secondary tones present in the text.'),
        analysis: z
          .string()
          .describe(
            'A brief explanation of why these tones were identified based on word choice and sentence structure.',
          ),
        formalityScore: z
          .number()
          .describe(
            'A score from 1 to 10 where 1 is extremely casual/slang and 10 is highly formal/academic.',
          ),
      }),
    }),
    prompt: `Analyze the tone and emotional resonance of the following text.
    
Text:
${text}`,
  });

  return output;
}

export async function processPrompt(
  action: 'make' | 'optimize' | 'rewrite',
  text: string,
  extra?: string,
) {
  let promptContent = '';
  let schema: any;

  if (action === 'make') {
    promptContent = `Turn the following rough idea into a highly detailed, effective prompt for a Large Language Model. Include context, task, constraints, and output format.\n\nIdea: ${text}`;
    schema = z.object({
      resultPrompt: z
        .string()
        .describe('The detailed, ready-to-use LLM prompt.'),
      explanation: z.string().describe('Why this prompt is effective.'),
    });
  } else if (action === 'optimize') {
    promptContent = `Optimize the following LLM prompt to make it more effective, clear, and robust. Fix ambiguities, add necessary constraints, and improve structure.\n\nOriginal Prompt: ${text}`;
    schema = z.object({
      resultPrompt: z.string().describe('The optimized LLM prompt.'),
      improvements: z.array(z.string()).describe('List of improvements made.'),
    });
  } else if (action === 'rewrite') {
    promptContent = `Rewrite the following LLM prompt to align with this specific goal/style: ${extra}.\n\nOriginal Prompt: ${text}`;
    schema = z.object({
      resultPrompt: z.string().describe('The rewritten LLM prompt.'),
      explanation: z.string().describe('Explanation of the changes.'),
    });
  }

  const { output } = await callAI(
    {
      output: Output.object({ schema }),
      prompt: promptContent,
    },
    'default',
  );

  return output;
}

export async function shiftTone(text: string, targetTone: string) {
  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        shiftedText: z
          .string()
          .describe('The text rewritten in the target tone.'),
        explanation: z
          .string()
          .describe(
            'Explanation of the changes made to achieve the target tone.',
          ),
      }),
    }),
    prompt: `Rewrite the following text to shift its tone to "${targetTone}". Maintain the original meaning but adjust the vocabulary, sentence structure, and emotional resonance to match the requested tone.
    
Text:
${text}`,
  });

  return output;
}

export async function detectAI(text: string) {
  const { output } = await callAI({
    output: Output.object({
      schema: z.object({
        aiScore: z
          .number()
          .describe(
            'Estimated probability (0-100) that the text was AI-generated.',
          ),
        detectionAnalysis: z
          .string()
          .describe('Analysis of why the text was flagged as AI or human.'),
        markers: z
          .array(z.string())
          .describe(
            'Specific markers found (e.g., "Uniform sentence length", "High predictability").',
          ),
      }),
    }),
    prompt: `Analyze the following text for AI-generated patterns. Provide a detection score and detailed analysis of markers.
    
Text:
${text}`,
  });

  return output;
}

export async function humanizeAndDetect(text: string) {
  const { output } = await callAI(
    {
      output: Output.object({
        schema: z.object({
          humanizedText: z
            .string()
            .describe('The text rewritten to sound naturally human.'),
          aiScore: z
            .number()
            .describe(
              'Estimated probability (0-100) that the original text was AI-generated.',
            ),
          detectionAnalysis: z
            .string()
            .describe(
              'Analysis of why the original text was flagged as AI or human.',
            ),
          improvements: z
            .array(z.string())
            .describe('List of specific creative/humanizing choices made.'),
        }),
      }),
      prompt: `Act as an expert writing editor and AI forensic analyst. 
    1. Analyze the following text for "AI-generated" markers (predictability, uniform sentence length, lack of personal voice). 
    2. Rewrite the text to "humanize" it—adding perplexity, burstiness, and natural human cadence while maintaining the exact same meaning. 
    3. Provide an AI detection score (0-100) for the ORIGINAL text.
    
Text:
${text}`,
    },
    'default',
  );

  return output;
}
