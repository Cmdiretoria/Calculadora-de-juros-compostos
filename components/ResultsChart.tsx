import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { SimulationRow, SimulationSummary } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ResultsChartProps {
  data: SimulationRow[];
  summary: SimulationSummary;
}

const ResultsChart: React.FC<ResultsChartProps> = ({ data, summary }) => {
  // Sample data to avoid rendering thousands of bars
  // We want max ~40-50 bars for readability
  const samplingRate = Math.max(1, Math.floor(data.length / 40));
  const chartData = data.filter((_, index) => index % samplingRate === 0 || index === data.length - 1);

  const pieData = [
    { name: 'Valor Investido', value: summary.totalInvested },
    { name: 'Valor em Juros', value: summary.totalInterest },
  ];
  
  const PIE_COLORS = ['#4b5563', '#a5c7e3']; // Match image roughly: Dark Gray, Light Blue

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
      <div className="flex items-center gap-2 mb-6 border-b pb-4 border-gray-100">
        <div className="bg-slate-800 text-yellow-500 p-1 rounded">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
        </div>
        <h2 className="text-lg font-bold text-slate-800 uppercase">Gráfico</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pie Chart Section */}
        <div className="h-64 lg:h-auto flex flex-col items-center justify-center relative">
           <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
          {/* Custom Center Label or simple Legend above */}
          <div className="flex gap-4 text-xs justify-center absolute top-0 w-full">
             <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-gray-600 inline-block rounded-sm"></span>
                <span>Valor Investido</span>
             </div>
             <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-blue-200 inline-block rounded-sm"></span>
                <span>Valor em Juros</span>
             </div>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="h-80 lg:col-span-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="monthIndex" 
                tick={{fontSize: 10}} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => val}
                label={{ value: 'Meses', position: 'insideBottom', offset: -5, fontSize: 12 }}
              />
              <YAxis 
                tick={{fontSize: 10}} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `R$ ${(val/1000000).toFixed(1)}M`;
                  if (val >= 1000) return `R$ ${(val/1000).toFixed(0)}K`;
                  return val;
                }}
              />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Mês ${label}`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="totalInvested" stackId="a" fill="#4b5563" barSize={10} name="Total Investido" radius={[0, 0, 0, 0]} />
              <Bar dataKey="totalInterest" stackId="a" fill="#a5c7e3" barSize={10} name="Total em Juros" radius={[4, 4, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default ResultsChart;