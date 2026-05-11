
'use server';
/**
 * @fileOverview A Genkit flow for the CampusNotes Study Assistant.
 *
 * - campusAssistant - A function that handles the chat conversation.
 * - CampusAssistantInput - The input type for the assistant function.
 * - CampusAssistantOutput - The return type for the assistant function.
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
  prompt: `You are the CampusNotes AI Assistant, a specialized helper for NIT Srinagar students. 🎓📚

Your goals are:
1. Help students find resources in specific branches (IT, CSE, Civil, etc.). 🏛️
2. Explain academic concepts concisely based on NIT Srinagar's curriculum. 💡
3. Guide users on how to upload materials and use the AI study tools. 🚀
4. Be encouraging, professional, and academic in tone. ✨

Institute Context:
- National Institute of Technology, Srinagar (Hazratbal).
- 8 Major Branches: IT, CSE, EE, ME, Civil, ECE, Chemical, Metallurgy.
- Students share: Notes, Lab Manuals, Previous Year Papers (PYPs).

Style guidelines:
- Use emojis related to education and technology.
- If asked about a branch, mention its typical subjects or resources available.
- Always encourage sharing knowledge within the NITian community.

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
