import React, { useState } from 'react';
import { X, Phone, Check } from 'lucide-react';
import { StoreSettings } from '../types';

interface WhatsAppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onSaveSettings: (settings: StoreSettings) => void;
}

export const WhatsAppSettingsModal: React.FC<WhatsAppSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [number, setNumber] = useState(settings.whatsappNumber);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      whatsappNumber: number.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Número de WhatsApp da Sua Loja
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Informe o número de WhatsApp onde você receberá as mensagens de compra dos celulares e os pedidos de orçamento de conserto.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              WhatsApp com DDI e DDD (ex: 5511999999999):
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="5511999999999"
              className="w-full px-3 py-2 text-sm font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
              required
            />
            <span className="text-[11px] text-slate-400 block mt-1">
              Dica: 55 (Brasil) + seu DDD (ex: 11, 21, 31, 41) + 9 dígitos
            </span>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Salvo com sucesso!</span>
                </>
              ) : (
                <span>Atualizar WhatsApp</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
