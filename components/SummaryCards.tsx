import React from 'react';
import { formatCurrency } from '../utils/formatters';
import { SimulationSummary, CalculationMode } from '../types';

interface SummaryCardsProps {
  summary: SimulationSummary;
  mode: CalculationMode;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ summary, mode }) => {
  const years = Math.floor(summary.totalMonths / 12);
  const months = summary.totalMonths % 12;
  const timeString = years > 0 ? `${years} Anos${months > 0 ? ` e ${months} Meses` : ''}` : `${months} Meses`;

  // Determine what to show in the first card based on mode
  const firstCardTitle = mode === CalculationMode.TIME_TO_MILLION 
    ? "Tempo de Investimento" 
    : "Valor Investimento Mensal";

  const firstCardValue = mode === CalculationMode.TIME_TO_MILLION 
    ? timeString 
    : formatCurrency(summary.monthlyInvestmentRequired || 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Dynamic Card */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium mb-1">{firstCardTitle}</h3>
        <p className="text-2xl font-bold text-emerald-600 truncate" title={String(firstCardValue)}>
          {firstCardValue}
        </p>
      </div>

      {/* Total Interest */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium mb-1">Total em Juros</h3>
        <p className="text-2xl font-bold text-blue-400 truncate" title={formatCurrency(summary.totalInterest)}>
          {formatCurrency(summary.totalInterest)}
        </p>
      </div>

      {/* Total Invested */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium mb-1">Valor Total Investido</h3>
        <p className="text-2xl font-bold text-gray-700 truncate" title={formatCurrency(summary.totalInvested)}>
          {formatCurrency(summary.totalInvested)}
        </p>
      </div>

      {/* Final Amount */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-gray-600 text-sm font-medium mb-1">Valor Total Final</h3>
        <p className="text-2xl font-bold text-gray-800 truncate" title={formatCurrency(summary.finalAmount)}>
          {formatCurrency(summary.finalAmount)}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;