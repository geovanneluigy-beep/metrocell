import React from 'react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenSettings,
  onOpenAdmin,
}) => {
  return (
    <footer id="localizacao" className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Store Bio */}
          <div className="md:col-span-2 space-y-3">
            <div className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                SF
              </span>
              <span>{settings.storeName}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Especialistas em venda de smartphones seminovos testados com garantia e assistência técnica expressa para troca de tela, bateria, conectores e recuperação de placa.
            </p>
            <div className="text-xs text-slate-500 pt-1">
              📍 Endereço: <span className="text-slate-300">{settings.storeAddress}</span>
            </div>
            <div className="text-xs text-slate-500">
              ⏰ Horário: <span className="text-slate-300">{settings.workingHours}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Navegação Rápida
            </h4>
            <div>
              <a href="#catalogo" className="hover:text-white transition-colors">
                Celulares em Estoque
              </a>
            </div>
            <div>
              <a href="#conserto" className="hover:text-white transition-colors">
                Orçamento de Conserto
              </a>
            </div>
            <div>
              <a href="#diferenciais" className="hover:text-white transition-colors">
                Garantia e Procedência
              </a>
            </div>
            <div>
              <button
                onClick={onOpenSettings}
                className="hover:text-white transition-colors text-left"
              >
                Alterar Número de WhatsApp
              </button>
            </div>
          </div>

          {/* Col 3: Owner Admin Access */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              Área do Lojista
            </h4>
            <p className="text-[11px] text-slate-500">
              Controle o estoque do Galaxy A10s e demais aparelhos em tempo real.
            </p>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 transition-colors mt-2"
            >
              <span>Abrir Painel de Gestão</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            © {new Date().getFullYear()} {settings.storeName}. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Atendimento Rápido via WhatsApp</span>
            <span aria-hidden="true">·</span>
            <span>Garantia Legal de 90 dias (CDC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
