import { CurrentCosts, OurOffer, CalculationResults } from '@/types/calculator';

// Constants from the spreadsheet
// $11.99 per domain
const EMAILS_PER_DOMAIN = 500; // Our infrastructure can send 500 sends/domain
const MONTHS_PER_YEAR = 12;

export function calculateSavings(
  currentCosts: CurrentCosts,
  ourOffer: OurOffer
): CalculationResults {
  // Current costs breakdown (matching spreadsheet exactly)
  const currentSequencerCost = currentCosts.emailSequencerCost;
  const currentDomainCost = currentCosts.numberOfDomains * currentCosts.domainCost;
  const currentTotalRecurring = currentSequencerCost + currentCosts.totalMonthlyCost; // sequencer + inbox cost
  const currentTotalWithDomains = currentTotalRecurring + currentDomainCost; // total recurring + domains

  // Calculate domains needed for our infrastructure
  const domainsNeeded = Math.ceil(ourOffer.desiredDailyVolume / EMAILS_PER_DOMAIN);

  // Our offer costs
  const ourSequencerCost = ourOffer.emailSequencerCost;
  const ourDomainCost = ourOffer.useExistingDomains 
    ? Math.max(0, domainsNeeded - ourOffer.costForDomains) * ourOffer.costPerDomain
    : domainsNeeded * ourOffer.costPerDomain;
  const ourTotalCost = ourSequencerCost + ourDomainCost;

  // Savings calculations (matching spreadsheet exactly)
  const sequencerSavings = currentSequencerCost - ourSequencerCost;
  const sequencerAnnualSavings = sequencerSavings * MONTHS_PER_YEAR
  
  // Email inbox savings: current totalMonthlyCost - our sequencer cost
  const emailInboxSavings = currentCosts.totalMonthlyCost - ( domainsNeeded*ourOffer.costPerDomain)
  const emailInboxAnnualSavings = emailInboxSavings * MONTHS_PER_YEAR;
  const emailInboxSavingsPercentage = currentCosts.totalMonthlyCost > 0 
    ? (emailInboxSavings / currentCosts.totalMonthlyCost) * 100 
    : 0;
  
  const domainSavings =currentDomainCost - ourOffer.costForDomains

  const domainAnnualSavings = domainSavings * MONTHS_PER_YEAR;

  // Total savings
  const totalSavings = sequencerSavings + emailInboxSavings ;
  const totalSavingsPercentage = currentTotalRecurring > 0 
    ? (totalSavings / currentTotalRecurring) * 100 
    : 0;
  const annualSavings = sequencerAnnualSavings + emailInboxAnnualSavings + domainSavings


  return {
    // Current costs breakdown
    currentSequencerCost,
    currentDomainCost,
    currentTotalRecurring,
    currentTotalWithDomains,
    
    // Our offer breakdown
    ourSequencerCost,
    ourDomainCost,
    ourTotalCost,
    
    // Savings calculations
    sequencerSavings,
    sequencerAnnualSavings,
    emailInboxSavings,
    emailInboxAnnualSavings,
    emailInboxSavingsPercentage,
    domainSavings,
    domainAnnualSavings,
    
    // Totals
    totalSavings,
    totalSavingsPercentage,
    annualSavings,
    
    // Additional metrics
    domainsNeeded,
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`;
} 