import React from 'react';

const InfoSection: React.FC = () => {
  return (
    <div className="mt-12 space-y-8 text-gray-600 leading-relaxed max-w-4xl mx-auto px-4">
      
      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">O que é a Calculadora do Milhão?</h2>
        <p className="mb-4">
          Conquistar o primeiro milhão é um marco financeiro simbólico que representa segurança, liberdade e a realização de grandes sonhos. 
          Embora pareça distante, é um objetivo alcançável com planejamento e consistência.
        </p>
        <p>
          Esta calculadora foi desenvolvida para simplificar a matemática dos juros compostos, permitindo que você visualize exatamente 
          <strong> quanto tempo</strong> levará ou <strong>quanto dinheiro</strong> precisará investir mensalmente para chegar lá.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Como funciona a matemática?</h2>
        <p className="mb-4">
          Utilizamos a fórmula dos juros compostos, onde os rendimentos de cada mês geram novos rendimentos no mês seguinte. 
          A lógica básica para o cálculo da parcela necessária (PMT) é:
        </p>
        <div className="bg-slate-100 p-4 rounded-md font-mono text-sm text-slate-700 mb-4 overflow-x-auto">
          PMT = (FV - PV * (1 + r)^n) / (((1 + r)^n - 1) / r)
        </div>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>PV (Valor Presente):</strong> O dinheiro que você já tem guardado hoje.</li>
          <li><strong>FV (Valor Futuro):</strong> A meta de R$ 1.000.000,00.</li>
          <li><strong>r (Taxa):</strong> A rentabilidade mensal dos seus investimentos.</li>
          <li><strong>n (Período):</strong> O número total de meses que o dinheiro ficará rendendo.</li>
        </ul>
      </section>

      <section className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-r-lg">
        <h3 className="text-xl font-bold text-slate-800 mb-3">Dicas de Ouro para seu Milhão</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">1. Comece Cedo</h4>
            <p className="text-sm">O tempo é o maior multiplicador nos juros compostos. Quanto antes começar, menor será o esforço mensal necessário.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">2. Aporte Regularmente</h4>
            <p className="text-sm">A disciplina de investir todo mês, mesmo que pouco, vence a tentativa de acertar "a grande tacada" única.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">3. Diversifique</h4>
            <p className="text-sm">Não coloque todos os ovos na mesma cesta. Misture Renda Fixa e Variável conforme seu perfil para equilibrar risco e retorno.</p>
          </div>
          <div>
            <h4 className="font-semibold text-emerald-700 mb-2">4. Reinvista os Dividendos</h4>
            <p className="text-sm">No início, use os rendimentos para comprar mais ativos, acelerando o efeito "bola de neve".</p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default InfoSection;