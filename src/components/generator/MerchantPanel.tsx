import React, { useState } from 'react';
import type { GameEvent, CharacterMerchantBonus } from '../../types';
import { ShoppingBag, Trash2, Percent, Plus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MerchantPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
    characters?: any[];
    masterCatalog?: GameEvent[];
}

const MerchantPanel: React.FC<MerchantPanelProps> = ({ event, onUpdate, characters = [], masterCatalog = [] }) => {
    // Local state for adding items
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [merchantItemId, setMerchantItemId] = useState('');
    const [merchantItemStock, setMerchantItemStock] = useState(1);
    const [merchantItemPrice, setMerchantItemPrice] = useState(0);
    const [merchantItemSellPrice, setMerchantItemSellPrice] = useState(0);
    const [merchantItemSaleChance, setMerchantItemSaleChance] = useState(0);
    const [merchantItemAllowBuy, setMerchantItemAllowBuy] = useState(true);

    const filteredCatalog = masterCatalog.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectItemFromCatalog = (item: GameEvent) => {
        setMerchantItemId(item.id);
        setSearchTerm(item.title);
        setMerchantItemPrice(item.price || 0);
        setMerchantItemSellPrice(item.price || 0); // Automatically set sell price to match
        setShowDropdown(false);
    };



    const updateTradeConfig = (characterId: string, field: keyof CharacterMerchantBonus, value: number | string) => {
        const currentConfig = event.tradeConfig || {};
        const currentCharConfig = currentConfig[characterId] || {
            buyDiscount: 0,
            sellBonus: 0,
            stealChance: 0,
            specialAbility: ''
        };

        onUpdate({
            tradeConfig: {
                ...currentConfig,
                [characterId]: {
                    ...currentCharConfig,
                    [field]: value
                }
            }
        });
    };

    const addMerchantItem = () => {
        if (!merchantItemId) return;
        const newItem = {
            id: merchantItemId,
            stock: merchantItemStock,
            price: merchantItemPrice,
            sellPrice: merchantItemSellPrice,
            saleChance: merchantItemSaleChance,
            allowBuy: merchantItemAllowBuy
        };
        onUpdate({
            merchantItems: [...(event.merchantItems || []), newItem]
        });
        // Reset local inputs
        setMerchantItemId('');
        setSearchTerm('');
        setMerchantItemStock(1);
        setMerchantItemPrice(0);
        setMerchantItemSellPrice(0);
        setMerchantItemSaleChance(0);
        setMerchantItemAllowBuy(true);
    };

    const removeMerchantItem = (index: number) => {
        onUpdate({
            merchantItems: (event.merchantItems || []).filter((_, i) => i !== index)
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-500">
                    <ShoppingBag size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Zásoby Obchodníka</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Management inventáře a tržních podmínek</p>
                </div>
            </div>

            {/* MERCHANT SETTINGS & CLASS BONUSES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="admin-card p-6 bg-black/40 space-y-6">

                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-4">
                        <label className="admin-label text-yellow-500/80 flex items-center gap-2 m-0 mt-2">
                            <Tag size={12} /> Bonusy a schopnosti podle postav
                        </label>
                        <div className="space-y-6">
                            {characters.map((char) => {
                                const charConfig = event.tradeConfig?.[char.characterId] || {
                                    buyDiscount: 0,
                                    stealChance: 0
                                };

                                return (
                                    <div key={char.characterId} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3">
                                        <div className="text-xs font-black text-white uppercase border-b border-white/5 pb-2">
                                            {char.name}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-green-500 uppercase block">
                                                    💰 Nákupní sleva %
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={charConfig.buyDiscount}
                                                    onChange={(e) => updateTradeConfig(char.characterId, 'buyDiscount', parseInt(e.target.value) || 0)}
                                                    className="admin-input py-2 text-xs font-mono text-center border-green-500/20"
                                                    placeholder="0"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <span className="text-[8px] font-black text-red-500 uppercase block">
                                                    🎲 Šance na krádež %
                                                </span>
                                                <input
                                                    type="number"
                                                    min="0" max="100"
                                                    value={charConfig.stealChance}
                                                    onChange={(e) => updateTradeConfig(char.characterId, 'stealChance', parseInt(e.target.value) || 0)}
                                                    className="admin-input py-2 text-xs font-mono text-center border-red-500/20"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {characters.length === 0 && (
                            <div className="text-center py-4 text-[10px] text-zinc-600 uppercase">
                                Žádné postavy k dispozici. Vytvořte postavy v sekci "Tvorba postav".
                            </div>
                        )}
                    </div>
                </div>


            </div>

            {/* ADD ITEM MODULE */}
            <div className="admin-card p-6 bg-black/40 space-y-6">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
                    <Plus size={16} className="text-primary" />
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Injektovat nový předmět do zásob</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-4 space-y-2 relative">
                        <label className="admin-label text-[10px] opacity-60">Výběr karty dle Katalogu</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                className="admin-input py-3 text-xs pr-10"
                                placeholder="VYHLEDEJTE KARTU..."
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                                <Tag size={14} />
                            </div>
                        </div>

                        {/* Searchable Dropdown */}
                        <AnimatePresence>
                            {showDropdown && searchTerm && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute left-0 right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto no-scrollbar"
                                >
                                    {filteredCatalog.length > 0 ? (
                                        filteredCatalog.map(item => (
                                            <div
                                                key={item.id}
                                                onClick={() => selectItemFromCatalog(item)}
                                                className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex justify-between items-center group"
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-white uppercase">{item.title}</span>
                                                    <span className="text-[8px] font-mono text-zinc-500">{item.id}</span>
                                                    <span className="text-[8px] text-yellow-500 font-bold">BASE: {item.price || 0} G</span>
                                                </div>
                                                <span className="text-[10px] font-black text-primary opacity-0 group-hover:opacity-100 transition-opacity">ZVOLIT</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-[10px] text-zinc-600 uppercase font-bold">
                                            Žádná shoda nenalezena
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {showDropdown && (
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowDropdown(false)}
                            />
                        )}

                        <div className="text-[9px] font-bold text-zinc-500 uppercase mt-1 flex justify-between">
                            <span>ID: {merchantItemId || '---'}</span>
                            {merchantItemId && (
                                <button
                                    onClick={() => {
                                        setMerchantItemId('');
                                        setSearchTerm('');
                                    }}
                                    className="text-red-500 hover:text-red-400"
                                >
                                    VYČISTIT
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="md:col-span-1.5 space-y-2">
                        <label className="admin-label text-[10px] opacity-60">Sklad</label>
                        <input
                            type="number"
                            value={merchantItemStock}
                            onChange={(e) => setMerchantItemStock(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono"
                        />
                    </div>
                    <div className="md:col-span-1.5 space-y-2">
                        <label className="admin-label text-[10px] opacity-60 text-yellow-500">Nákup G</label>
                        <input
                            type="number"
                            value={merchantItemPrice}
                            onChange={(e) => setMerchantItemPrice(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono border-yellow-500/20"
                        />
                    </div>
                    <div className="md:col-span-1.5 space-y-2">
                        <label className="admin-label text-[10px] opacity-60 text-emerald-500">Výkup G</label>
                        <input
                            type="number"
                            value={merchantItemSellPrice}
                            onChange={(e) => setMerchantItemSellPrice(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono border-emerald-500/20"
                        />
                    </div>
                    <div className="md:col-span-1.5 space-y-2">
                        <label className="admin-label text-[10px] opacity-60 text-emerald-500">Stav</label>
                        <div
                            onClick={() => setMerchantItemAllowBuy(!merchantItemAllowBuy)}
                            className={`flex items-center justify-center h-[42px] border rounded-xl cursor-pointer transition-all ${merchantItemAllowBuy ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500' : 'bg-black/40 border-white/5 text-zinc-500'}`}
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest">{merchantItemAllowBuy ? 'VÝKUP' : 'NEVYKUPUJE'}</span>
                        </div>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button
                            type="button"
                            onClick={addMerchantItem}
                            className="admin-button-primary w-full py-3 h-[42px] flex items-center justify-center gap-2"
                        >
                            <Plus size={16} /> Přidat
                        </button>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex items-center gap-4 bg-pink-500/5 border border-pink-500/10 p-3 rounded-xl">
                        <Percent size={14} className="text-pink-500" />
                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest flex-1">Aplikovat automatickou slevu na tento slot?</span>
                        <input
                            type="number"
                            min="0" max="100"
                            value={merchantItemSaleChance}
                            onChange={(e) => setMerchantItemSaleChance(parseInt(e.target.value))}
                            className="w-16 bg-black/40 border-b border-pink-500 text-pink-500 font-mono text-center text-xs p-1 outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* ITEMS LIST */}
            <div className="space-y-3">
                <AnimatePresence>
                    {event.merchantItems?.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="admin-card p-4 bg-black/40 flex items-center justify-between group hover:border-primary/30 transition-all border-white/5"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-2 bg-white/5 rounded-xl group-hover:bg-primary/20 transition-all">
                                    <Tag size={16} className="text-zinc-500 group-hover:text-primary transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-white uppercase">{item.id}</span>
                                        {(() => {
                                            const catalogItem = masterCatalog.find(c => c.id === item.id);
                                            return catalogItem ? (
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase">— {catalogItem.title}</span>
                                            ) : null;
                                        })()}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-zinc-500">STOCK: <span className="text-white">{item.stock}</span></span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <span className="text-[10px] font-mono text-yellow-500/80">BUY: <span className="text-yellow-500 font-black">{item.price || 0} G</span></span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <span className="text-[10px] font-mono text-green-500/80">PRODAT ZA: <span className="text-green-500 font-black">{item.sellPrice || 0} G</span></span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${item.allowBuy !== false ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-zinc-800 text-zinc-600 border border-white/5'}`}>
                                            {item.allowBuy !== false ? 'VÝKUP' : 'NEVYKUPUJE'}
                                        </div>
                                        {item.saleChance ? (
                                            <>
                                                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                                <span className="text-[10px] font-mono text-pink-500 font-black flex items-center gap-1 uppercase">
                                                    <Percent size={10} /> {item.saleChance}% SLEVA
                                                </span>
                                            </>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeMerchantItem(idx)}
                                className="p-3 bg-black/40 border border-white/5 rounded-2xl text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all"
                            >
                                <Trash2 size={16} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {(!event.merchantItems || event.merchantItems.length === 0) && (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                        Aktuálně nejsou v nabídce žádné předměty
                    </div>
                )}
            </div>

        </div>
    );
};

export default MerchantPanel;
