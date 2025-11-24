import React, { useState, useEffect } from 'react';
import { 
  CalculationMode, 
  RateType, 
  PeriodType, 
  SimulationData 
} from './types';
import { calculateSimulation } from './utils/calculations';
import { formatCurrencyInput } from './utils/formatters';
import SummaryCards from './components/SummaryCards';
import ResultsChart from './components/ResultsChart';
import ResultTable from './components/ResultTable';
import InfoSection from './components/InfoSection';
import { 
  TrendingUp, 
  Eraser, 
  Calculator as CalcIcon 
} from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [activeTab, setActiveTab] = useState<CalculationMode>(CalculationMode.TIME_TO_MILLION);

  // Form Inputs
  const [initialAmount, setInitialAmount] = useState<string>('0,00');
  const [rateValue, setRateValue] = useState<string>('12'); 
  const [rateType, setRateType] = useState<RateType>(RateType.ANNUAL);
  
  // Specific to Time To Million
  const [monthlyInvest, setMonthlyInvest] = useState<string>('1.000,00');
  
  // Specific to Monthly Needed
  const [periodValue, setPeriodValue] = useState<string>('5');
  const [periodType, setPeriodType] = useState<PeriodType>(PeriodType.YEARS);

  // Result State
  const [result, setResult] = useState<SimulationData | null>(null);

  // --- Handlers ---

  const handleMoneyChange = (value: string, setter: (v: string) => void) => {
    const formatted = formatCurrencyInput(value);
    setter(formatted);
  };

  const handleNumberChange = (value: string, setter: (v: string) => void) => {
    // Allow digits and comma only
    const clean = value.replace(/[^0-9,]/g, '');
    setter(clean);
  };

  const handleNumberFocus = (value: string, setter: (v: string) => void) => {
    if (value === '0') {
      setter('');
    }
  };

  const handleNumberBlur = (value: string, setter: (v: string) => void) => {
    if (value === '') {
      setter('0');
    }
  };

  const handleCalculate = () => {
    // Parse inputs
    const initial = parseFloat(initialAmount.replace(/\./g, '').replace(',', '.')) || 0;
    const rate = parseFloat(rateValue.replace(/\./g, '').replace(',', '.')) || 0;
    const monthly = parseFloat(monthlyInvest.replace(/\./g, '').replace(',', '.')) || 0;
    const period = parseFloat(periodValue.replace(/\./g, '').replace(',', '.')) || 0;

    const data = calculateSimulation(
      initial,
      rate,
      rateType,
      monthly,
      period,
      periodType,
      activeTab === CalculationMode.TIME_TO_MILLION ? 'TIME' : 'VALUE'
    );

    setResult(data);
  };

  const handleClear = () => {
    setInitialAmount('0,00');
    setRateValue('0');
    setMonthlyInvest('0,00');
    setPeriodValue('0');
    setResult(null);
  };

  // Auto-calculate on mount
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeTabClass = "bg-white text-slate-800 border-b-2 border-slate-800 font-semibold";
  const inactiveTabClass = "bg-transparent text-gray-500 hover:text-gray-700 font-medium";

  // Dynamic explanation text based on result
  const renderResultExplanation = () => {
    if (!result) return null;
    
    const { totalMonths, totalInvested, totalInterest, finalAmount, monthlyInvestmentRequired } = result.summary;
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
    const timeText = `${years > 0 ? `${years} anos` : ''}${years > 0 && months > 0 ? ' e ' : ''}${months > 0 ? `${months} meses` : ''}`;

    const formattedFinal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(finalAmount);
    const formattedInvested = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested);
    const formattedInterest = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInterest);
    
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-2">
          {activeTab === CalculationMode.TIME_TO_MILLION ? 'Tempo de Investimento' : 'Valor Mensal Necessário'}
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {activeTab === CalculationMode.TIME_TO_MILLION ? (
            <>
              Você vai atingir seu primeiro milhão em <strong className="text-emerald-600">{timeText}</strong>.
              Após esse prazo, o valor total será de <strong>{formattedFinal}</strong>, sendo <strong>{formattedInvested}</strong> de valor investido e <strong>{formattedInterest}</strong> de rendimentos.
            </>
          ) : (
            <>
              Considerando os valores informados, você precisa investir <strong className="text-emerald-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyInvestmentRequired || 0)}</strong> mensalmente para atingir seu primeiro milhão em <strong>{timeText}</strong>!
              Desta forma, você irá alcançar <strong>{formattedFinal}</strong> neste período, sendo <strong>{formattedInvested}</strong> de valor investido e de rendimento <strong>{formattedInterest}</strong>.
            </>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="bg-slate-800 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="bg-slate-700 p-2 rounded-md">
            <TrendingUp size={24} className="text-yellow-400" />
          </div>
          <h1 className="text-xl font-bold tracking-wide uppercase">Simulador do Primeiro Milhão</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-8 px-4">
        
        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => { setActiveTab(CalculationMode.TIME_TO_MILLION); setResult(null); }}
              className={`flex-1 py-4 text-center transition-all duration-200 ${activeTab === CalculationMode.TIME_TO_MILLION ? activeTabClass : inactiveTabClass}`}
            >
              Tempo de Investimento
            </button>
            <button
              onClick={() => { setActiveTab(CalculationMode.MONTHLY_NEEDED); setResult(null); }}
              className={`flex-1 py-4 text-center transition-all duration-200 ${activeTab === CalculationMode.MONTHLY_NEEDED ? activeTabClass : inactiveTabClass}`}
            >
              Valor Mensal Necessário
            </button>
          </div>

          {/* Input Form Area */}
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">
              
              {/* Common Input: Initial Amount */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">
                  Quanto você já tem guardado e investido?
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-bold">R$</div>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={initialAmount}
                    onChange={(e) => handleMoneyChange(e.target.value, setInitialAmount)}
                    onFocus={(e) => e.target.select()}
                    className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                    placeholder="0,00"
                  />
                </div>
              </div>

              {/* Common Input: Interest Rate */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Taxa de Juros</label>
                <div className="flex rounded-lg shadow-sm">
                  <div className="relative flex-grow">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-bold">%</div>
                     <input
                      type="text"
                      inputMode="decimal"
                      value={rateValue}
                      onChange={(e) => handleNumberChange(e.target.value, setRateValue)}
                      onFocus={() => handleNumberFocus(rateValue, setRateValue)}
                      onBlur={() => handleNumberBlur(rateValue, setRateValue)}
                      className="pl-8 w-full p-3 bg-gray-50 border border-gray-300 rounded-l-lg border-r-0 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
                  <select
                    value={rateType}
                    onChange={(e) => setRateType(e.target.value as RateType)}
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-r-lg focus:ring-slate-800 focus:border-slate-800 block p-2.5 outline-none min-w-[100px]"
                  >
                    <option value={RateType.ANNUAL}>ANUAL</option>
                    <option value={RateType.MONTHLY}>MENSAL</option>
                  </select>
                </div>
              </div>

              {/* Conditional Input based on Tab */}
              {activeTab === CalculationMode.TIME_TO_MILLION ? (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Valor de investimento Mensal
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 font-bold">R$</div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={monthlyInvest}
                      onChange={(e) => handleMoneyChange(e.target.value, setMonthlyInvest)}
                      onFocus={(e) => e.target.select()}
                      className="pl-10 w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 block">Período para o primeiro milhão</label>
                  <div className="flex rounded-lg shadow-sm">
                     <input
                      type="text"
                      inputMode="numeric"
                      value={periodValue}
                      onChange={(e) => handleNumberChange(e.target.value, setPeriodValue)}
                      onFocus={() => handleNumberFocus(periodValue, setPeriodValue)}
                      onBlur={() => handleNumberBlur(periodValue, setPeriodValue)}
                      className="w-full p-3 bg-gray-50 border border-gray-300 rounded-l-lg border-r-0 focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                      placeholder="0"
                    />
                    <select
                      value={periodType}
                      onChange={(e) => setPeriodType(e.target.value as PeriodType)}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-r-lg focus:ring-slate-800 focus:border-slate-800 block p-2.5 outline-none min-w-[100px]"
                    >
                      <option value={PeriodType.YEARS}>ANOS</option>
                      <option value={PeriodType.MONTHS}>MESES</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="lg:col-span-3 flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                <button
                  onClick={handleClear}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Eraser size={18} />
                  LIMPAR
                </button>
                <button
                  onClick={handleCalculate}
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-yellow-400 rounded-lg font-bold hover:bg-slate-800 transition-all shadow-md active:scale-95"
                >
                  CALCULAR
                  <CalcIcon size={18} />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 animate-fade-in">
            
            {/* Text Explanation */}
            {renderResultExplanation()}

            {/* Summary Cards */}
            <SummaryCards summary={result.summary} mode={activeTab} />

            {/* Charts */}
            <ResultsChart data={result.rows} summary={result.summary} />

            {/* Table */}
            <ResultTable data={result.rows} />
          </div>
        )}

        <div className="border-t border-gray-200 my-12"></div>

        <InfoSection />

        <div className="mt-12 mb-8 bg-slate-800 text-white rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Outras Calculadoras</h3>
              <p className="text-gray-400 text-sm">Explore mais ferramentas para sua liberdade financeira.</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
               <div className="w-48 h-24 bg-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer border border-slate-600 hover:border-yellow-400 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent opacity-80"></div>
                  <span className="relative z-10 font-bold text-center p-2">JUROS COMPOSTOS</span>
               </div>
               <div className="w-48 h-24 bg-slate-700 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer border border-slate-600 hover:border-yellow-400 transition-colors">
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-transparent opacity-80"></div>
                  <span className="relative z-10 font-bold text-center p-2">JUROS SIMPLES</span>
               </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;