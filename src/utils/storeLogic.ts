import { Product, RepairQuoteRequest } from '../types';

export function isOutOfStock(product: Product): boolean {
  return product.stock <= 0;
}

export function decreaseStock(product: Product, quantity = 1): Product {
  const newStock = Math.max(0, product.stock - quantity);
  return {
    ...product,
    stock: newStock,
  };
}

export function increaseStock(product: Product, quantity = 1): Product {
  return {
    ...product,
    stock: product.stock + quantity,
  };
}

export function updateProductStock(products: Product[], id: string, newStock: number): Product[] {
  const validStock = Math.max(0, Math.floor(newStock));
  return products.map((p) => (p.id === id ? { ...p, stock: validStock } : p));
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function cleanPhone(phone: string): string {
  // Strip non-digits
  return phone.replace(/\D/g, '');
}

export function generateWhatsAppBuyUrl(
  whatsappNumber: string,
  product: Product,
  clientNote?: string
): string {
  const cleanNum = cleanPhone(whatsappNumber);
  const priceFormatted = formatBRL(product.price);
  const statusStock = product.stock > 0 ? `Estoque disponível: ${product.stock} un.` : '⚠️ VENDIDO / INDISPONÍVEL';

  let message = `Olá! Vi o anúncio no site e tenho interesse no aparelho:\n\n`;
  message += `📱 *Modelo:* ${product.model}\n`;
  message += `💰 *Valor:* ${priceFormatted}\n`;
  message += `🏷️ *Condição:* ${product.condition} (${product.storage} - ${product.color})\n`;
  if (product.batteryHealth) {
    message += `🔋 *Saúde da Bateria:* ${product.batteryHealth}%\n`;
  }
  message += `🛡️ *Garantia:* ${product.warranty}\n`;
  message += `📦 *Situação:* ${statusStock}\n`;

  if (clientNote) {
    message += `\n💬 *Dúvida/Comentário:* ${clientNote}\n`;
  }

  message += `\nO aparelho ainda está disponível para negociar ou retirar?`;

  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppRepairUrl(
  whatsappNumber: string,
  req: RepairQuoteRequest,
  estimatedPriceText?: string
): string {
  const cleanNum = cleanPhone(whatsappNumber);

  let message = `Olá! Gostaria de solicitar um *Orçamento de Conserto / Manutenção*:\n\n`;
  if (req.customerName) {
    message += `👤 *Nome:* ${req.customerName}\n`;
  }
  message += `📱 *Aparelho:* ${req.brand} ${req.model}\n`;
  message += `🔧 *Problema Relatado:* ${req.problem}\n`;
  message += `📍 *Forma de Atendimento:* ${req.serviceType === 'motoboy' ? 'Buscar e Levar (Motoboy / Delivery)' : 'Vou levar na Loja'}\n`;
  
  if (req.additionalDetails) {
    message += `📝 *Observações:* ${req.additionalDetails}\n`;
  }

  if (estimatedPriceText) {
    message += `💵 *Faixa Estimada pelo Site:* ${estimatedPriceText}\n`;
  }

  message += `\nVocês têm essa peça pronta entrega e qual o prazo para conserto?`;

  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(message)}`;
}

export interface FilterOptions {
  brand?: string;
  search?: string;
  inStockOnly?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'model' | 'recent';
}

export function filterProducts(products: Product[], options: FilterOptions): Product[] {
  let list = [...products];

  if (options.brand && options.brand !== 'Todas') {
    list = list.filter((p) => p.brand.toLowerCase() === options.brand!.toLowerCase());
  }

  if (options.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }

  if (options.search && options.search.trim() !== '') {
    const q = options.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.model.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.storage.toLowerCase().includes(q) ||
        p.color.toLowerCase().includes(q)
    );
  }

  if (options.sortBy === 'price-asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (options.sortBy === 'price-desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (options.sortBy === 'model') {
    list.sort((a, b) => a.model.localeCompare(b.model));
  }

  return list;
}

export function getRepairEstimate(problem: string): { range: string; time: string } {
  const p = problem.toLowerCase();

  if (p.includes('tela') || p.includes('vidro') || p.includes('display')) {
    return { range: 'R$ 130,00 a R$ 380,00 (conforme qualidade original/incell)', time: '40 a 90 minutos' };
  }
  if (p.includes('bateria') || p.includes('descarrega')) {
    return { range: 'R$ 90,00 a R$ 220,00 (bateria nova com garantia)', time: '30 a 60 minutos' };
  }
  if (p.includes('conector') || p.includes('carrega') || p.includes('carga')) {
    return { range: 'R$ 70,00 a R$ 150,00', time: '40 minutos' };
  }
  if (p.includes('água') || p.includes('molhou') || p.includes('oxidação')) {
    return { range: 'A partir de R$ 90,00 (banho químico desoxidação)', time: '2 a 4 horas de teste' };
  }
  if (p.includes('câmera') || p.includes('lente')) {
    return { range: 'R$ 80,00 a R$ 260,00', time: '1 a 2 horas' };
  }
  if (p.includes('liga') || p.includes('placa')) {
    return { range: 'Sob análise de bancada (diagnóstico gratuito)', time: 'Avaliação em até 24h' };
  }

  return { range: 'Orçamento personalizado sob análise', time: 'Consulte no balcão' };
}
