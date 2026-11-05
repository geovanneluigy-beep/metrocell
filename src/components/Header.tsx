import React from 'react';
import { StoreSettings } from '../types';

interface HeaderProps {
  settings: StoreSettings;
  onOpenAdmin: () => void;
  onOpenSettings: () => void;
  stockCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenAdmin,
  onOpenSettings,
  stockCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#topo"
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            SF
          </span>
          <span>SmartFix Celulares</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a
            href="#catalogo"
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Aparelhos à Venda
          </a>
          <a
            href="#conserto"
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Orçamento Conserto
          </a>
          <a
            href="#diferenciais"
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Garantia & Procedência
          </a>
          <a
            href="#localizacao"
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Nossa Loja
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action (Manager Panel with live inventory badge) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenSettings}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="Configurar número de WhatsApp"
            aria-label="Configurações do WhatsApp da loja"
          >
            <span>WhatsApp da Loja</span>
          </button>

          <button
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            aria-label="Abrir Painel de Gestão de Estoque"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Painel Estoque ({stockCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
};
