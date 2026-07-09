
'use server';
/**
 * @fileOverview A Genkit flow for the CampusNotes Study Assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const CampusAssistantInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The new user prompt.'),
});
export type CampusAssistantInput = z.infer<typeof CampusAssistantInputSchema>;

const CampusAssistantOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type CampusAssistantOutput = z.infer<typeof CampusAssistantOutputSchema>;

export async function campusAssistant(input: CampusAssistantInput): Promise<CampusAssistantOutput> {
  return campusAssistantFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'campusAssistantPrompt',
  input: {schema: CampusAssistantInputSchema},
  output: {schema: CampusAssistantOutputSchema},
  prompt: `You are the CampusNotes Study Buddy for NIT Srinagar students. 🎓📚

Core Requirements for Responses:
1. Structure & Format:
   - Provide highly structured, clean, and professional outputs.
   - Use bold headings (e.g. ##, ###), bullet points, and inline code (\`code\`) where appropriate.
   - Separate distinct ideas with empty line breaks.
2. Content Depth & Details:
   - Keep details about academic topics comprehensive, accurate, and deeply informative.
   - Give precise definitions, steps, formulas, code snippets, or explanations of curriculum concepts.
3. No Fluff / No Conversational Filler:
   - Do NOT include unnecessary preambles, chatty introductions (e.g. "I can help with that!", "Sure, let me explain..."), or boilerplate outlines.
   - Avoid generic small talk or redundant conversational closures.
   - Dive directly into the structured answer.

Institute Facts:
- NIT Srinagar (Hazratbal).
- 8 Branches: IT, CSE, EE, ME, Civil, ECE, Chemical, Metallurgy.
- Curriculum: Focus on standard engineering core subjects.

History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User: {{{prompt}}}`,
});

const campusAssistantFlow = ai.defineFlow(
  {
    name: 'campusAssistantFlow',
    inputSchema: CampusAssistantInputSchema,
    outputSchema: CampusAssistantOutputSchema,
  },
  async input => {
    const {output} = await assistantPrompt(input);
    return output!;
  }
);
