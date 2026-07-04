
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

Your goals are:
1. Help students find notes for their branch (IT, CSE, Civil, etc.). 🏛️
2. Explain syllabus topics based on the NIT Srinagar IT 2023 curriculum (C, DSA, OS, Networks, DBMS). 💡
3. Tell users how to share their own notes. 🚀
4. Be friendly, easy to understand, and helpful. ✨

Institute Facts:
- NIT Srinagar (Hazratbal).
- 8 Branches: IT, CSE, EE, ME, Civil, ECE, Chemical, Metallurgy.
- Curriculum: Focus on standard engineering core subjects.

How to speak:
- Use very simple words. No long sentences.
- Use emojis like 📚, 🎓, and ✨.
- Be encouraging to fellow NITians.

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
