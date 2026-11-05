import React from 'react';
import { ShieldCheck, Cpu, Clock, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const steps = [
    {
      icon: <CheckCircle className="w-5 h-5 text-blue-600" />,
      title: '1. Teste Rigoroso em +30 Itens',
      desc: 'Antes de ir para a vitrine, cada celular tem biometria, câmeras, touch, alto-falantes, conectores e saúde da bateria rigorosamente testados.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: '2. Garantia Total de 90 Dias',
      desc: 'Comprovante de compra com termo de garantia por escrito. Qualquer defeito técnico é coberto com troca imediata ou reparo gratuito.',
    },
    {
      icon: <Cpu className="w-5 h-5 text-indigo-600" />,
      title: '3. Procedência e IMEI Limpo',
      desc: 'Aparelhos com consulta completa na Anatel e sem restrições. Desbloqueados para qualquer operadora do Brasil.',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      title: '4. Reparo Expresso no Balcão',
      desc: 'Troca de tela e bateria executada na hora por técnico qualificado, na sua frente ou com entrega ágil no mesmo dia.',
    },
  ];

  return (
    <section id="diferenciais" className="py-14 sm:py-20 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
            Qualidade Comprovada
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ textWrap: 'balance' }}>
            Compre e conserte com quem entende de celular
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Segurança, procedência garantida e suporte direto via WhatsApp para tirar qualquer dúvida antes de fechar negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5 transition-all hover:bg-white hover:shadow-md"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                {step.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
