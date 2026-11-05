import React from 'react';
import { ArrowRight, Wrench, ShieldCheck, Zap } from 'lucide-react';
import { StoreSettings } from '../types';

interface HeroProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  availableCount: number;
}

export const Hero: React.FC<HeroProps> = ({ settings, availableCount }) => {
  return (
    <section id="topo" className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background with measured dark scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_smartphone_store_1793920767110.jpg"
          alt="Bancada de assistência técnica e celulares"
          className="w-full h-full object-cover opacity-25"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400">
              <span>Smartphones Revisados</span>
              <span aria-hidden="true">·</span>
              <span>Conserto Expresso</span>
              <span aria-hidden="true">·</span>
              <span>Garantia de 90 Dias</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
              Celulares seminovos selecionados e assistência técnica de confiança.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              Compre aparelhos testados e revisados com estoque em tempo real pelo WhatsApp, ou faça o conserto da sua tela, bateria e conector com agilidade e peças premium.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href="#catalogo"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all shadow-lg shadow-blue-600/25 active:scale-95"
              >
                <span>Ver Celulares Disponíveis</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#conserto"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-xl transition-all active:scale-95"
              >
                <Wrench className="w-4 h-4 text-blue-400" />
                <span>Simular Orçamento de Reparo</span>
              </a>
            </div>

            {/* Trust points */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-3 gap-4 text-slate-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>90 dias de garantia com nota</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Reparo rápido no mesmo dia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tabular-nums">{availableCount} un.</span>
                <span>em estoque a pronta entrega</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-800/50 p-6 backdrop-blur-sm shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-5">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Exemplo em Destaque</div>
                  <div className="text-lg font-bold text-white">Samsung Galaxy A10s 32GB</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">À vista no PIX</div>
                  <div className="text-xl font-mono font-bold text-emerald-400">R$ 420,00</div>
                </div>
              </div>

              <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 mb-4">
                <img
                  src="/src/assets/images/product_samsung_a10s_1793920766814.jpg"
                  alt="Samsung Galaxy A10s em estoque"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Condição:</span>
                  <span className="font-semibold text-white">Seminovo 100% Revisado</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Acompanha:</span>
                  <span className="font-semibold text-white">Carregador + Película 3D</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Controle de Estoque:</span>
                  <span className="font-semibold text-emerald-400">Pronto para entrega imediata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
