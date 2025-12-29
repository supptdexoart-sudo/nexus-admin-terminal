import React from 'react';
import type { GameEvent, Stat } from '../../types';
import { PlayerClass } from '../../types';
import { Shield, Zap, Trash2, Heart, Swords, Wind, Fuel, Coins, Skull, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TrapPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const TrapPanel: React.FC<TrapPanelProps> = ({ event, onUpdate }) => {

    const updateTrapConfig = (field: string, value: any) => {
        onUpdate({
            trapConfig: {
                ...(event.trapConfig || {
                    difficulty: 10,
                    damage: 20,
                    disarmClass: PlayerClass.ROGUE,
                    successMessage: "Past zneškodněna.",
                    failMessage: "Past sklapla!",
                    loot: []
                }),
                [field]: value
            }
        });
    };

    // --- LOOT MANAGEMENT ---
    const addLoot = (label: string = 'ZLATO', value: string = '+10') => {
        const currentConfig = event.trapConfig || {
            difficulty: 10,
            damage: 20,
            disarmClass: PlayerClass.ROGUE,
            successMessage: "Past zneškodněna.",
            failMessage: "Past sklapla!",
            loot: []
        };

        const currentLoot = currentConfig.loot || [];

        onUpdate({
            trapConfig: {
                ...currentConfig,
                loot: [...currentLoot, { label, value }]
            }
        });
    };

    const updateLootStat = (idx: number, field: keyof Stat, value: string) => {
        const currentLoot = [...(event.trapConfig?.loot || [])];
        if (currentLoot[idx]) {
            currentLoot[idx] = { ...currentLoot[idx], [field]: value };
            updateTrapConfig('loot', currentLoot);
        }
    };

    const removeLootStat = (idx: number) => {
        const currentLoot = (event.trapConfig?.loot || []).filter((_, i) => i !== idx);
        updateTrapConfig('loot', currentLoot);
    };

    const quickLootOptions = [
        { label: 'HP', icon: Heart, color: 'text-red-500' },
        { label: 'DMG', icon: Swords, color: 'text-orange-500' },
        { label: 'ARMOR', icon: Shield, color: 'text-blue-400' },
        { label: 'PALIVO', icon: Fuel, color: 'text-orange-500' },
        { label: 'ZLATO', icon: Coins, color: 'text-yellow-500' },
        { label: 'KYSLÍK', icon: Wind, color: 'text-cyan-400' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="p-2 bg-red-500/20 rounded-xl">
                    <Skull size={20} className="text-red-500" />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Specifikace Pasti</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Negativní efekty a protokoly nebezpečí</p>
                </div>
            </div>

            {/* QUICK CONFIG GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="admin-card p-6 bg-black/40 group hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <Zap size={16} className="text-primary opacity-60" />
                        <label className="admin-label m-0">Obtížnost Odstranění (D20)</label>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={event.trapConfig?.difficulty ?? 10}
                            onChange={(e) => updateTrapConfig('difficulty', parseInt(e.target.value))}
                            className="admin-input text-2xl py-4 pr-20 font-mono"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-primary uppercase tracking-[0.2em] pointer-events-none opacity-60">Prah CC</span>
                    </div>
                </div>

                <div className="admin-card p-6 bg-black/40 group hover:border-red-500/30 transition-all border-red-500/10">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <Skull size={16} className="text-red-500 opacity-60" />
                        <label className="admin-label m-0 text-red-500/80">Poškození při selhání</label>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={event.trapConfig?.damage ?? 20}
                            onChange={(e) => updateTrapConfig('damage', parseInt(e.target.value))}
                            className="admin-input text-2xl py-4 pr-20 font-mono text-red-500 border-red-500/20 focus:border-red-500"
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-red-500 uppercase tracking-[0.2em] pointer-events-none opacity-60">Zásah HP</span>
                    </div>
                </div>
            </div>

            {/* CLASS SPECIALIST & TYPE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="admin-card p-6 bg-black/40 space-y-4">
                    <label className="admin-label flex items-center gap-2"><Shield size={12} className="text-primary" /> Bonusová Třída (Specialista)</label>
                    <select
                        value={event.trapConfig?.disarmClass ?? 'ANY'}
                        onChange={(e) => updateTrapConfig('disarmClass', e.target.value)}
                        className="admin-input text-[10px] uppercase font-black"
                    >
                        <option value="ANY">-- ŽÁDNÝ SPECIALISTA --</option>
                        {Object.values(PlayerClass).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div className="admin-card p-6 bg-black/40 space-y-4">
                    <label className="admin-label flex items-center gap-2"><Tag size={12} className="text-primary" /> Klasifikace Nebezpečí</label>
                    <input
                        type="text"
                        value={event.trapConfig?.trapType ?? ''}
                        onChange={(e) => updateTrapConfig('trapType', e.target.value)}
                        placeholder="NAPŘ. MECHANICKÁ, BIOLOGICKÁ..."
                        className="admin-input text-[10px] uppercase font-black"
                    />
                </div>
            </div>

            {/* MESSAGES MODULE */}
            <div className="admin-card p-6 bg-black/40 space-y-6">
                <div className="space-y-4">
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500/50 rounded-full"></div>
                        <div className="pl-6 py-2">
                            <label className="text-[10px] font-black text-green-500/80 uppercase tracking-widest block mb-2">Zpráva při úspěchu</label>
                            <input
                                type="text"
                                value={event.trapConfig?.successMessage ?? "Past zneškodněna."}
                                onChange={(e) => updateTrapConfig('successMessage', e.target.value)}
                                className="w-full bg-transparent border-b border-white/5 py-2 text-xs text-white outline-none focus:border-green-500/50 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/50 rounded-full"></div>
                        <div className="pl-6 py-2">
                            <label className="text-[10px] font-black text-red-500/80 uppercase tracking-widest block mb-2">Zpráva při selhání</label>
                            <input
                                type="text"
                                value={event.trapConfig?.failMessage ?? "Past sklapla!"}
                                onChange={(e) => updateTrapConfig('failMessage', e.target.value)}
                                className="w-full bg-transparent border-b border-white/5 py-2 text-xs text-white outline-none focus:border-red-500/50 transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* REWARD MODULE (LOOT) */}
            <div className="admin-card p-6 bg-black/40 space-y-6">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                        <Coins size={18} className="text-primary opacity-60" />
                        <label className="admin-label m-0">Odměna za odstranění (Loot)</label>
                    </div>
                    <div className="flex gap-1">
                        {quickLootOptions.map(opt => (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => addLoot(opt.label, '+10')}
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
                        {event.trapConfig?.loot?.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex gap-3 group"
                            >
                                <input
                                    value={stat.label}
                                    onChange={(e) => updateLootStat(idx, 'label', e.target.value)}
                                    className="admin-input flex-[1] text-[10px] font-black uppercase text-primary bg-primary/5"
                                    placeholder="TYP"
                                />
                                <input
                                    value={stat.value}
                                    onChange={(e) => updateLootStat(idx, 'value', e.target.value)}
                                    className="admin-input flex-[2] text-xs font-mono"
                                    placeholder="HODNOTA"
                                />
                                <button
                                    onClick={() => removeLootStat(idx)}
                                    className="p-3 bg-black/40 border border-white/5 rounded-2xl text-zinc-600 hover:text-red-500 hover:border-red-500/30 transition-all"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {(!event.trapConfig?.loot || event.trapConfig.loot.length === 0) && (
                        <div className="text-center py-6 border border-dashed border-white/5 rounded-2xl text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                            Bez odměny za zneškodnění
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default TrapPanel;
