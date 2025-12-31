import React, { useState, useEffect } from 'react';
import type { GameEvent } from '../../types';
import { ShoppingBag, Coins, Trash2, Percent, Plus, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as apiService from '../../services/apiService';

interface MerchantPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const MerchantPanel: React.FC<MerchantPanelProps> = ({ event, onUpdate }) => {
    // Local state for adding items
    const [merchantItemId, setMerchantItemId] = useState('');
    const [merchantItemStock, setMerchantItemStock] = useState(1);
    const [merchantItemPrice, setMerchantItemPrice] = useState(0);
    const [merchantItemSellPrice, setMerchantItemSellPrice] = useState(0);
    const [merchantItemSaleChance, setMerchantItemSaleChance] = useState(0);
    const [characters, setCharacters] = useState<any[]>([]);

    // Load characters from API
    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const adminEmail = localStorage.getItem('admin_email');
                console.log('[MerchantPanel] Admin email:', adminEmail);
                if (adminEmail) {
                    const chars = await apiService.getCharacters(adminEmail);
                    console.log('[MerchantPanel] Loaded characters:', chars);
                    setCharacters(chars);
                } else {
                    console.warn('[MerchantPanel] No admin email found in localStorage');
                }
            } catch (e) {
                console.error('[MerchantPanel] Failed to load characters:', e);
            }
        };
        loadCharacters();
    }, []);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ canSellToMerchant: e.target.checked });
    };

    const updateTradeConfig = (characterId: string, value: number) => {
        const currentConfig = event.tradeConfig || {};
        onUpdate({
            tradeConfig: {
                ...currentConfig,
                [characterId]: value
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
            saleChance: merchantItemSaleChance
        };
        onUpdate({
            merchantItems: [...(event.merchantItems || []), newItem]
        });
        // Reset local inputs
        setMerchantItemId('');
        setMerchantItemStock(1);
        setMerchantItemPrice(0);
        setMerchantItemSellPrice(0);
        setMerchantItemSaleChance(0);
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
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <label className="admin-label m-0 flex items-center gap-2">
                                <Coins size={14} className="text-yellow-500" /> Povolit prodej hráčů
                            </label>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Hráči mohou prodávat předměty tomuto NPC</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={event.canSellToMerchant ?? false}
                                onChange={handleCheckboxChange}
                            />
                            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>

                    <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-4">
                        <label className="admin-label text-yellow-500/80 flex items-center gap-2 m-0 mt-2">
                            <Tag size={12} /> Afinity a Bonusy podle postav
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            {characters.map((char) => (
                                <div key={char.id} className="space-y-1">
                                    <span className="text-[8px] font-black text-zinc-500 uppercase flex items-center gap-1">
                                        {char.name}
                                    </span>
                                    <input
                                        type="number"
                                        value={event.tradeConfig?.[char.id] ?? 0}
                                        onChange={(e) => updateTradeConfig(char.id, parseInt(e.target.value))}
                                        className="admin-input py-2 text-xs font-mono text-center"
                                        placeholder="Sleva %"
                                    />
                                </div>
                            ))}
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

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                    <div className="md:col-span-2 space-y-2">
                        <label className="admin-label text-[10px] opacity-60">ID Předmětu / Referenční Kód</label>
                        <input
                            type="text"
                            value={merchantItemId}
                            onChange={(e) => setMerchantItemId(e.target.value)}
                            className="admin-input py-3 text-xs uppercase"
                            placeholder="NAPŘ. ITEM-001"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="admin-label text-[10px] opacity-60">Sklad</label>
                        <input
                            type="number"
                            value={merchantItemStock}
                            onChange={(e) => setMerchantItemStock(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="admin-label text-[10px] opacity-60 text-yellow-500">Nákup</label>
                        <input
                            type="number"
                            value={merchantItemPrice}
                            onChange={(e) => setMerchantItemPrice(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono border-yellow-500/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="admin-label text-[10px] opacity-60 text-green-500">Prodej</label>
                        <input
                            type="number"
                            value={merchantItemSellPrice}
                            onChange={(e) => setMerchantItemSellPrice(parseInt(e.target.value))}
                            className="admin-input py-3 text-xs text-center font-mono border-green-500/20"
                        />
                    </div>
                    <div className="flex items-end">
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
                                    <span className="text-xs font-black text-white uppercase block">{item.id}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-zinc-500">STOCK: <span className="text-white">{item.stock}</span></span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <span className="text-[10px] font-mono text-yellow-500/80">BUY: <span className="text-yellow-500 font-black">{item.price || 0} G</span></span>
                                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                        <span className="text-[10px] font-mono text-green-500/80">SELL: <span className="text-green-500 font-black">{item.sellPrice || 0} G</span></span>
                                        {item.saleChance && item.saleChance > 0 && (
                                            <>
                                                <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                                                <span className="text-[10px] font-mono text-pink-500 font-black flex items-center gap-1 uppercase">
                                                    <Percent size={10} /> {item.saleChance}% SLEVA
                                                </span>
                                            </>
                                        )}
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
