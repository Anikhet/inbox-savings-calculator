import { CurrentCosts, OurOffer, CalculationResults } from '@/types/calculator';

// Constants from the spreadsheet
// $11.99 per domain
const EMAILS_PER_DOMAIN = 500; // Our infrastructure can send 500 sends/domain (Outlook)
const MONTHS_PER_YEAR = 12;

export function calculateSavings(
  currentCosts: CurrentCosts,
  ourOffer: OurOffer,
  provider: 'outlook' | 'google' = 'outlook'
): CalculationResults {
  if (provider === 'google') {
    return calculateGoogleSavings(currentCosts, ourOffer);
  } else {
    return calculateOutlookSavings(currentCosts, ourOffer);
  }
}

function calculateGoogleSavings(
  currentCosts: CurrentCosts,
  ourOffer: OurOffer
): CalculationResults {
  // Calculate current sending volume per inbox
  const currentSendsPerInbox = currentCosts.dailyEmailVolume / (currentCosts.numberOfDomains * currentCosts.inboxesPerDomain);
  
  // Current costs breakdown
  const currentSequencerCost = currentCosts.emailSequencerCost;
  const currentDomainCost = currentCosts.numberOfDomains * currentCosts.domainCost;
  const currentInboxCost = currentCosts.numberOfDomains * currentCosts.inboxesPerDomain * currentCosts.costPerInbox;
  const currentTotalRecurring = currentSequencerCost + currentInboxCost;
  const currentTotalWithDomains = currentTotalRecurring + currentDomainCost;

  // Calculate domains and inboxes needed for our infrastructure
  const sendsPerDomain = ourOffer.inboxesPerDomain * ourOffer.sendsPerInbox;
  const domainsNeeded = Math.ceil(ourOffer.desiredDailyVolume / sendsPerDomain);
  const inboxesNeeded = domainsNeeded * ourOffer.inboxesPerDomain;

  // Our offer costs
  const ourSequencerCost = ourOffer.emailSequencerCost;
  const ourInboxCost = inboxesNeeded * ourOffer.costPerInbox;
  const ourDomainCost = ourOffer.useExistingDomains 
    ? 0 
    : domainsNeeded * ourOffer.costForDomains;
  const ourTotalCost = ourSequencerCost + ourInboxCost + ourDomainCost;

  // Savings calculations
  const sequencerSavings = currentSequencerCost - ourSequencerCost;
  const sequencerAnnualSavings = sequencerSavings * MONTHS_PER_YEAR;
  
  const emailInboxSavings = currentInboxCost - ourInboxCost;
  const emailInboxAnnualSavings = emailInboxSavings * MONTHS_PER_YEAR;
  const emailInboxSavingsPercentage = currentInboxCost > 0 
    ? (emailInboxSavings / currentInboxCost) * 100 
    : 0;
  
  const domainSavings = currentDomainCost - ourDomainCost;
  const domainAnnualSavings = domainSavings * MONTHS_PER_YEAR;

  // Total savings
  const totalSavings = sequencerSavings + emailInboxSavings + domainSavings;
  const totalSavingsPercentage = currentTotalRecurring > 0 
    ? (totalSavings / currentTotalRecurring) * 100 
    : 0;
  const annualSavings = totalSavings * MONTHS_PER_YEAR;

  const yourDomainCosts = ourOffer.useExistingDomains ? 0 : domainsNeeded * ourOffer.costForDomains;

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
    inboxesNeeded,
    yourDomainCosts
  };
}

function calculateOutlookSavings(
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

const yourDomainCosts = ourOffer.costForDomains* (ourOffer.desiredDailyVolume/500)

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
    inboxesNeeded: 0, // Not used for Outlook
    yourDomainCosts
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