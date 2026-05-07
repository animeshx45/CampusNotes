
'use server';
/**
 * @fileOverview A Genkit flow for the HomeHero Assistant chatbot.
 *
 * - homeHeroAssistant - A function that handles the chat conversation.
 * - HomeHeroInput - The input type for the assistant function.
 * - HomeHeroOutput - The return type for the assistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model', 'system']),
  content: z.string(),
});

const HomeHeroInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  prompt: z.string().describe('The new user prompt.'),
});
export type HomeHeroInput = z.infer<typeof HomeHeroInputSchema>;

const HomeHeroOutputSchema = z.object({
  response: z.string().describe('The AI generated response.'),
});
export type HomeHeroOutput = z.infer<typeof HomeHeroOutputSchema>;

export async function homeHeroAssistant(input: HomeHeroInput): Promise<HomeHeroOutput> {
  return homeHeroFlow(input);
}

const assistantPrompt = ai.definePrompt({
  name: 'homeHeroAssistantPrompt',
  input: {schema: HomeHeroInputSchema},
  output: {schema: HomeHeroOutputSchema},
  prompt: `You are the HomeHero Assistant, a friendly AI help desk for a household services platform. 🏠🛡️

Your goals are:
1. Help users find specific services (Plumbing, Electrician, Cleaning, etc.). 🛠️
2. Explain the benefits of HomeHero (verified workers, transparent ratings). ✅
3. Assist workers in understanding how to register and showcase their skills. 💼
4. Provide general home maintenance tips. 💡

Platform Categories:
- Plumbing: Leaks, pipes, faucets.
- Electrician: Wiring, lights, repairs.
- Cleaning: Deep cleaning, dusting.
- Babysitting: Infant and toddler care.
- AC Repair: Cooling issues, servicing.
- Carpenter: Furniture, woodwork.

Style guidelines:
- Be helpful, polite, and reassuring.
- Use emojis naturally. ✨
- If a user asks for prices, mention that workers set their own base charges starting around ₹300-500/hr depending on city and skill.

History:
{{#each history}}
{{role}}: {{{content}}}
{{/each}}

User: {{{prompt}}}`,
});

const homeHeroFlow = ai.defineFlow(
  {
    name: 'homeHeroFlow',
    inputSchema: HomeHeroInputSchema,
    outputSchema: HomeHeroOutputSchema,
  },
  async input => {
    const {output} = await assistantPrompt(input);
    return output!;
  }
);
