import React, { useState } from 'react';
import { GameEventType, type GameEvent, type Stat } from '../../types';
import { Archive, Sparkles, Coins, Heart, Fuel, Wind, Trash2, Lock, Unlock, Key, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChestPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
    masterCatalog?: GameEvent[];
}

const ChestPanel: React.FC<ChestPanelProps> = ({ event, onUpdate, masterCatalog = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const rewards = event.stats || [];

    const addReward = (label: string, value: string = '+10') => {
        if (rewards.some(s => s.label.toUpperCase() === label.toUpperCase())) return;
        onUpdate({ stats: [...rewards, { label, value }] });
    };

    const updateReward = (idx: number, field: keyof Stat, value: string) => {
        const newStats = [...rewards];
        newStats[idx] = { ...newStats[idx], [field]: value };
        onUpdate({ stats: newStats });
    };

    const removeReward = (idx: number) => {
        onUpdate({ stats: rewards.filter((_, i) => i !== idx) });
    };

    const quickOptions = [
        { label: 'ZLATO', icon: Coins, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { label: 'HP', icon: Heart, color: 'text-red-500', bg: 'bg-red-500/10' },
        { label: 'PALIVO', icon: Fuel, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { label: 'KYSLÍK', icon: Wind, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    ];

    // Filter items that can be keys (Items with resource config)
    const potentialKeys = masterCatalog.filter(item =>
        item.type === GameEventType.ITEM &&
        (item.resourceConfig?.isResourceContainer || item.id.startsWith('PRE-')) &&
        item.id !== event.id
    );

    const filteredKeys = potentialKeys.filter(k =>
        k.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        k.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedKey = masterCatalog.find(k => k.id === event.requiredKeyId);

    return (
        <div className="admin-card p-6 bg-black/40 space-y-6 mt-6 overflow-hidden relative">

            {/* BACKGROUND DECOR */}
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none rotate-12 translate-x-4 -translate-y-4">
                <Archive size={200} className="text-primary" />
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-xl text-yellow-500 shadow-neon">
                        <Archive size={20} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-tight leading-none mb-1">
                            Konfigurace Truhly
                        </h4>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                            Nastavení odměn a zámku
                        </p>
                    </div>
                </div>

                {/* LOCK TOGGLE */}
                <button
                    type="button"
                    onClick={() => onUpdate({ isLocked: !event.isLocked })}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${event.isLocked
                        ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                        : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                        }`}
                >
                    {event.isLocked ? <Lock size={14} /> : <Unlock size={14} />}
                    <span className="text-[10px] font-black uppercase tracking-wider">
                        {event.isLocked ? 'Zamčeno' : 'Odemčeno'}
                    </span>
                </button>
            </div>

            <div className="space-y-6 relative z-10">

                {/* LOCK CONFIG */}
                <AnimatePresence>
                    {event.isLocked && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-black/40 border border-red-500/20 rounded-2xl p-4 space-y-4 overflow-hidden"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Key size={14} className="text-red-500 shadow-neon" />
                                <label className="text-[10px] font-black uppercase text-zinc-400">Vyžadovaný KlíčAsset</label>
                            </div>

                            {/* Search and List */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="text"
                                        placeholder="Hledat klíč v databázi..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-black/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-red-500/40 transition-all outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                                    {filteredKeys.map(key => (
                                        <button
                                            key={key.id}
                                            type="button"
                                            onClick={() => onUpdate({ requiredKeyId: key.id })}
                                            className={`p-2 rounded-xl border text-left transition-all flex items-center gap-3 ${event.requiredKeyId === key.id
                                                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                                : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'
                                                }`}
                                        >
                                            <div className="w-8 h-8 bg-black/40 rounded-lg flex items-center justify-center shrink-0">
                                                <Key size={14} className={event.requiredKeyId === key.id ? 'text-red-500' : 'text-zinc-700'} />
                                            </div>
                                            <div className="truncate">
                                                <p className="text-[10px] font-black uppercase truncate">{key.title}</p>
                                                <p className="text-[8px] font-mono opacity-60">{key.id}</p>
                                            </div>
                                        </button>
                                    ))}
                                    {filteredKeys.length === 0 && (
                                        <div className="col-span-2 py-4 text-center text-[10px] text-zinc-700 font-bold uppercase">
                                            Žádné klíče nenalezeny
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedKey && (
                                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[9px] font-black text-red-500 uppercase">Aktivní pojistka: {selectedKey.title}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onUpdate({ requiredKeyId: undefined })}
                                        className="text-[9px] font-black text-zinc-600 hover:text-white uppercase"
                                    >
                                        Zrušit
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* QUICK ADD BUTTONS */}
                <div className="space-y-3">
                    <label className="admin-label text-zinc-500 text-[9px]">Rychlé přidání odměn</label>
                    <div className="flex flex-wrap gap-2">
                        {quickOptions.map(opt => (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => addReward(opt.label)}
                                className={`flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/5 rounded-xl hover:border-white/20 hover:bg-white/5 transition-all active:scale-95 group overflow-hidden relative`}
                            >
                                <div className={`absolute inset-0 ${opt.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
                                <opt.icon size={12} className={`${opt.color} relative z-10`} />
                                <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-white relative z-10">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* REWARDS LIST */}
                <div className="space-y-3">
                    <label className="admin-label text-zinc-500 text-[9px]">Obsah truhly</label>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                        <AnimatePresence>
                            {rewards.map((reward, idx) => {
                                const labelUpper = reward.label.toUpperCase();
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
                                                value={reward.label}
                                                onChange={(e) => updateReward(idx, 'label', e.target.value)}
                                                className="bg-transparent text-[10px] font-black text-white uppercase px-2 outline-none border-b border-white/5 focus:border-primary/40 transition-all placeholder-zinc-700"
                                                placeholder="TYP ODMĚNY"
                                            />
                                            <input
                                                value={reward.value}
                                                onChange={(e) => updateReward(idx, 'value', e.target.value)}
                                                className="bg-transparent text-xs font-mono font-bold text-primary px-2 outline-none border-b border-white/5 focus:border-primary/40 transition-all placeholder-zinc-800"
                                                placeholder="HODNOTA (NAPŘ. +50)"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeReward(idx)}
                                            className="p-3 text-zinc-700 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/10"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>

                        {rewards.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12 border border-dashed border-white/5 rounded-3xl"
                            >
                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">
                                    Truhla je prázdná
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChestPanel;
