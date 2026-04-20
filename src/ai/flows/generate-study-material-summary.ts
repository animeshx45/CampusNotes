'use server';
/**
 * @fileOverview A Genkit flow for summarizing study material.
 *
 * - generateStudyMaterialSummary - A function that handles the study material summarization process.
 * - GenerateStudyMaterialSummaryInput - The input type for the generateStudyMaterialSummary function.
 * - GenerateStudyMaterialSummaryOutput - The return type for the generateStudyMaterialSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyMaterialSummaryInputSchema = z.object({
  studyMaterialContent: z
    .string()
    .describe('The content of the study material to be summarized.'),
});
export type GenerateStudyMaterialSummaryInput = z.infer<
  typeof GenerateStudyMaterialSummaryInputSchema
>;

const GenerateStudyMaterialSummaryOutputSchema = z.object({
  summary: z.string().describe('The concise summary of the study material.'),
});
export type GenerateStudyMaterialSummaryOutput = z.infer<
  typeof GenerateStudyMaterialSummaryOutputSchema
>;

export async function generateStudyMaterialSummary(
  input: GenerateStudyMaterialSummaryInput
): Promise<GenerateStudyMaterialSummaryOutput> {
  return generateStudyMaterialSummaryFlow(input);
}

const summarizePrompt = ai.definePrompt({
  name: 'summarizeStudyMaterialPrompt',
  input: {schema: GenerateStudyMaterialSummaryInputSchema},
  output: {schema: GenerateStudyMaterialSummaryOutputSchema},
  prompt: `You are an expert academic summarizer. Your task is to provide a concise summary of the following study material. Focus on the main points and key concepts that would be most useful for exam revision.\n\nStudy Material:\n{{{studyMaterialContent}}}`,
});

const generateStudyMaterialSummaryFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialSummaryFlow',
    inputSchema: GenerateStudyMaterialSummaryInputSchema,
    outputSchema: GenerateStudyMaterialSummaryOutputSchema,
  },
  async input => {
    const {output} = await summarizePrompt(input);
    return output!;
  }
);
