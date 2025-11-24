import React, { useState, useEffect } from 'react';
import { SimulationRow } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultTableProps {
  data: SimulationRow[];
}

const ResultTable: React.FC<ResultTableProps> = ({ data }) => {
  const [visibleRows, setVisibleRows] = useState(12);

  // Reset pagination when data changes
  useEffect(() => {
    setVisibleRows(12);
  }, [data]);

  const handleShowMore = () => {
    setVisibleRows((prev) => Math.min(prev + 24, data.length));
  };

  const visibleData = data.slice(0, visibleRows);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-2">
        <div className="bg-slate-800 text-yellow-500 p-1 rounded">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800 uppercase">Tabela</h2>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-sm text-center">
          <thead className="bg-gray-100 text-gray-700 font-semibold">
            <tr>
              <th className="p-3">Meses</th>
              <th className="p-3">Investimento Mensal</th>
              <th className="p-3">Juros</th>
              <th className="p-3">Total Investido</th>
              <th className="p-3">Total Juros</th>
              <th className="p-3">Acumulado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {visibleData.map((row) => (
              <tr key={row.monthIndex} className="hover:bg-gray-50 transition-colors">
                <td className="p-3 font-medium">{row.monthIndex}</td>
                <td className="p-3">{formatCurrency(row.monthlyInvestment)}</td>
                <td className="p-3 text-green-600">+{formatCurrency(row.interestEarned)}</td>
                <td className="p-3">{formatCurrency(row.totalInvested)}</td>
                <td className="p-3">{formatCurrency(row.totalInterest)}</td>
                <td className="p-3 font-bold text-slate-700">{formatCurrency(row.totalAccumulated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visibleRows < data.length && (
        <div className="p-4 flex justify-center border-t border-gray-100">
          <button 
            onClick={handleShowMore}
            className="px-6 py-2 border border-gray-300 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-slate-800 transition-colors uppercase"
          >
            Leia Mais
          </button>
        </div>
      )}
    </div>
  );
};

export default ResultTable;