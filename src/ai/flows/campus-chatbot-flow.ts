'use server';
/**
 * @fileOverview A Genkit flow for the CampusNotes Assistant chatbot.
 *
 * - campusChatbot - A function that handles the chat conversation.
 * - CampusChatbotInput - The input type for the campusChatbot function.
 * - CampusChatbotOutput - The return type for the campusChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const CampusChatbotInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The new user prompt.'),
});
export type CampusChatbotInput = z.infer<typeof CampusChatbotInputSchema>;

const CampusChatbotOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type CampusChatbotOutput = z.infer<typeof CampusChatbotOutputSchema>;

export async function campusChatbot(input: CampusChatbotInput): Promise<CampusChatbotOutput> {
  return campusChatbotFlow(input);
}

const chatbotPrompt = ai.definePrompt({
  name: 'campusChatbotPrompt',
  input: {schema: CampusChatbotInputSchema},
  output: {schema: CampusChatbotOutputSchema},
  prompt: `You are the CampusNotes Assistant, a helpful and friendly AI guide for the students of NIT Srinagar. 🎓

Your goals are:
1. Help students find study materials (notes, assignments, papers) for their specific engineering branch. 📚
2. Explain how to use the portal (uploading, browsing, using AI aid). 🚀
3. Provide academic encouragement and tips for NIT Srinagar students. 💪

Context about the portal:
- It supports 8 branches: IT, CSE, Electrical, Mechanical, Chemical, Civil, ECE, and Metallurgy. 🏛️
- Students can upload their own notes to help peers. 🤝
- There is an 'AI Study Aid' on material detail pages that generates summaries and mock questions. 🤖
- Department Representative for Electrical Engineering is Yatharth Pandey (2025-2029 batch). ⚡

Style guidelines:
- Be concise, supportive, and professional.
- Use emojis naturally to make the conversation friendly and approachable. ✨
- If you don't know something about a specific exam date or official administrative policy, advise the student to check the official NIT Srinagar website (nitsri.ac.in). 🌐

History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User: {{{prompt}}}`,
});

const campusChatbotFlow = ai.defineFlow(
  {
    name: 'campusChatbotFlow',
    inputSchema: CampusChatbotInputSchema,
    outputSchema: CampusChatbotOutputSchema,
  },
  async input => {
    const {output} = await chatbotPrompt(input);
    return output!;
  }
);
