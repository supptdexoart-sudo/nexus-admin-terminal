import React, { useState } from 'react';
import type { GameEvent, Stat } from '../../types';
import { Box, Heart, Shield, Coins, Wind, Trash2, Fuel, Plus, Clock, ShoppingCart, Recycle, Tags, X, Hammer, CheckSquare, Square, Zap, Scroll, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ItemPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
    masterCatalog?: GameEvent[];
}

const ItemPanel: React.FC<ItemPanelProps> = ({ event, onUpdate, masterCatalog = [] }) => {

    // Local state for adding ingredients
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [ingredientAmount, setIngredientAmount] = useState(1);

    // Local state for recycling output
    const [selectedRecycleRes, setSelectedRecycleRes] = useState('');
    const [recycleAmount, setRecycleAmount] = useState(1);

    const addQuickStat = (label: string, value: string = '+10') => {
        const currentStats = [...(event.stats || [])];
        if (currentStats.some(s => s.label.toUpperCase() === label.toUpperCase())) return;
        onUpdate({ stats: [...currentStats, { label, value }] });
    };

    const updateStat = (idx: number, field: keyof Stat, value: string) => {
        const newStats = [...(event.stats || [])];
        newStats[idx] = { ...newStats[idx], [field]: value };
        onUpdate({ stats: newStats });
    };

    const removeStat = (idx: number) => {
        onUpdate({ stats: (event.stats || []).filter((_, i) => i !== idx) });
    };

    const updateResourceConfig = (field: string, value: any) => {
        onUpdate({
            resourceConfig: {
                ...(event.resourceConfig || {
                    isResourceContainer: false,
                    resourceName: 'Kovový šrot',
                    resourceAmount: 1
                }),
                [field]: value
            }
        });
    };

    const updateCraftingConfig = (field: string, value: any) => {
        onUpdate({
            craftingRecipe: {
                ...(event.craftingRecipe || {
                    enabled: false,
                    requiredResources: [],
                    craftingTimeSeconds: 60
                }),
                [field]: value
            }
        });
    };

    const updateMarketConfig = (field: string, value: any) => {
        onUpdate({
            marketConfig: {
                ...(event.marketConfig || {
                    enabled: false,
                    marketPrice: undefined,
                    saleChance: 0,
                    recyclingOutput: []
                }),
                [field]: value
            }
        });
    };

    const addIngredient = () => {
        if (!selectedIngredient) return;
        const currentIngredients = event.craftingRecipe?.requiredResources || [];
        if (currentIngredients.some(i => i.resourceName === selectedIngredient)) return;

        updateCraftingConfig('requiredResources', [
            ...currentIngredients,
            { resourceName: selectedIngredient, amount: ingredientAmount }
        ]);
        setIngredientAmount(1);
    };

    const removeIngredient = (index: number) => {
        const currentIngredients = event.craftingRecipe?.requiredResources || [];
        updateCraftingConfig('requiredResources', currentIngredients.filter((_, i) => i !== index));
    };

    // MARKET HELPERS
    const addRecycleOutput = () => {
        if (!selectedRecycleRes) return;
        const currentRecycling = event.marketConfig?.recyclingOutput || [];
        if (currentRecycling.some(r => r.resourceName === selectedRecycleRes)) return;

        updateMarketConfig('recyclingOutput', [
            ...currentRecycling,
            { resourceName: selectedRecycleRes, amount: recycleAmount }
        ]);
        setRecycleAmount(1);
    };

    const removeRecycleOutput = (index: number) => {
        const currentRecycling = event.marketConfig?.recyclingOutput || [];
        updateMarketConfig('recyclingOutput', currentRecycling.filter((_, i) => i !== index));
    };

    // (CLASS MODIFIERS REMOVED)

    const availableResources = masterCatalog.filter(
        item => item.resourceConfig?.isResourceContainer
    );

    const statOptions = [
        { label: 'HP', icon: Heart, color: 'text-red-500' },
        { label: 'GOLD', icon: Coins, color: 'text-yellow-500' },
        { label: 'ARMOR', icon: Shield, color: 'text-blue-500' },
        { label: 'FUEL', icon: Fuel, color: 'text-orange-500' },
        { label: 'O2', icon: Wind, color: 'text-cyan-500' },
        { label: 'TRUP', icon: AlertTriangle, color: 'text-orange-600' } // Nová statistika pro poškození trupu
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="p-2 bg-primary/20 rounded-xl">
                    <Box size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Konfigurace Předmětu</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Vlastnosti a chování majetku</p>
                </div>
            </div>

            {/* TOGGLE OPTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    type="button"
                    onClick={() => onUpdate({ isConsumable: !event.isConsumable })}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${event.isConsumable ? 'bg-primary/20 border-primary/50 text-white shadow-neon' : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/20'}`}
                >
                    <div className={`p-2 rounded-xl ${event.isConsumable ? 'bg-primary text-white' : 'bg-zinc-800'}`}>
                        {event.isConsumable ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <div className="text-left">
                        <span className="text-xs font-black uppercase tracking-widest block">Spotřební Předmět</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase">Zmizí po použití</span>
                    </div>
                </button>

                <button
                    type="button"
                    onClick={() => onUpdate({ isSellOnly: !event.isSellOnly })}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${event.isSellOnly ? 'bg-red-500/20 border-red-500/50 text-white shadow-neon' : 'bg-black/40 border-white/5 text-zinc-500 hover:border-white/20'}`}
                >
                    <div className={`p-2 rounded-xl ${event.isSellOnly ? 'bg-red-500 text-white' : 'bg-zinc-800'}`}>
                        {event.isSellOnly ? <CheckSquare size={20} /> : <Square size={20} />}
                    </div>
                    <div className="text-left">
                        <span className="text-xs font-black uppercase tracking-widest block">Pouze k prodeji</span>
                        <span className="text-[10px] font-bold opacity-60 uppercase">Nemá funkční využití</span>
                    </div>
                </button>
            </div>

            {/* PRICE INPUT */}
            <div className="admin-card p-6 bg-black/40 group hover:border-primary/30 transition-all">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                    <Coins size={16} className="text-primary opacity-60" />
                    <label className="admin-label m-0">Základní Tržní Hodnota</label>
                </div>
                <div className="relative">
                    <input
                        type="number"
                        value={event.price || 0}
                        onChange={(e) => onUpdate({ price: parseInt(e.target.value) })}
                        className="admin-input text-2xl py-4 pr-20"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-[0.2em] pointer-events-none opacity-60">Kredity</span>
                </div>
            </div>

            {/* RESOURCE MODULE */}
            <div className={`admin-card transition-all duration-300 ${event.resourceConfig?.isResourceContainer ? 'bg-orange-500/10 border-orange-500/30' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Hammer size={20} className={event.resourceConfig?.isResourceContainer ? 'text-orange-500' : 'text-zinc-600'} />
                        <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest ${event.resourceConfig?.isResourceContainer ? 'text-white' : 'text-zinc-600'}`}>Modul Suroviny</h4>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Definujte tento předmět jako materiál</p>
                        </div>
                    </div>
                    <div className={`w-14 h-7 rounded-full p-1.5 transition-colors cursor-pointer ${event.resourceConfig?.isResourceContainer ? 'bg-orange-600' : 'bg-zinc-800'}`}
                        onClick={() => updateResourceConfig('isResourceContainer', !event.resourceConfig?.isResourceContainer)}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform ${event.resourceConfig?.isResourceContainer ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                <AnimatePresence>
                    {event.resourceConfig?.isResourceContainer && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-6 space-y-6 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="admin-label">Název suroviny: (musí být Unikátní)</label>
                                    <input
                                        type="text"
                                        value={event.resourceConfig.resourceName || ''}
                                        onChange={(e) => updateResourceConfig('resourceName', e.target.value)}
                                        className="admin-input"
                                        placeholder="KOVOVÝ_ŠROT"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="admin-label">Výchozí Množství (při naskenování karty, počet ks)</label>
                                    <input
                                        type="number"
                                        value={event.resourceConfig.resourceAmount || 1}
                                        onChange={(e) => updateResourceConfig('resourceAmount', parseInt(e.target.value))}
                                        className="admin-input"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="admin-label">Popis - nechal bych NALEZENO:</label>
                                <input
                                    type="text"
                                    value={event.resourceConfig.customLabel || ''}
                                    onChange={(e) => updateResourceConfig('customLabel', e.target.value)}
                                    className="admin-input"
                                    placeholder="Nezpracovaný materiál..."
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* CRAFTING MODULE */}
            <div className={`admin-card transition-all duration-300 ${event.craftingRecipe?.enabled ? 'bg-teal-500/10 border-teal-500/30' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Scroll size={20} className={event.craftingRecipe?.enabled ? 'text-teal-400' : 'text-zinc-600'} />
                        <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest ${event.craftingRecipe?.enabled ? 'text-white' : 'text-zinc-600'}`}>Modul Výroby</h4>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Definujte recept pro výrobu tohoto předmětu</p>
                        </div>
                    </div>
                    <div className={`w-14 h-7 rounded-full p-1.5 transition-colors cursor-pointer ${event.craftingRecipe?.enabled ? 'bg-teal-600' : 'bg-zinc-800'}`}
                        onClick={() => updateCraftingConfig('enabled', !event.craftingRecipe?.enabled)}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform ${event.craftingRecipe?.enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                <AnimatePresence>
                    {event.craftingRecipe?.enabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-6 space-y-8 overflow-hidden"
                        >
                            <div className="space-y-3">
                                <label className="admin-label flex items-center gap-2"><Clock size={12} className="text-teal-400" /> Doba Výroby (Sekundy)</label>
                                <input
                                    type="number"
                                    value={event.craftingRecipe.craftingTimeSeconds || 60}
                                    onChange={(e) => updateCraftingConfig('craftingTimeSeconds', parseInt(e.target.value))}
                                    className="admin-input"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="admin-label flex items-center gap-2 text-teal-400 opacity-80"><Plus size={12} /> Vyžadované Komponenty</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <select
                                        value={selectedIngredient}
                                        onChange={(e) => setSelectedIngredient(e.target.value)}
                                        className="admin-input text-[10px]"
                                    >
                                        <option value="">-- VYBERTE --</option>
                                        {availableResources.map(res => (
                                            <option key={res.id} value={res.resourceConfig?.resourceName || res.title}>
                                                {res.resourceConfig?.resourceName || res.title}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={ingredientAmount}
                                        onChange={(e) => setIngredientAmount(parseInt(e.target.value))}
                                        className="admin-input text-[10px] text-center"
                                        placeholder="MNŽ"
                                    />
                                    <button
                                        type="button"
                                        onClick={addIngredient}
                                        className="admin-button-primary py-2 h-[38px] bg-teal-600 hover:bg-teal-500"
                                    >
                                        <Plus size={16} /> Přidat
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {event.craftingRecipe.requiredResources?.map((ing, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-black/40 border border-teal-500/10 rounded-xl">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black uppercase text-white">{ing.resourceName}</span>
                                                <span className="text-xs font-mono text-teal-400">x{ing.amount}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeIngredient(idx)}
                                                className="text-zinc-700 hover:text-red-500 transition-colors"
                                            ><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                    {event.craftingRecipe.requiredResources?.length === 0 && (
                                        <div className="text-center py-4 border border-dashed border-white/5 rounded-xl text-zinc-700 text-[9px] font-black uppercase">Žádné ingredience</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* MARKET MODULE */}
            <div className={`admin-card transition-all duration-300 ${event.marketConfig?.enabled ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-white/5 opacity-60 hover:opacity-100'}`}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ShoppingCart size={20} className={event.marketConfig?.enabled ? 'text-primary' : 'text-zinc-600'} />
                        <div>
                            <h4 className={`text-xs font-black uppercase tracking-widest ${event.marketConfig?.enabled ? 'text-white' : 'text-zinc-600'}`}>Tržní Modifikátor</h4>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Parametry při prodeji obchodníkem</p>
                        </div>
                    </div>
                    <div className={`w-14 h-7 rounded-full p-1.5 transition-colors cursor-pointer ${event.marketConfig?.enabled ? 'bg-primary' : 'bg-zinc-800'}`}
                        onClick={() => updateMarketConfig('enabled', !event.marketConfig?.enabled)}>
                        <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform ${event.marketConfig?.enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                    </div>
                </div>

                <AnimatePresence>
                    {event.marketConfig?.enabled && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="p-6 space-y-8 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="admin-label flex items-center gap-2"><Tags size={12} className="text-primary" /> Přebití Ceny v Obchodě-Tržní ceny!</label>
                                    <input
                                        type="number"
                                        placeholder="VÝCHOZÍ SYSTÉMOVÁ CENA"
                                        value={event.marketConfig.marketPrice || ''}
                                        onChange={(e) => updateMarketConfig('marketPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="admin-input"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="admin-label flex items-center gap-2"><Wind size={12} className="text-primary" /> Šance na Slevu ({event.marketConfig.saleChance || 0}%)</label>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={event.marketConfig.saleChance || 0}
                                        onChange={(e) => updateMarketConfig('saleChance', parseInt(e.target.value))}
                                        className="w-full h-2 bg-black border border-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                </div>
                            </div>

                            {/* (CLASS MODIFIERS UI REMOVED) */}

                            {/* Recycling */}
                            <div className="space-y-4">
                                <label className="admin-label flex items-center gap-2 text-primary opacity-80"><Recycle size={12} /> Výstup RECYKLACE</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <select
                                        value={selectedRecycleRes}
                                        onChange={(e) => setSelectedRecycleRes(e.target.value)}
                                        className="admin-input text-[10px]"
                                    >
                                        <option value="">-- VÝSLEDNÁ SUROVINA --</option>
                                        {availableResources.map(res => (
                                            <option key={res.id} value={res.resourceConfig?.resourceName || res.title}>
                                                {res.resourceConfig?.resourceName || res.title}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        value={recycleAmount}
                                        onChange={(e) => setRecycleAmount(parseInt(e.target.value))}
                                        className="admin-input text-[10px] text-center"
                                        placeholder="MNŽ"
                                    />
                                    <button
                                        type="button"
                                        onClick={addRecycleOutput}
                                        className="admin-button-primary py-2 h-[38px]"
                                    >
                                        <Plus size={16} /> Přidat Výstup
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {event.marketConfig.recyclingOutput?.map((out, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-black/40 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase flex items-center gap-3">
                                            <span className="text-orange-500 flex items-center gap-1"><Hammer size={12} /> {out.resourceName}</span>
                                            <span className="text-white">x{out.amount}</span>
                                            <button onClick={() => removeRecycleOutput(idx)} className="text-zinc-700 hover:text-white transition-colors"><X size={12} /></button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* STATS MODULE */}
            <div className="admin-card p-6 bg-black/40 space-y-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <Zap size={18} className="text-primary opacity-60" />
                        <label className="admin-label m-0">Aktivní Modifikátory</label>
                    </div>
                    <div className="flex gap-1">
                        {statOptions.map(opt => (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => addQuickStat(opt.label)}
                                className="p-2 bg-black/60 border border-white/5 rounded-xl hover:border-primary/50 transition-all text-zinc-500 hover:text-white"
                                title={opt.label}
                            >
                                <opt.icon size={16} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <AnimatePresence>
                        {event.stats?.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex gap-3 group"
                            >
                                <select
                                    value={stat.label}
                                    onChange={(e) => updateStat(idx, 'label', e.target.value)}
                                    className="admin-input flex-[1] text-[10px] font-black uppercase text-primary bg-primary/5 cursor-pointer"
                                >
                                    {statOptions.map(opt => (
                                        <option key={opt.label} value={opt.label} className="bg-zinc-900">{opt.label}</option>
                                    ))}
                                    {!statOptions.some(o => o.label === stat.label) && (
                                        <option value={stat.label} className="bg-zinc-900">{stat.label}</option>
                                    )}
                                </select>
                                <input
                                    value={stat.value}
                                    onChange={(e) => updateStat(idx, 'value', e.target.value)}
                                    className="admin-input flex-[2] text-xs font-mono"
                                    placeholder="HODNOTA"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeStat(idx)}
                                    className="p-3 bg-black/40 border border-white/5 rounded-2xl text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!event.stats?.length && (
                        <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                            Žádné aktivní modifikátory
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default ItemPanel;
