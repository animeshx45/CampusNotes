'use server';
/**
 * @fileOverview A Genkit flow for generating exam questions from study material.
 *
 * - generateExamQuestions - A function that handles the generation of exam questions.
 * - GenerateExamQuestionsInput - The input type for the generateExamQuestions function.
 * - GenerateExamQuestionsOutput - The return type for the generateExamQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the generateExamQuestions flow.
 * @property studyMaterialText - The text content of the study material from which to generate exam questions.
 */
const GenerateExamQuestionsInputSchema = z.object({
  studyMaterialText: z.string().describe('The text content of the study material from which to generate exam questions.'),
});
export type GenerateExamQuestionsInput = z.infer<typeof GenerateExamQuestionsInputSchema>;

/**
 * Output schema for the generateExamQuestions flow.
 * @property examQuestions - A list of potential exam questions generated from the study material.
 */
const GenerateExamQuestionsOutputSchema = z.object({
  examQuestions: z.array(z.string()).describe('A list of potential exam questions generated from the study material.'),
});
export type GenerateExamQuestionsOutput = z.infer<typeof GenerateExamQuestionsOutputSchema>;

/**
 * Generates potential exam questions based on the provided study material.
 * @param input - An object containing the study material as text.
 * @returns A promise that resolves to an object containing a list of exam questions.
 */
export async function generateExamQuestions(input: GenerateExamQuestionsInput): Promise<GenerateExamQuestionsOutput> {
  return generateExamQuestionsFlow(input);
}

/**
 * Defines the prompt for generating exam questions.
 * Instructs the model to act as an expert exam question generator.
 */
const generateExamQuestionsPrompt = ai.definePrompt({
  name: 'generateExamQuestionsPrompt',
  input: {schema: GenerateExamQuestionsInputSchema},
  output: {schema: GenerateExamQuestionsOutputSchema},
  prompt: `You are an expert exam question generator for students. Your task is to create challenging yet fair exam questions based on the provided study material. The questions should test understanding and critical thinking.

Generate a list of distinct potential exam questions from the following study material. Ensure the questions cover key concepts and details. Format the output as a JSON array of strings.

Study Material:
{{{studyMaterialText}}}

Examples of good questions:
- "Explain the main differences between X and Y."
- "Describe the process of Z, highlighting its key stages and significance."
- "Discuss the implications of A on B, providing examples."
- "What are the primary characteristics of C?"`,
});

/**
 * Defines the Genkit flow for generating exam questions.
 * This flow takes study material text as input and returns a list of exam questions.
 */
const generateExamQuestionsFlow = ai.defineFlow(
  {
    name: 'generateExamQuestionsFlow',
    inputSchema: GenerateExamQuestionsInputSchema,
    outputSchema: GenerateExamQuestionsOutputSchema,
  },
  async input => {
    const {output} = await generateExamQuestionsPrompt(input);
    return output!;
  }
);
