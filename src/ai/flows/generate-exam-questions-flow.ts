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
  fileUrl: z.string().optional().describe('The URL of the PDF material file.'),
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
    let contentToAnalyze = input.studyMaterialText;

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
            contentToAnalyze = `Metadata details:\n${input.studyMaterialText}\n\nPDF Contents:\n${truncatedText}`;
            console.log(`Parsed PDF for questions successfully! Length: ${data.text.length} chars.`);
          }
        }
      } catch (err) {
        console.error('Failed to parse PDF for questions in server action:', err);
      }
    }

    const {output} = await generateExamQuestionsPrompt({
      studyMaterialText: contentToAnalyze,
      fileUrl: input.fileUrl,
    });
    return output!;
  }
);
