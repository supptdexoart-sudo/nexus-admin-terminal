import React from 'react';
import { GameEventType } from '../../types';
import type { GameEvent } from '../../types';
import { Moon, Trash2, Clock, Plus, Zap, Tag, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NightVariantPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const NightVariantPanel: React.FC<NightVariantPanelProps> = ({ event, onUpdate }) => {

    const updateNightConfig = (updates: any) => {
        onUpdate({
            timeVariant: {
                ...(event.timeVariant || { enabled: false, nightStats: [] }),
                ...updates
            }
        });
    };

    const addNightStat = () => {
        const stats = [...(event.timeVariant?.nightStats || [])];
        stats.push({ label: 'NIGHT_MOD', value: '+5' });
        updateNightConfig({ nightStats: stats });
    };

    const updateNightStat = (index: number, field: 'label' | 'value', value: string) => {
        const stats = [...(event.timeVariant?.nightStats || [])];
        if (stats[index]) {
            stats[index] = { ...stats[index], [field]: value };
            updateNightConfig({ nightStats: stats });
        }
    };

    const removeNightStat = (index: number) => {
        const stats = (event.timeVariant?.nightStats || []).filter((_, i) => i !== index);
        updateNightConfig({ nightStats: stats });
    };

    const isEnabled = event.timeVariant?.enabled;

    return (
        <div className={`mt-8 space-y-6 transition-all duration-700 ${isEnabled ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-60'}`}>

            {/* HEADER INDICATOR */}
            <div className={`flex items-center justify-between p-6 rounded-3xl border backdrop-blur-md transition-all duration-500 ${isEnabled ? 'bg-indigo-500/10 border-indigo-500/40 shadow-neon-indigo' : 'bg-black/40 border-white/5'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-all duration-500 ${isEnabled ? 'bg-indigo-500 text-black' : 'bg-white/5 text-zinc-600'}`}>
                        <Moon size={24} className={isEnabled ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Noční Protokol v2.0</h3>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Úprava chování karty během noční fáze</p>
                    </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isEnabled || false}
                        onChange={(e) => updateNightConfig({ enabled: e.target.checked })}
                    />
                    <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            <AnimatePresence>
                {isEnabled && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="space-y-6"
                    >
                        {/* OVERRIDE GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="admin-card p-6 bg-black/40 space-y-4 group hover:border-indigo-500/30 transition-all">
                                <label className="admin-label m-0 flex items-center gap-2">
                                    <Tag size={14} className="text-indigo-400" /> Přebití Názvu
                                </label>
                                <input
                                    value={event.timeVariant?.nightTitle || ''}
                                    onChange={(e) => updateNightConfig({ nightTitle: e.target.value })}
                                    placeholder="ORIGINÁLNÍ NÁZEV"
                                    className="admin-input py-3 text-xs font-black uppercase border-indigo-500/10 focus:border-indigo-500/40"
                                />
                            </div>

                            <div className="admin-card p-6 bg-black/40 space-y-4 group hover:border-indigo-500/30 transition-all">
                                <label className="admin-label m-0 flex items-center gap-2">
                                    <Zap size={14} className="text-indigo-400" /> Přebití Typu
                                </label>
                                <select
                                    value={event.timeVariant?.nightType || ''}
                                    onChange={(e) => updateNightConfig({ nightType: e.target.value ? e.target.value as any : undefined })}
                                    className="admin-input py-3 text-xs font-black uppercase border-indigo-500/10 focus:border-indigo-500/40 cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900">PŮVODNÍ TYP</option>
                                    {Object.values(GameEventType).map((t) => (
                                        <option key={t} value={t} className="bg-zinc-900">{t}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="admin-card p-6 bg-black/40 space-y-4 group hover:border-indigo-500/30 transition-all">
                                <label className="admin-label m-0 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-indigo-400" /> Flavor Text
                                </label>
                                <input
                                    value={event.timeVariant?.nightFlavorText || ''}
                                    onChange={(e) => updateNightConfig({ nightFlavorText: e.target.value })}
                                    placeholder="ATLANTICKÁ VERZE TEXTU..."
                                    className="admin-input py-3 text-xs italic border-indigo-500/10 focus:border-indigo-500/40"
                                />
                            </div>

                            <div className="admin-card p-6 bg-black/40 space-y-4 group hover:border-indigo-500/30 transition-all">
                                <label className="admin-label m-0 flex items-center gap-2">
                                    <ShieldAlert size={14} className="text-indigo-400" /> Přebití Rarity
                                </label>
                                <select
                                    value={event.timeVariant?.nightRarity || ''}
                                    onChange={(e) => updateNightConfig({ nightRarity: e.target.value ? e.target.value as any : undefined })}
                                    className="admin-input py-3 text-xs font-black border-indigo-500/10 focus:border-indigo-500/40 cursor-pointer"
                                >
                                    <option value="" className="bg-zinc-900">PŮVODNÍ RARITA</option>
                                    {['Common', 'Rare', 'Epic', 'Legendary'].map(r => (
                                        <option key={r} value={r} className="bg-zinc-900">{r.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="admin-card p-6 bg-black/40 space-y-4 group hover:border-indigo-500/30 transition-all">
                            <label className="admin-label m-0 flex items-center gap-2">
                                <Info size={14} className="text-indigo-400" /> Noční Popis (Mechanika)
                            </label>
                            <textarea
                                value={event.timeVariant?.nightDescription || ''}
                                onChange={(e) => updateNightConfig({ nightDescription: e.target.value })}
                                placeholder="MECHANICKÉ ZMĚNY DOPADU KARTY..."
                                className="admin-input min-h-[100px] text-xs font-mono py-4 border-indigo-500/10 focus:border-indigo-500/40"
                            />
                        </div>

                        {/* NIGHT STATS */}
                        <div className="admin-card p-6 bg-black/40 border-indigo-500/10 space-y-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <div className="space-y-1">
                                    <label className="admin-label m-0 flex items-center gap-2 text-indigo-400">
                                        <Clock size={14} /> Modifikátory Statistik
                                    </label>
                                    <p className="text-[10px] font-bold text-zinc-600 uppercase">Tyto statistiky zcela nahrazují denní verzi</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addNightStat}
                                    className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl hover:bg-indigo-500 hover:text-black transition-all shadow-neon-indigo"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <AnimatePresence>
                                    {event.timeVariant?.nightStats?.map((stat, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="grid grid-cols-2 gap-3 group/stat"
                                        >
                                            <div className="relative">
                                                <input
                                                    value={stat.label}
                                                    onChange={(e) => updateNightStat(idx, 'label', e.target.value)}
                                                    className="admin-input py-3 pl-10 text-[10px] font-black uppercase font-mono border-indigo-500/5 focus:border-indigo-500/30"
                                                    placeholder="TAG"
                                                />
                                                <Tag size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500/30 group-hover/stat:text-indigo-500 transition-all" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={stat.value}
                                                    onChange={(e) => updateNightStat(idx, 'value', e.target.value)}
                                                    className="admin-input py-3 flex-1 text-xs font-mono border-indigo-500/5 focus:border-indigo-500/30"
                                                    placeholder="VAL"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNightStat(idx)}
                                                    className="p-3 text-zinc-700 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/10"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {(!event.timeVariant?.nightStats || event.timeVariant.nightStats.length === 0) && (
                                    <div className="text-center py-8 border border-dashed border-white/5 rounded-2xl text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                                        Bez statistik (zůstávají původní)
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NightVariantPanel;
