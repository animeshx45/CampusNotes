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
  fileUrl: z.string().optional().describe('The URL of the PDF material file.'),
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
  prompt: `You are an expert academic summarizer. Your task is to provide a comprehensive, well-structured revision digest of the following study material.
  
Structure requirements:
1. Executive Summary: A short 2-3 sentence overview of the document's core purpose.
2. Key Topics Covered: Detailed markdown bullet points explaining each major concept covered in the text with technical depth.
3. Exam Insights: Crucial details, key formulas, rules, or tips that are highly likely to be tested.

Do NOT include any conversational preambles or boilerplate outlines. Go straight to the structured summary.

Study Material Content:
{{{studyMaterialContent}}}`,
});

const generateStudyMaterialSummaryFlow = ai.defineFlow(
  {
    name: 'generateStudyMaterialSummaryFlow',
    inputSchema: GenerateStudyMaterialSummaryInputSchema,
    outputSchema: GenerateStudyMaterialSummaryOutputSchema,
  },
  async input => {
    let contentToSummarize = input.studyMaterialContent;

    if (input.fileUrl && input.fileUrl.toLowerCase().includes('.pdf')) {
      try {
        const pdfParser = (await import('pdf-parse')) as any;
        let fetchUrl = input.fileUrl;
        if (fetchUrl.startsWith('/')) {
          const host = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
          fetchUrl = `${host}${fetchUrl}`;
        }
        const response = await fetch(fetchUrl);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const parseFunc = pdfParser.default || pdfParser;
          const data = await parseFunc(buffer);
          if (data && data.text && data.text.trim()) {
            const words = data.text.split(/\s+/);
            const truncatedText = words.slice(0, 6000).join(' ');
            contentToSummarize = `Metadata details:\n${input.studyMaterialContent}\n\nPDF Contents:\n${truncatedText}`;
            console.log(`Parsed PDF successfully! Length: ${data.text.length} chars.`);
          }
        }
      } catch (err) {
        console.error('Failed to parse PDF in summary server action:', err);
      }
    }

    const {output} = await summarizePrompt({
      studyMaterialContent: contentToSummarize,
      fileUrl: input.fileUrl,
    });
    return output!;
  }
);
