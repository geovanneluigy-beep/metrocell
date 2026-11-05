import React, { useState } from 'react';
import { X, Plus, Trash2, Package, Sparkles, Check, RefreshCw, AlertTriangle, Phone } from 'lucide-react';
import { Product, StoreSettings, PhoneBrand, PhoneCondition } from '../types';
import { formatBRL } from '../utils/storeLogic';
import { POPULAR_MODELS_PRESETS } from '../data/initialData';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateStock: (id: string, newStock: number) => void;
  onDeleteProduct: (id: string) => void;
  onResetDefault: () => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  products,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct,
  onResetDefault,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'estoque' | 'cadastrar' | 'loja'>('estoque');

  // Form states
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState<PhoneBrand>('Samsung');
  const [condition, setCondition] = useState<PhoneCondition>('Seminovo Revisado');
  const [storage, setStorage] = useState('32GB');
  const [color, setColor] = useState('Azul');
  const [price, setPrice] = useState('420');
  const [stock, setStock] = useState('1');
  const [warranty, setWarranty] = useState('90 dias de garantia');
  const [batteryHealth, setBatteryHealth] = useState('');
  const [image, setImage] = useState('/src/assets/images/product_samsung_a10s_1793920766814.jpg');

  // Store settings form
  const [tempWhatsapp, setTempWhatsapp] = useState(settings.whatsappNumber);
  const [tempStoreName, setTempStoreName] = useState(settings.storeName);
  const [tempAddress, setTempAddress] = useState(settings.storeAddress);
  const [tempPix, setTempPix] = useState(settings.pixKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof POPULAR_MODELS_PRESETS[0]) => {
    setModel(preset.model);
    setBrand(preset.brand as PhoneBrand);
    setPrice(preset.price.toString());
    setStorage(preset.storage);
    setColor(preset.color);
    setStock('1');

    if (preset.brand === 'Apple') {
      setImage('/src/assets/images/product_iphone_clean_1793920767686.jpg');
      setBatteryHealth('88');
    } else if (preset.brand === 'Motorola') {
      setImage('/src/assets/images/product_motorola_clean_1793920767921.jpg');
      setBatteryHealth('');
    } else {
      setImage('/src/assets/images/product_samsung_a10s_1793920766814.jpg');
      setBatteryHealth('');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim() || !price) {
      alert('Informe ao menos o Modelo e o Preço!');
      return;
    }

    const numPrice = parseFloat(price.replace(',', '.')) || 0;
    const numStock = parseInt(stock, 10) >= 0 ? parseInt(stock, 10) : 1;
    const numBattery = batteryHealth ? parseInt(batteryHealth, 10) : undefined;

    onAddProduct({
      model: model.trim(),
      brand,
      condition,
      storage,
      color,
      price: numPrice,
      stock: numStock,
      image: image || '/src/assets/images/product_samsung_a10s_1793920766814.jpg',
      warranty,
      batteryHealth: numBattery,
      itemsIncluded: ['Carregador', 'Cabo', 'Película de Vidro instalada'],
    });

    // Reset form and go to inventory tab
    setModel('');
    setPrice('420');
    setStock('1');
    setActiveTab('estoque');
  };

  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      whatsappNumber: tempWhatsapp.trim(),
      storeName: tempStoreName.trim(),
      storeAddress: tempAddress.trim(),
      pixKey: tempPix.trim(),
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              ⚙️
            </span>
            <div>
              <h3 id="admin-title" className="text-base font-bold text-white">
                Painel do Administrador (Estoque & Loja)
              </h3>
              <p className="text-xs text-slate-300">
                Gerencie aparelhos, adicione o A10s e configure seu WhatsApp de atendimento
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Fechar painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('estoque')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'estoque'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📦 Gerenciar Estoque ({products.length} itens)
          </button>

          <button
            onClick={() => setActiveTab('cadastrar')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'cadastrar'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ➕ Cadastrar Novo Celular
          </button>

          <button
            onClick={() => setActiveTab('loja')}
            className={`py-2 px-3 border-b-2 transition-colors ${
              activeTab === 'loja'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📱 Configurar WhatsApp & Loja
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {/* TAB 1: GERENCIAR ESTOQUE */}
          {activeTab === 'estoque' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
                <span>
                  Altere as quantidades abaixo. Quando o estoque for <strong>0</strong>, o botão no site tranca automaticamente.
                </span>
                <button
                  onClick={onResetDefault}
                  className="text-xs text-rose-600 hover:underline flex items-center gap-1"
                  title="Restaura os celulares iniciais de exemplo"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restaurar Padrão</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {products.map((item) => {
                  const out = item.stock <= 0;
                  return (
                    <div
                      key={item.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.model}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 border"
                        />
                        <div>
                          <div className="text-xs font-semibold text-slate-900 flex items-center gap-2">
                            <span>{item.model}</span>
                            {out ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                ESGOTADO
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                                {item.stock} un.
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {formatBRL(item.price)} · {item.condition} · {item.storage}
                          </div>
                        </div>
                      </div>

                      {/* Stock Controls */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                          <button
                            onClick={() => onUpdateStock(item.id, Math.max(0, item.stock - 1))}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                            title="Diminuir 1 un. / Vender"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={item.stock}
                            onChange={(e) => onUpdateStock(item.id, parseInt(e.target.value, 10) || 0)}
                            className="w-12 text-center text-xs font-mono font-bold bg-white py-1 focus:outline-none"
                          />
                          <button
                            onClick={() => onUpdateStock(item.id, item.stock + 1)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 active:bg-slate-300 font-bold"
                            title="Aumentar estoque"
                          >
                            +
                          </button>
                        </div>

                        {/* Quick zero out button */}
                        <button
                          onClick={() => onUpdateStock(item.id, 0)}
                          className="px-2.5 py-1 text-[11px] font-medium text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg"
                          title="Trancar venda / Zerar estoque"
                        >
                          Zerar
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => {
                            if (confirm(`Remover "${item.model}" do catálogo?`)) {
                              onDeleteProduct(item.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: CADASTRAR NOVO CELULAR */}
          {activeTab === 'cadastrar' && (
            <div className="space-y-6">
              {/* 1-Click Fast Presets */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Modelos Populares (Preenchimento Rápido com 1 Clique):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_MODELS_PRESETS.map((pre) => (
                    <button
                      type="button"
                      key={pre.model}
                      onClick={() => handleApplyPreset(pre)}
                      className="text-xs px-2.5 py-1 bg-white hover:bg-blue-600 hover:text-white text-blue-800 rounded-lg border border-blue-200 transition-colors font-medium"
                    >
                      {pre.model} (R$ {pre.price})
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Modelo do Aparelho *
                    </label>
                    <input
                      type="text"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: Samsung Galaxy A10s 32GB"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Marca
                    </label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value as PhoneBrand)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="Samsung">Samsung</option>
                      <option value="Apple">Apple (iPhone)</option>
                      <option value="Motorola">Motorola</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preço de Venda (R$) *
                    </label>
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 420.00"
                      className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estoque Inicial (unidades) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="1"
                      className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Condição
                    </label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as PhoneCondition)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="Seminovo Revisado">Seminovo Revisado</option>
                      <option value="Seminovo Impecável">Seminovo Impecável</option>
                      <option value="Novo Lacrado">Novo Lacrado</option>
                      <option value="Seminovo com Marcas">Seminovo com Marcas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Armazenamento
                    </label>
                    <input
                      type="text"
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      placeholder="Ex: 32GB, 64GB, 128GB"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cor
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Ex: Azul, Preto, Dourado"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Saúde Bateria % (opcional)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={batteryHealth}
                      onChange={(e) => setBatteryHealth(e.target.value)}
                      placeholder="Ex: 88"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Garantia Oferecida
                  </label>
                  <input
                    type="text"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    placeholder="Ex: 90 dias de garantia da loja"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Foto do Celular (Escolha uma foto da galeria ou cole link):
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    {[
                      { name: 'Samsung A10s / Galaxy', path: '/src/assets/images/product_samsung_a10s_1793920766814.jpg' },
                      { name: 'Apple iPhone', path: '/src/assets/images/product_iphone_clean_1793920767686.jpg' },
                      { name: 'Motorola Moto G', path: '/src/assets/images/product_motorola_clean_1793920767921.jpg' },
                    ].map((img) => (
                      <button
                        type="button"
                        key={img.path}
                        onClick={() => setImage(img.path)}
                        className={`p-1.5 rounded-lg border text-left flex items-center gap-2 ${
                          image === img.path ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-slate-200'
                        }`}
                      >
                        <img src={img.path} alt={img.name} className="w-8 h-8 rounded object-cover" />
                        <span className="text-[11px] font-medium text-slate-700 truncate">{img.name}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="URL ou caminho da foto"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Aparelho no Estoque</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: CONFIGURAÇÕES DA LOJA & WHATSAPP */}
          {activeTab === 'loja' && (
            <form onSubmit={handleSaveStoreSettings} className="space-y-5">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">Seu Número de WhatsApp para Vendas & Orçamentos</h4>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Quando o cliente clicar em "Comprar via WhatsApp" ou "Pedir Orçamento de Conserto", ele falará diretamente com este número.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de WhatsApp (com DDD, ex: 5511999999999) *
                </label>
                <input
                  type="text"
                  value={tempWhatsapp}
                  onChange={(e) => setTempWhatsapp(e.target.value)}
                  placeholder="5511999999999"
                  className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Coloque código do país (55) + DDD (ex: 11) + número com 9 dígitos.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nome da Sua Loja / Assistência
                </label>
                <input
                  type="text"
                  value={tempStoreName}
                  onChange={(e) => setTempStoreName(e.target.value)}
                  placeholder="SmartFix Celulares & Assistência"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Endereço da Loja Física (para os clientes levarem os aparelhos)
                </label>
                <input
                  type="text"
                  value={tempAddress}
                  onChange={(e) => setTempAddress(e.target.value)}
                  placeholder="Rua do Comércio, 120 - Centro"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chave PIX da Loja (opcional, para receber pagamentos rápidos)
                </label>
                <input
                  type="text"
                  value={tempPix}
                  onChange={(e) => setTempPix(e.target.value)}
                  placeholder="seu.email@pix.com.br ou CNPJ / Chave Aleatória"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar Dados da Loja</span>
                </button>

                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    ✓ Configurações salvas com sucesso!
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
