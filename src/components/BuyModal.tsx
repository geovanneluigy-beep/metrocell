import React, { useState } from 'react';
import { X, MessageCircle, ShieldCheck, CheckCircle2, Lock, ShoppingBag } from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { formatBRL, generateWhatsAppBuyUrl } from '../utils/storeLogic';

interface BuyModalProps {
  product: Product | null;
  settings: StoreSettings;
  onClose: () => void;
  onConfirmSaleAndDeduct: (product: Product) => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({
  product,
  settings,
  onClose,
  onConfirmSaleAndDeduct,
}) => {
  const [clientNote, setClientNote] = useState('');

  if (!product) return null;

  const handleOpenWhatsAppOnly = () => {
    const url = generateWhatsAppBuyUrl(settings.whatsappNumber, product, clientNote);
    window.open(url, '_blank');
  };

  const handleOpenAndDeduct = () => {
    const url = generateWhatsAppBuyUrl(settings.whatsappNumber, product, clientNote);
    window.open(url, '_blank');
    onConfirmSaleAndDeduct(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </span>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-slate-900">
                Confirmar Interesse & Compra
              </h3>
              <p className="text-xs text-slate-500">Negociação direta com o vendedor no WhatsApp</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center"
            aria-label="Fechar janela"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Product Summary Box */}
          <div className="flex gap-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-white shrink-0 border border-slate-200">
              <img
                src={product.image}
                alt={product.model}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[11px] font-semibold text-blue-600 uppercase">
                {product.brand} · {product.condition}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate">{product.model}</h4>
              <div className="text-xs text-slate-500">
                {product.storage} · Cor: {product.color}
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-lg font-bold font-mono text-emerald-700">
                  {formatBRL(product.price)}
                </span>
                <span className="text-xs text-slate-400">à vista</span>
              </div>
            </div>
          </div>

          {/* Current Stock Notification */}
          <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-900 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Estoque atual: {product.stock} unidade(s).</span>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Ao finalizar a venda pelo WhatsApp, o site permite dar baixa imediata para trancar o produto como "Vendido/Esgotado".
              </p>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="clientNote" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Dúvida ou forma de pagamento preferida (opcional):
            </label>
            <input
              id="clientNote"
              type="text"
              value={clientNote}
              onChange={(e) => setClientNote(e.target.value)}
              placeholder="Ex: Vou pagar no PIX e retirar na loja hoje"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          {/* Payment & Warranty Guarantee */}
          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Garantia de 90 dias com termo da loja</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 text-center font-bold text-blue-600">❖</span>
              <span>Aceitamos PIX, Cartão até 12x e Dinheiro</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-2">
          {/* Primary Action: WhatsApp & Deduct Stock Simulation */}
          <button
            onClick={handleOpenAndDeduct}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chamar no WhatsApp & Marcar Venda (Dar Baixa)</span>
          </button>

          <button
            onClick={handleOpenWhatsAppOnly}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center justify-center gap-2 transition-all"
          >
            <span>Apenas abrir WhatsApp (sem dar baixa agora)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
