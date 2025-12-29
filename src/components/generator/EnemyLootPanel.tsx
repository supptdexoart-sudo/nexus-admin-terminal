import React from 'react';
import type { GameEvent, Stat } from '../../types';
import { Coins, Heart, Fuel, Wind, Sparkles, Trash2, Plus, Box, Percent, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnemyLootPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const EnemyLootPanel: React.FC<EnemyLootPanelProps> = ({ event, onUpdate }) => {

    const lootStats = event.enemyLoot?.lootStats || [];

    const updateLoot = (updates: any) => {
        onUpdate({
            enemyLoot: {
                ...(event.enemyLoot || {}),
                ...updates
            }
        });
    };

    const addLootStat = (label: string, value: string = '+10') => {
        if (lootStats.some(s => s.label.toUpperCase() === label.toUpperCase())) return;
        updateLoot({ lootStats: [...lootStats, { label, value }] });
    };

    const updateLootStat = (idx: number, field: keyof Stat, value: string) => {
        const newStats = [...lootStats];
        newStats[idx] = { ...newStats[idx], [field]: value };
        updateLoot({ lootStats: newStats });
    };

    const removeLootStat = (idx: number) => {
        updateLoot({ lootStats: lootStats.filter((_, i) => i !== idx) });
    };

    const quickOptions = [
        { label: 'ZLATO', icon: Coins, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'HP', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'PALIVO', icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'O2', icon: Wind, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    return (
        <div className="admin-card p-6 bg-black/40 space-y-6 mt-6 overflow-hidden relative">

            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none rotate-12 translate-x-4 -translate-y-4">
                <Box size={200} className="text-primary" />
            </div>

            <div className="flex items-center gap-3 border-b border-white/5 pb-4 relative z-10">
                <div className="p-2 bg-primary/20 rounded-xl text-primary shadow-neon-blue">
                    <Target size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">
                        Konfigurace Loootu
                    </h4>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                        Odměny a pravděpodobnost dropu pro tuto entitu
                    </p>
                </div>
            </div>

            <div className="space-y-6 relative z-10">
                {/* DROP CHANCE MODULE */}
                <div className="admin-card p-4 bg-black/60 border-white/5 group hover:border-primary/20 transition-all">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <label className="admin-label m-0 flex items-center gap-2">
                                <Percent size={14} className="text-primary" /> Šance na drop předmětu
                            </label>
                            <p className="text-[10px] font-bold text-zinc-600 uppercase">Pravděpodobnost vygenerování dodatečného itemu</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-black text-white font-mono">{event.enemyLoot?.dropItemChance ?? 0}%</div>
                            <input
                                type="number"
                                min="0" max="100"
                                value={event.enemyLoot?.dropItemChance ?? 0}
                                onChange={(e) => updateLoot({ dropItemChance: parseInt(e.target.value) })}
                                className="w-16 admin-input py-2 text-center text-xs font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* QUICK ADD BUTTONS */}
                <div className="space-y-3">
                    <label className="admin-label text-zinc-500 text-[9px]">Rychlé přidání zdrojů</label>
                    <div className="flex flex-wrap gap-2">
                        {quickOptions.map(opt => (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => addLootStat(opt.label)}
                                className={`flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all active:scale-95 group overflow-hidden relative`}
                            >
                                <div className={`absolute inset-0 ${opt.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <opt.icon size={12} className={`${opt.color} relative z-10`} />
                                <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white relative z-10">{opt.label}</span>
                            </button>
                        ))}
                        <button
                            type="button"
                            onClick={() => addLootStat('CUSTOM')}
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-xl hover:bg-primary/20 transition-all active:scale-95 text-primary group"
                        >
                            <Plus size={12} />
                            <span className="text-[10px] font-black uppercase">Vlastní</span>
                        </button>
                    </div>
                </div>

                {/* STATS LIST */}
                <div className="space-y-3">
                    <label className="admin-label text-zinc-500 text-[9px]">Konkrétní hodnoty loot tabulky</label>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        <AnimatePresence>
                            {lootStats.map((stat, idx) => {
                                const labelUpper = stat.label.toUpperCase();
                                const foundOption = quickOptions.find(o => labelUpper.includes(o.label));

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="admin-card p-2 bg-black/60 flex items-center gap-3 group hover:border-white/10 transition-all border-white/5"
                                    >
                                        <div className={`p-3 rounded-xl ${foundOption ? foundOption.bg : 'bg-white/5'} flex items-center justify-center`}>
                                            {foundOption ? <foundOption.icon size={16} className={`${foundOption.color}`} /> : <Sparkles size={16} className="text-zinc-500" />}
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <input
                                                value={stat.label}
                                                onChange={(e) => updateLootStat(idx, 'label', e.target.value)}
                                                className="bg-transparent text-[10px] font-black text-white uppercase px-2 outline-none border-b border-white/5 focus:border-primary/40 transition-all placeholder-zinc-700"
                                                placeholder="TAG ZDROJE"
                                            />
                                            <input
                                                value={stat.value}
                                                onChange={(e) => updateLootStat(idx, 'value', e.target.value)}
                                                className="bg-transparent text-xs font-mono font-bold text-primary px-2 outline-none border-b border-white/5 focus:border-primary/40 transition-all placeholder-zinc-800"
                                                placeholder="HODNOTA (NAPŘ. +25)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeLootStat(idx)}
                                            className="p-3 text-zinc-700 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/10"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {lootStats.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 border border-dashed border-white/5 rounded-3xl"
                            >
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                                    Loot tabulka je prázdná
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnemyLootPanel;
