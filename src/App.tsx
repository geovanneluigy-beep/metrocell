import React, { useState, useEffect, useMemo } from 'react';
import { Product, StoreSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './data/initialData';
import { filterProducts, decreaseStock, increaseStock, updateProductStock, generateWhatsAppBuyUrl } from './utils/storeLogic';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductGrid } from './components/ProductGrid';
import { RepairCalculator } from './components/RepairCalculator';
import { TrustSection } from './components/TrustSection';
import { BuyModal } from './components/BuyModal';
import { AdminPanel } from './components/AdminPanel';
import { WhatsAppSettingsModal } from './components/WhatsAppSettingsModal';
import { Footer } from './components/Footer';

export default function App() {
  // Load products with localStorage persistence
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('smartfix_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Load store settings with localStorage persistence
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('smartfix_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem('smartfix_products', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('smartfix_settings', JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  // Filtering & Sorting State
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'model'>('price-asc');

  // Modals & Manager Mode
  const [isManagerMode, setIsManagerMode] = useState(false);
  const [buyModalProduct, setBuyModalProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return filterProducts(products, {
      brand: selectedBrand,
      search: searchQuery,
      inStockOnly,
      sortBy,
    });
  }, [products, selectedBrand, searchQuery, inStockOnly, sortBy]);

  // Total products in stock
  const inStockCount = useMemo(() => {
    return products.filter((p) => p.stock > 0).length;
  }, [products]);

  // Product Actions
  const handleBuy = (product: Product) => {
    setBuyModalProduct(product);
  };

  const handleConfirmSaleAndDeduct = (product: Product) => {
    const updated = products.map((p) => {
      if (p.id === product.id) {
        return decreaseStock(p, 1);
      }
      return p;
    });
    setProducts(updated);

    const remaining = Math.max(0, product.stock - 1);
    if (remaining === 0) {
      showToast(`🔒 Venda registrada! O ${product.model} esgotou e agora está bloqueado no site.`);
    } else {
      showToast(`✓ Venda registrada! Restam ${remaining} unidade(s) do ${product.model}.`);
    }
  };

  const handleAlterStock = (id: string, delta: number) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (delta > 0) {
      const updated = products.map((p) => (p.id === id ? increaseStock(p, delta) : p));
      setProducts(updated);
      showToast(`+1 unidade adicionada ao ${item.model}`);
    } else {
      const updated = products.map((p) => (p.id === id ? decreaseStock(p, Math.abs(delta)) : p));
      setProducts(updated);
      const remaining = Math.max(0, item.stock - 1);
      if (remaining === 0) {
        showToast(`🔒 ${item.model} agora está com estoque zerado e venda trancada!`);
      } else {
        showToast(`Baixa de 1 unidade realizada no ${item.model}. Restam ${remaining}.`);
      }
    }
  };

  const handleDirectOrderLock = (product: Product) => {
    const updated = updateProductStock(products, product.id, 0);
    setProducts(updated);
    showToast(`🔒 Estoque do ${product.model} foi zerado e a venda está trancada!`);
  };

  const handleAddNewProduct = (newProductData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProductData,
      id: `prod-${Date.now()}`,
    };
    setProducts([newProduct, ...products]);
    showToast(`✓ ${newProduct.model} cadastrado com sucesso com estoque (${newProduct.stock} un.)!`);
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts(updateProductStock(products, id, newStock));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast('Aparelho removido do catálogo.');
  };

  const handleResetDefault = () => {
    if (confirm('Deseja restaurar o catálogo para os modelos originais de demonstração?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('Catálogo restaurado para o padrão.');
    }
  };

  const handleCustomInquiry = (product: Product) => {
    const cleanNum = settings.whatsappNumber.replace(/\D/g, '');
    const message = `Olá! Vi no site que o *${product.model}* está esgotado. Vocês conseguem encomendar ou têm previsão de chegada de outro igual?`;
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <Header
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenSettings={() => setIsWhatsAppModalOpen(true)}
        stockCount={inStockCount}
      />

      {/* Hero Section */}
      <main className="flex-1">
        <Hero
          settings={settings}
          onOpenAdmin={() => setIsAdminOpen(true)}
          availableCount={inStockCount}
        />

        {/* Product Catalog with Stock Lock System */}
        <ProductGrid
          products={products}
          filteredProducts={filteredProducts}
          selectedBrand={selectedBrand}
          onSelectBrand={setSelectedBrand}
          inStockOnly={inStockOnly}
          onToggleInStockOnly={setInStockOnly}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onBuy={handleBuy}
          onAlterStock={handleAlterStock}
          onDirectOrderLock={handleDirectOrderLock}
          isManagerMode={isManagerMode}
          onToggleManagerMode={() => setIsManagerMode(!isManagerMode)}
          onOpenAddNew={() => setIsAdminOpen(true)}
          onCustomInquiry={handleCustomInquiry}
        />

        {/* Trust & Guarantee Section */}
        <TrustSection />

        {/* Repair & Diagnostics Quote Calculator */}
        <RepairCalculator settings={settings} />
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenSettings={() => setIsWhatsAppModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Buy WhatsApp Confirmation Modal */}
      <BuyModal
        product={buyModalProduct}
        settings={settings}
        onClose={() => setBuyModalProduct(null)}
        onConfirmSaleAndDeduct={handleConfirmSaleAndDeduct}
      />

      {/* Admin / Inventory Management Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onAddProduct={handleAddNewProduct}
        onUpdateStock={handleUpdateStock}
        onDeleteProduct={handleDeleteProduct}
        onResetDefault={handleResetDefault}
        settings={settings}
        onUpdateSettings={setSettings}
      />

      {/* Quick WhatsApp Configuration Modal */}
      <WhatsAppSettingsModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slideUp flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
