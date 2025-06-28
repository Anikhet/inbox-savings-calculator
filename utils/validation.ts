import { z } from 'zod';

export const currentCostsSchema = z.object({
  emailSequencerCost: z.number().min(0, 'Email sequencer cost must be 0 or greater'),
  emailSequencerName: z.string().min(1, 'Email sequencer name is required'),
  dailyEmailVolume: z.number().min(1, 'Daily email volume must be at least 1'),
  numberOfDomains: z.number().min(0, 'Number of domains must be 0 or greater'),
  domainCostPerMonth: z.number().min(0, 'Domain cost per month must be 0 or greater'),
  totalMonthlyCost: z.number().min(0, 'Total monthly cost (inbox/infrastructure) must be 0 or greater'),
});

export const ourOfferSchema = z.object({
  emailSequencerCost: z.number().min(0, 'Email sequencer cost must be 0 or greater'),
  desiredDailyVolume: z.number().min(1, 'Desired daily volume must be at least 1'),
  costPerDomain: z.number().min(0, 'Cost per domain must be 0 or greater'),
  useExistingDomains: z.boolean(),
  costForDomains: z.number().min(0, 'Cost of domains must be 0 or greater'),
});

export const calculatorFormSchema = z.object({
  currentCosts: currentCostsSchema,
  ourOffer: ourOfferSchema,
});

export type CalculatorFormSchema = z.infer<typeof calculatorFormSchema>; 