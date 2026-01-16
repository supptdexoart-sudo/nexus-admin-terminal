
import React, { useState } from 'react';
import type { GameEvent } from '../../types';
import { Layers, Plus, Trash2, Search, AlertCircle } from 'lucide-react';

interface VariantPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
    masterCatalog: GameEvent[];
}

const VariantPanel: React.FC<VariantPanelProps> = ({ event, onUpdate, masterCatalog }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const currentVariants = event.variantIds || [];

    const handleAddVariant = (variantId: string) => {
        if (currentVariants.includes(variantId)) return;
        if (variantId === event.id) return;
        if (currentVariants.length >= 2) return; // Limit to 3 total (1 master + 2 variants)

        onUpdate({ variantIds: [...currentVariants, variantId] });
        setShowSearch(false);
        setSearchTerm('');
    };

    const handleRemoveVariant = (variantId: string) => {
        onUpdate({ variantIds: currentVariants.filter(id => id !== variantId) });
    };

    const filteredOptions = masterCatalog.filter(item =>
        item.id !== event.id &&
        !currentVariants.includes(item.id) &&
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 50);

    return (
        <div className="admin-card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <Layers className="text-primary w-4 h-4" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Rotace Karet (1 ze 3)</h3>
                </div>
                <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full">
                    {1 + currentVariants.length}/3 AKTIVNÍ
                </span>
            </div>

            <p className="text-[10px] text-zinc-500 uppercase font-bold leading-relaxed">
                Přiřaďte k této kartě další 2 varianty. Při naskenování QR kódu této karty se náhodně vybere jedna z nich.
            </p>

            <div className="space-y-3">
                {currentVariants.map(vId => {
                    const variant = masterCatalog.find(m => m.id === vId);
                    return (
                        <div key={vId} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg group">
                            <div className="flex flex-col min-w-0">
                                <span className="text-[10px] font-mono text-primary font-bold">{vId}</span>
                                <span className="text-sm font-bold truncate text-white">{variant?.title || 'Neznámý Asset'}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveVariant(vId)}
                                className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}

                {currentVariants.length < 2 && (
                    <div className="relative">
                        {!showSearch ? (
                            <button
                                onClick={() => setShowSearch(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-white/10 text-zinc-500 hover:border-primary/30 hover:text-primary transition-all rounded-lg text-[10px] font-black uppercase tracking-widest"
                            >
                                <Plus size={14} /> Přidat Variantu
                            </button>
                        ) : (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Hledat ID nebo Název..."
                                        className="admin-input pl-10 h-10 text-xs"
                                    />
                                </div>

                                <div className="bg-black/40 border border-white/5 rounded-lg overflow-hidden max-h-64 overflow-y-auto no-scrollbar">
                                    {filteredOptions.length > 0 ? filteredOptions.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleAddVariant(opt.id)}
                                            className="w-full text-left p-3 hover:bg-primary/10 transition-colors flex flex-col border-b border-white/5 last:border-0"
                                        >
                                            <span className="text-[9px] font-mono text-primary/60 font-bold">{opt.id}</span>
                                            <span className="text-xs font-bold text-white">{opt.title}</span>
                                        </button>
                                    )) : (
                                        <div className="p-4 text-center text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                            Žádné výsledky
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowSearch(false)}
                                    className="w-full text-center text-[9px] text-zinc-500 font-bold uppercase py-2 hover:text-white"
                                >
                                    Zrušit
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {currentVariants.length >= 2 && (
                <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertCircle className="text-amber-500 shrink-0" size={14} />
                    <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Dosáhli jste maximálního počtu 3 karet.</p>
                </div>
            )}
        </div>
    );
};

export default VariantPanel;
