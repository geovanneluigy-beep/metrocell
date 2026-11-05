import React, { useState } from 'react';
import { MessageCircle, Lock, CheckCircle2, AlertCircle, Plus, Minus, Info } from 'lucide-react';
import { Product } from '../types';
import { formatBRL, isOutOfStock } from '../utils/storeLogic';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onAlterStock: (id: string, delta: number) => void;
  onDirectOrderLock: (product: Product) => void;
  isManagerMode: boolean;
  onCustomInquiry: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onBuy,
  onAlterStock,
  onDirectOrderLock,
  isManagerMode,
  onCustomInquiry,
}) => {
  const [imageError, setImageError] = useState(false);
  const outOfStock = isOutOfStock(product);

  // Approximate 12x installment with typical machine fee
  const installmentValue = (product.price * 1.15) / 12;

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 flex flex-col overflow-hidden ${
        outOfStock
          ? 'border-slate-200 bg-slate-50/70 opacity-90'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-lg shadow-sm'
      }`}
    >
      {/* Product Image Area */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.model}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 ${
              outOfStock ? 'grayscale-40 contrast-90' : ''
            }`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-400">
            <span className="text-3xl mb-1">📱</span>
            <span className="text-xs font-medium text-slate-500">{product.model}</span>
          </div>
        )}

        {/* Status Tag */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {outOfStock ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm">
              <Lock className="w-3.5 h-3.5" />
              <span>ESGOTADO / VENDIDO</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600 text-white shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Em Estoque ({product.stock} un.)</span>
            </span>
          )}
        </div>

        {/* Condition tag */}
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-900/80 text-white backdrop-blur-sm">
            {product.condition}
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1">
        {/* Unboxed Metadata */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
          <span className="font-semibold text-slate-700">{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.storage}</span>
          <span aria-hidden="true">·</span>
          <span>{product.color}</span>
          {product.batteryHealth && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-semibold">Bateria {product.batteryHealth}%</span>
            </>
          )}
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
          {product.model}
        </h3>

        {/* Warranty and Items */}
        <div className="text-xs text-slate-600 space-y-1 mb-4">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <span className="text-blue-600">✓</span>
            <span>{product.warranty}</span>
          </div>
          {product.itemsIncluded && product.itemsIncluded.length > 0 && (
            <p className="text-slate-500 truncate" title={product.itemsIncluded.join(', ')}>
              Acompanha: {product.itemsIncluded.slice(0, 3).join(', ')}
            </p>
          )}
        </div>

        {/* Price Area */}
        <div className="mt-auto pt-3 border-t border-slate-100 mb-4">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through mr-1.5 tabular-nums">
                  {formatBRL(product.originalPrice)}
                </span>
              )}
              <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                {formatBRL(product.price)}
              </span>
              <span className="text-xs text-slate-500 block font-normal">à vista no PIX ou Dinheiro</span>
            </div>
            <div className="text-right text-xs text-slate-500">
              <span className="block font-medium text-slate-700">ou 12x de</span>
              <span className="font-mono font-semibold text-slate-900">{formatBRL(installmentValue)}</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        {outOfStock ? (
          <div className="space-y-2">
            <button
              disabled
              className="w-full py-3 px-4 rounded-xl bg-slate-200 text-slate-500 font-semibold text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none border border-slate-300"
              aria-label={`Produto ${product.model} esgotado e bloqueado`}
            >
              <Lock className="w-4 h-4 text-slate-400" />
              <span>Venda Bloqueada (Sem Estoque)</span>
            </button>
            <button
              onClick={() => onCustomInquiry(product)}
              className="w-full py-2 px-3 text-xs font-semibold text-blue-700 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Encomendar este modelo no WhatsApp</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onBuy(product)}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-98"
            aria-label={`Comprar ${product.model} por ${formatBRL(product.price)} via WhatsApp`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comprar via WhatsApp</span>
          </button>
        )}

        {/* Owner Quick Stock Bar (Always accessible or highlighted when Manager mode is active) */}
        {isManagerMode && (
          <div className="mt-4 pt-3 border-t border-dashed border-slate-200 bg-amber-50/60 -mx-5 -mb-5 p-3 rounded-b-2xl">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-2">
              <span>Gestão Rápida de Estoque:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-200">
                {product.stock} un.
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              <button
                onClick={() => onAlterStock(product.id, 1)}
                className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium flex items-center justify-center gap-1 active:bg-slate-100"
                title="Aumentar estoque em 1 unidade"
              >
                <Plus className="w-3 h-3 text-emerald-600" />
                <span>+1 Estoque</span>
              </button>

              <button
                onClick={() => onAlterStock(product.id, -1)}
                disabled={product.stock <= 0}
                className="py-1.5 px-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg font-medium flex items-center justify-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Dar baixa manual de 1 unidade"
              >
                <Minus className="w-3 h-3 text-rose-600" />
                <span>-1 Baixa</span>
              </button>

              <button
                onClick={() => onDirectOrderLock(product)}
                className="py-1.5 px-2 bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 rounded-lg font-bold flex items-center justify-center text-[11px]"
                title="Zerar estoque agora e trancar venda"
              >
                <span>Zerar/Vendido</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
