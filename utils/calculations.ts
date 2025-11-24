import { PeriodType, RateType, SimulationData, SimulationRow } from '../types';

const TARGET_AMOUNT = 1000000; // 1 Million

// Convert Annual rate to Monthly rate (Nominal/Simple division as per prompt example)
// Prompt Example: 6% Annual = 0.5% Monthly.
export const getMonthlyRate = (rate: number, type: RateType): number => {
  if (type === RateType.MONTHLY) {
    return rate / 100;
  }
  return (rate / 12) / 100;
};

// Calculate inputs to generate rows
export const calculateSimulation = (
  initialAmount: number,
  interestRateValue: number,
  interestRateType: RateType,
  monthlyInvestment: number, // If mode is TIME_TO_MILLION, this is user input. If MONTHLY_NEEDED, this is calculated.
  periodValue: number, // Only used for MONTHLY_NEEDED
  periodType: PeriodType, // Only used for MONTHLY_NEEDED
  mode: 'TIME' | 'VALUE'
): SimulationData => {
  
  const r = getMonthlyRate(interestRateValue, interestRateType);
  let monthsToSimulate = 0;
  let calculatedMonthlyInvestment = monthlyInvestment;

  // --- LOGIC BRANCHING ---

  if (mode === 'VALUE') {
    // Mode: User provides Time, we calculate Monthly Investment needed
    monthsToSimulate = periodType === PeriodType.YEARS ? periodValue * 12 : periodValue;
    
    // Formula: PMT = (FV - PV * (1+r)^n) / ( ((1+r)^n - 1) / r )
    // If r is effectively 0, simple division
    if (r === 0) {
      const remaining = TARGET_AMOUNT - initialAmount;
      calculatedMonthlyInvestment = remaining / monthsToSimulate;
    } else {
      const numerator = TARGET_AMOUNT - (initialAmount * Math.pow(1 + r, monthsToSimulate));
      const denominator = (Math.pow(1 + r, monthsToSimulate) - 1) / r;
      calculatedMonthlyInvestment = numerator / denominator;
    }
    
    // If user already has more than target or math is negative (impossible goal without withdrawal), clamp to 0
    if (calculatedMonthlyInvestment < 0) calculatedMonthlyInvestment = 0;

  } else {
    // Mode: User provides Monthly Investment, we calculate Time to 1 Million
    // We will simulate month by month until we hit 1M or a safety limit (e.g., 100 years)
    
    // Rough estimate or loop. Since we need the table anyway, let's loop.
    // However, to prevent browser crash on bad inputs (e.g. 0 investment, 0 rate), we set a hard limit.
    const MAX_MONTHS = 1200; // 100 years
    let currentBalance = initialAmount;
    let n = 0;

    // Pre-calculation check: if rate is 0 and investment is 0, we never reach it (unless initial > 1M)
    if (initialAmount >= TARGET_AMOUNT) {
      monthsToSimulate = 0;
    } else if (r <= 0 && calculatedMonthlyInvestment <= 0) {
       // Stagnant
       monthsToSimulate = 0; // Return empty result effectively
    } else {
      while (currentBalance < TARGET_AMOUNT && n < MAX_MONTHS) {
        currentBalance = currentBalance * (1 + r) + calculatedMonthlyInvestment;
        n++;
      }
      monthsToSimulate = n;
    }
  }

  // --- GENERATE ROWS ---
  
  const rows: SimulationRow[] = [];
  let currentBalance = initialAmount;
  let accumulatedInterest = 0;
  let accumulatedInvested = initialAmount;

  // Initial Row (Month 0)
  rows.push({
    monthIndex: 0,
    monthlyInvestment: 0,
    interestEarned: 0,
    totalInvested: initialAmount,
    totalInterest: 0,
    totalAccumulated: initialAmount
  });

  for (let i = 1; i <= monthsToSimulate; i++) {
    const startBalance = currentBalance;
    const interest = startBalance * r;
    
    currentBalance = startBalance + interest + calculatedMonthlyInvestment;
    
    accumulatedInterest += interest;
    accumulatedInvested += calculatedMonthlyInvestment;

    rows.push({
      monthIndex: i,
      monthlyInvestment: calculatedMonthlyInvestment,
      interestEarned: interest,
      totalInvested: accumulatedInvested,
      totalInterest: accumulatedInterest,
      totalAccumulated: currentBalance
    });
  }

  return {
    summary: {
      totalInvested: accumulatedInvested,
      totalInterest: accumulatedInterest,
      finalAmount: currentBalance,
      totalMonths: monthsToSimulate,
      monthlyInvestmentRequired: mode === 'VALUE' ? calculatedMonthlyInvestment : undefined
    },
    rows
  };
};