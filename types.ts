export enum CalculationMode {
  TIME_TO_MILLION = 'TIME_TO_MILLION', // "Tempo de Investimento"
  MONTHLY_NEEDED = 'MONTHLY_NEEDED'    // "Valor Mensal Necessário"
}

export enum PeriodType {
  MONTHS = 'MESES',
  YEARS = 'ANOS'
}

export enum RateType {
  MONTHLY = 'MENSAL',
  ANNUAL = 'ANUAL'
}

export interface SimulationRow {
  monthIndex: number;
  monthlyInvestment: number;
  interestEarned: number;
  totalInvested: number;
  totalInterest: number;
  totalAccumulated: number;
}

export interface SimulationSummary {
  totalInvested: number;
  totalInterest: number;
  finalAmount: number;
  totalMonths: number;
  monthlyInvestmentRequired?: number; // Used only for the "Monthly Needed" mode
}

export interface SimulationData {
  summary: SimulationSummary;
  rows: SimulationRow[];
}