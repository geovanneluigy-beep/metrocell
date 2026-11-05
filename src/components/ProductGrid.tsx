import React from 'react';
import { Search, SlidersHorizontal, Package, PlusCircle, Check } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  filteredProducts: Product[];
  selectedBrand: string;
  onSelectBrand: (brand: string) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: (val: boolean) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'price-asc' | 'price-desc' | 'model';
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'model') => void;
  onBuy: (product: Product) => void;
  onAlterStock: (id: string, delta: number) => void;
  onDirectOrderLock: (product: Product) => void;
  isManagerMode: boolean;
  onToggleManagerMode: () => void;
  onOpenAddNew: () => void;
  onCustomInquiry: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  filteredProducts,
  selectedBrand,
  onSelectBrand,
  inStockOnly,
  onToggleInStockOnly,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onBuy,
  onAlterStock,
  onDirectOrderLock,
  isManagerMode,
  onToggleManagerMode,
  onOpenAddNew,
  onCustomInquiry,
}) => {
  const brands = ['Todas', 'Samsung', 'Apple', 'Motorola', 'Xiaomi'];
  const totalInStock = products.filter((p) => p.stock > 0).length;

  return (
    <section id="catalogo" className="py-12 sm:py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-semibold tracking-wider text-blue-600 uppercase mb-1">
              Catálogo Atualizado
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aparelhos em Estoque
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {totalInStock} celulares disponíveis para pronta entrega hoje · Testados e com garantia de 90 dias
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleManagerMode}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
                isManagerMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
              title="Ativa botões de alterar estoque direto nos cards"
            >
              <Package className="w-3.5 h-3.5" />
              <span>{isManagerMode ? 'Modo Gerente: Ativado' : 'Ativar Modo Gerente'}</span>
            </button>

            <button
              onClick={onOpenAddNew}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Cadastrar Celular</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar modelo (ex: A10s, iPhone 11, 128GB)..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* In-Stock Filter Toggle */}
            <div className="md:col-span-4 flex items-center gap-2">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => onToggleInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <span>Ocultar modelos esgotados / vendidos</span>
              </label>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3 flex items-center justify-end gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="w-full py-2 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
              >
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="model">Nome do Modelo (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Brand Tabs (Segmented Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold mr-2 shrink-0">Marca:</span>
            {brands.map((brand) => {
              const active = selectedBrand === brand;
              return (
                <button
                  key={brand}
                  onClick={() => onSelectBrand(brand)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6 px-1">
          <span>
            Mostrando <strong className="text-slate-800 tabular-nums">{filteredProducts.length}</strong> de {products.length} aparelhos
          </span>
          {inStockOnly && (
            <span className="text-blue-600 font-medium">Filtro de apenas aparelhos disponíveis ativado</span>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuy={onBuy}
                onAlterStock={onAlterStock}
                onDirectOrderLock={onDirectOrderLock}
                isManagerMode={isManagerMode}
                onCustomInquiry={onCustomInquiry}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">Nenhum aparelho encontrado</h3>
            <p className="text-xs text-slate-500 mb-4">
              Tente alterar os termos da busca ou desativar o filtro de produtos esgotados.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  onSelectBrand('Todas');
                  onSearchChange('');
                  onToggleInStockOnly(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                Limpar Todos os Filtros
              </button>
              <button
                onClick={onOpenAddNew}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                + Cadastrar Novo Aparelho
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
