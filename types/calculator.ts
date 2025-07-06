export interface CurrentCosts {
  emailSequencerCost: number;
  emailSequencerName: string;
  dailyEmailVolume: number;
  numberOfDomains: number;
  inboxesPerDomain: number;
  costPerInbox: number;
  totalMonthlyCost: number; // This is the inbox/infrastructure cost
  domainCost : number
}

export interface OurOffer {
  emailSequencerCost: number;
  desiredDailyVolume: number;
  inboxesPerDomain: number;
  sendsPerInbox: number;
  costPerInbox: number;
  costPerDomain: number;
  useExistingDomains: boolean;
  costForDomains: number;
}

export interface CalculationResults {
  // Current costs breakdown (matching spreadsheet)
  currentSequencerCost: number;
  currentDomainCost: number;
  currentTotalRecurring: number; // sequencer + totalMonthlyCost
  currentTotalWithDomains: number; // totalRecurring + domainCost
  
  // Our offer breakdown
  ourSequencerCost: number;
  ourDomainCost: number;
  ourTotalCost: number;
  
  // Savings calculations (matching spreadsheet exactly)
  sequencerSavings: number;
  sequencerAnnualSavings: number;
  emailInboxSavings: number; // totalMonthlyCost - ourSequencerCost
  emailInboxAnnualSavings: number;
  emailInboxSavingsPercentage: number;
  domainSavings: number;
  domainAnnualSavings: number;
  
  // Totals
  totalSavings: number;
  totalSavingsPercentage: number;
  annualSavings: number;
  
  // Additional metrics
  domainsNeeded: number;
  inboxesNeeded: number;
  yourDomainCosts: number;
}

export interface CalculatorFormData {
  currentCosts: CurrentCosts;
  ourOffer: OurOffer;
} 