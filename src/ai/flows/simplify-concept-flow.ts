'use server';
/**
 * @fileOverview A Genkit flow for simplifying complex engineering concepts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimplifyConceptInputSchema = z.object({
  concept: z.string().describe('The engineering concept or topic to simplify.'),
  branch: z.string().optional().describe('The student\'s branch for context.'),
});
export type SimplifyConceptInput = z.infer<typeof SimplifyConceptInputSchema>;

const SimplifyConceptOutputSchema = z.object({
  explanation: z.string().describe('The simplified explanation with analogies.'),
  keyPoints: z.array(z.string()).describe('3-5 key takeaways.'),
});
export type SimplifyConceptOutput = z.infer<typeof SimplifyConceptOutputSchema>;

export async function simplifyConcept(input: SimplifyConceptInput): Promise<SimplifyConceptOutput> {
  return simplifyConceptFlow(input);
}

const simplifyPrompt = ai.definePrompt({
  name: 'simplifyConceptPrompt',
  input: {schema: SimplifyConceptInputSchema},
  output: {schema: SimplifyConceptOutputSchema},
  prompt: `You are a brilliant senior student at NIT Srinagar who is famous for explaining the hardest topics in the simplest way.

Explain the following concept: {{{concept}}}
{{#if branch}} Context: This is for a student in the {{{branch}}} department. {{/if}}

Your explanation should:
1. Use a funny or relatable analogy.
2. Avoid heavy jargon unless necessary.
3. Keep it brief and encouraging.
4. Use emojis.

History: Focus on core engineering intuition.`,
});

const simplifyConceptFlow = ai.defineFlow(
  {
    name: 'simplifyConceptFlow',
    inputSchema: SimplifyConceptInputSchema,
    outputSchema: SimplifyConceptOutputSchema,
  },
  async input => {
    const {output} = await simplifyPrompt(input);
    return output!;
  }
);
