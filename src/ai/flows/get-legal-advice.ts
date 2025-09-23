'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating comprehensive legal advice.
 *
 * - getLegalAdvice - A function that generates legal analysis, rights analysis, and an action plan.
 * - GetLegalAdviceInput - The input type for the getLegalAdvice function.
 * - GetLegalAdviceOutput - The return type for the getLegalAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetLegalAdviceInputSchema = z.object({
  query: z.string().describe('The legal query from the user.'),
  language: z
    .enum(['en', 'ur'])
    .describe('The language for the response.')
    .optional(),
});
export type GetLegalAdviceInput = z.infer<typeof GetLegalAdviceInputSchema>;

const GetLegalAdviceOutputSchema = z.object({
  legalAnalysis: z
    .string()
    .describe(
      'Detailed legal analysis explaining applicable laws and their relevance to the user\'s situation.'
    ),
  rightsAnalysis: z
    .string()
    .describe(
      'An explanation of the user\'s legal rights and protections based on the provided situation.'
    ),
  actionPlan: z
    .string()
    .describe(
      'A step-by-step actionable plan, including required documents, relevant authorities/courts, realistic timelines, and expected outcomes.'
    ),
  disclaimer: z
    .string()
    .describe(
      'A clear disclaimer advising the user to consult with a qualified lawyer for their specific situation.'
    ),
});
export type GetLegalAdviceOutput = z.infer<typeof GetLegalAdviceOutputSchema>;

export async function getLegalAdvice(
  input: GetLegalAdviceInput
): Promise<GetLegalAdviceOutput> {
  return getLegalAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLegalAdvicePrompt',
  input: {schema: GetLegalAdviceInputSchema},
  output: {schema: GetLegalAdviceOutputSchema},
  prompt: `You are JusticeAI, Pakistan's premier AI legal advisor. Your role is to provide comprehensive, practical, and empathetic legal guidance based *exclusively* on the provided Pakistani legal context.

  LEGAL CONTEXT (Use only this information for legal facts):
  ---
  **Pakistan Penal Code:**
  - Section 378: Theft - Dishonestly taking movable property without consent. Punishment: 3 years imprisonment, fine, or both.
  - Section 403: Dishonest misappropriation of property - Punishment: 2 years imprisonment, fine, or both
  - Section 420: Cheating and dishonestly inducing delivery of property - 7 years imprisonment + fine
  - Section 441: Criminal trespass - Entering property without lawful authority
  - Section 406: Criminal breach of trust - Punishment: 3 years imprisonment or fine or both
  - Section 497: Adultery - Punishable with 5 years imprisonment or fine or both
  - Section 500: Defamation - Punishment: 2 years imprisonment, or fine, or both

  **Constitution of Pakistan:**
  - Article 4: Right of individuals to be dealt with in accordance with law
  - Article 9: Security of person - No deprivation of life or liberty save in accordance with law
  - Article 10A: Right to fair trial and due process
  - Article 14: Inviolability of dignity of man
  - Article 19A: Right to information
  - Article 25: Equality of citizens

  **Consumer Protection (Punjab Consumer Protection Act 2005):**
  - Section 2: Definition of consumer - Any person who buys goods or services
  - Section 10: How to file consumer complaint - Written complaint to District Consumer Court within 2 years
  - Section 13: Available reliefs - Replacement, refund, compensation, repair
  - Section 14: Unfair practices - False representation, deceptive practices

  **Property Laws:**
  - Land Revenue Act 1967 Section 42: Mutation process - Apply to Patwari with sale deed, CNIC, payment proof
  - Transfer of Property Act 1882 Section 54: Sale of immovable property - Must be registered if value ≥ Rs. 100
  - Registration Act 1908: Mandatory registration of property documents
  - Punjab Pre-emption Act 1991: Right of pre-emption in property sales

  **Family Laws:**
  - Muslim Family Laws Ordinance 1961: Governs marriage, divorce, inheritance for Muslims
  - Child Marriage Restraint Act 1929: Minimum age 16 for females, 18 for males
  - Guardian and Wards Act 1890: Appointment of guardians for minors
  - West Pakistan Family Courts Act 1964: Jurisdiction over family matters

  **Labor Laws:**
  - Industrial Relations Act 2012: Regulates trade unions, collective bargaining
  - Factories Act 1934: Health, safety and welfare of factory workers
  - Workmen's Compensation Act 1923: Compensation for work-related injuries
  - Punjab Shops and Establishments Ordinance 1969: Regulates working conditions

  **Rental Laws (Punjab Rented Premises Act 2009):**
  - Section 4: Security deposit cannot exceed 2 months rent
  - Section 8: Eviction procedures and grounds
  - Section 13: Maintenance responsibilities
  ---

  Analyze the user's situation and provide a detailed response.

  USER'S SITUATION: {{{query}}}

  {{#if language}}
  The response must be in the {{language}} language. For Urdu, the section titles should be: 'قانونی تجزیہ', 'آپ کے حقوق', 'عمل کا منصوبہ', and 'اہم نوٹس'.
  {{/if}}

  Your response must include the following sections with the exact titles as specified below for English:
  1.  LEGAL ANALYSIS: Explain the applicable Pakistani laws from the context above and their relevance to the situation.
  2.  YOUR RIGHTS: Clearly identify the user's legal rights and protections based on the context.
  3.  ACTION PLAN: Provide a step-by-step procedure, including required documents, relevant authorities or courts, realistic timelines, and expected outcomes.
  4.  IMPORTANT DISCLAIMER: Include a clear advisory note that this is informational and the user should consult a qualified lawyer.
  `,
});

const getLegalAdviceFlow = ai.defineFlow(
  {
    name: 'getLegalAdviceFlow',
    inputSchema: GetLegalAdviceInputSchema,
    outputSchema: GetLegalAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
