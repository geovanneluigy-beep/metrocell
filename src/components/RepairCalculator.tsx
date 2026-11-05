import React, { useState } from 'react';
import { Wrench, Clock, ShieldCheck, MessageCircle, Sparkles, MapPin, Check } from 'lucide-react';
import { StoreSettings } from '../types';
import { COMMON_REPAIR_PROBLEMS } from '../data/initialData';
import { generateWhatsAppRepairUrl, getRepairEstimate } from '../utils/storeLogic';

interface RepairCalculatorProps {
  settings: StoreSettings;
}

export const RepairCalculator: React.FC<RepairCalculatorProps> = ({ settings }) => {
  const [brand, setBrand] = useState('Samsung');
  const [model, setModel] = useState('Galaxy A10s');
  const [problem, setProblem] = useState(COMMON_REPAIR_PROBLEMS[0]);
  const [customerName, setCustomerName] = useState('');
  const [serviceType, setServiceType] = useState<'balcao' | 'motoboy'>('balcao');
  const [notes, setNotes] = useState('');

  const estimate = getRepairEstimate(problem);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      alert('Por favor, informe o modelo do aparelho (ex: Galaxy A10s, iPhone 11).');
      return;
    }

    const url = generateWhatsAppRepairUrl(
      settings.whatsappNumber,
      {
        brand,
        model: model.trim(),
        problem,
        additionalDetails: notes.trim() || undefined,
        serviceType,
        customerName: customerName.trim() || undefined,
      },
      estimate.range
    );

    window.open(url, '_blank');
  };

  return (
    <section id="conserto" className="py-16 sm:py-20 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span>Assistência Técnica Especializada</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
            Simulador de Orçamento para Conserto de Celular
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Troca de tela, bateria, conector de carga e reparo em placa. Simule abaixo e receba o orçamento detalhado em poucos minutos no WhatsApp.
          </p>
        </div>

        {/* 2-Column Split: Calculator Form + Live Summary Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-sm">
            <form onSubmit={handleSendWhatsApp} className="space-y-5">
              {/* Brand Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  1. Marca do Aparelho
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {['Samsung', 'Apple', 'Motorola', 'Xiaomi', 'Outro'].map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => setBrand(b)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                        brand === b
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-700/60'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Input with Quick suggestions */}
              <div>
                <label htmlFor="modelInput" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  2. Modelo do Celular
                </label>
                <input
                  id="modelInput"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ex: Samsung Galaxy A10s, iPhone 11, Moto G54..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  required
                />
                {/* Fast Suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 self-center">Exemplos rápidos:</span>
                  {['Galaxy A10s', 'Galaxy A14', 'iPhone 11', 'iPhone 12', 'Moto G54'].map((sug) => (
                    <button
                      type="button"
                      key={sug}
                      onClick={() => {
                        setModel(sug);
                        if (sug.includes('iPhone')) setBrand('Apple');
                        else if (sug.includes('Galaxy')) setBrand('Samsung');
                        else if (sug.includes('Moto')) setBrand('Motorola');
                      }}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              {/* Problem Select */}
              <div>
                <label htmlFor="problemSelect" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  3. O que está acontecendo com o celular?
                </label>
                <select
                  id="problemSelect"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  {COMMON_REPAIR_PROBLEMS.map((prob) => (
                    <option key={prob} value={prob}>
                      {prob}
                    </option>
                  ))}
                </select>
              </div>

              {/* Attendance modality */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  4. Como prefere ser atendido?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      serviceType === 'balcao'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-900/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      checked={serviceType === 'balcao'}
                      onChange={() => setServiceType('balcao')}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Vou levar no balcão da loja</div>
                      <div className="text-[11px] text-slate-400">Atendimento rápido enquanto você aguarda</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      serviceType === 'motoboy'
                        ? 'bg-blue-900/30 border-blue-500 text-white'
                        : 'bg-slate-900/40 border-slate-700 text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      checked={serviceType === 'motoboy'}
                      onChange={() => setServiceType('motoboy')}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold">Leva e Traz (Motoboy)</div>
                      <div className="text-[11px] text-slate-400">Retiramos e entregamos no seu endereço</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Customer Name & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="customerNameInput" className="block text-xs font-medium text-slate-400 mb-1">
                    Seu Nome (opcional)
                  </label>
                  <input
                    id="customerNameInput"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="notesInput" className="block text-xs font-medium text-slate-400 mb-1">
                    Observações adicionais (opcional)
                  </label>
                  <input
                    id="notesInput"
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: vidro trincou mas touch funciona"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/25 active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Pedir Orçamento com Técnico no WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Real-time Estimate Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4" />
                <span>Estimativa Instantânea</span>
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-400">Aparelho Selecionado:</div>
                <div className="text-xl font-bold text-white">
                  {brand} {model || '(Digite o modelo)'}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  Serviço: {problem}
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-700/60 mb-5">
                <div className="text-xs text-slate-400 mb-1">Faixa de valor estimada:</div>
                <div className="text-xl font-mono font-bold text-emerald-400">
                  {estimate.range}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  *Valor final confirmado após verificação física da peça pelo técnico.
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Prazo estimado: <strong className="text-white">{estimate.time}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garantia de <strong>90 dias</strong> em peças e mão de obra</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Loja física: {settings.storeAddress}</span>
                </div>
              </div>
            </div>

            {/* Why choose us badge list */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
                Por que consertar na SmartFix?
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Bancada profissional com ferramentas anti-estática de alta precisão</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Sem perda dos seus dados e fotos na grande maioria dos reparos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Opções de tela original nacional ou primeira linha homologada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
