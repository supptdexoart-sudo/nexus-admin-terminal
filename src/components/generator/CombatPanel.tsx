import React from 'react';
import { GameEventType } from '../../types';
import type { GameEvent, BossPhase } from '../../types';
import { Crown, Heart, Swords, Shield, Zap, X, Skull, Dice5, Wind, Target, Plus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CombatPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const CombatPanel: React.FC<CombatPanelProps> = ({ event, onUpdate }) => {
    const isBoss = event.type === GameEventType.BOSS;
    const isTrap = event.type === GameEventType.TRAP;
    const fleeChance = (() => { switch (event.rarity) { case 'Legendary': return 10; case 'Epic': return 30; case 'Rare': return 50; default: return 80; } })();

    const getSpecificStatValue = (label: string): string => {
        return event.stats?.find(s => s.label === label)?.value.toString() || '';
    };

    const setSpecificStat = (label: string, value: string) => {
        const currentStats = event.stats ? [...event.stats] : [];
        const filteredStats = currentStats.filter(s => s.label !== label);
        if (value && value !== '0') {
            filteredStats.unshift({ label, value });
        }
        onUpdate({ stats: filteredStats });
    };

    const updateCombatConfig = (field: string, value: any) => {
        onUpdate({
            combatConfig: {
                ...(event.combatConfig || { defBreakChance: 0 }),
                [field]: value
            }
        });
    };

    // Boss Phase Logic
    const addBossPhase = () => {
        const newPhase: BossPhase = {
            name: 'Nová Fáze',
            description: 'Boss se rozzuří...',
            triggerType: 'HP_PERCENT',
            triggerValue: 50,
            damageBonus: 5
        };
        onUpdate({ bossPhases: [...(event.bossPhases || []), newPhase] });
    };

    const updateBossPhase = (index: number, field: keyof BossPhase, value: any) => {
        const updatedPhases = [...(event.bossPhases || [])];
        updatedPhases[index] = { ...updatedPhases[index], [field]: value };
        onUpdate({ bossPhases: updatedPhases });
    };

    const removeBossPhase = (index: number) => {
        onUpdate({ bossPhases: (event.bossPhases || []).filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-md transition-all ${isBoss ? 'bg-red-500/10 border-red-500/30 shadow-neon-red' : 'bg-black/40 border-white/5'}`}>
                <div className={`p-2 rounded-xl ${isBoss ? 'bg-red-500 text-black' : 'bg-primary/20 text-primary'}`}>
                    {isBoss ? <Crown size={20} /> : <Skull size={20} />}
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">
                        {isBoss ? 'Detekce Elitní Hrozby' : isTrap ? 'Parametry Nebezpečí' : 'Statistiky Nepřítele'}
                    </h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                        {isBoss ? 'Bojový protokol protiku vícestupňovým fázím' : 'Bojové parametry a mechaniky'}
                    </p>
                </div>
            </div>

            {/* BASE STATS GRID */}
            <div className={`grid grid-cols-3 gap-4 border border-white/5 bg-black/40 p-1 rounded-3xl`}>
                <div className="admin-card p-6 border-none bg-transparent hover:bg-white/5 transition-all text-center">
                    <Heart className="w-5 h-5 text-red-500 mx-auto mb-3" />
                    <label className="admin-label text-center mb-2">{isTrap ? 'Obtížnost' : 'HP'}</label>
                    <input
                        type="number"
                        placeholder="50"
                        value={getSpecificStatValue('HP')}
                        onChange={(e) => setSpecificStat('HP', e.target.value)}
                        className="w-full bg-transparent text-center text-white font-black font-mono text-2xl outline-none"
                    />
                </div>
                <div className="admin-card p-6 border-x border-white/5 bg-transparent hover:bg-white/5 transition-all text-center">
                    <Swords className="w-5 h-5 text-orange-500 mx-auto mb-3" />
                    <label className="admin-label text-center mb-2">{isTrap ? 'Poškození' : 'Útok'}</label>
                    <input
                        type="number"
                        placeholder="10"
                        value={getSpecificStatValue('ATK')}
                        onChange={(e) => setSpecificStat('ATK', e.target.value)}
                        className="w-full bg-transparent text-center text-white font-black font-mono text-2xl outline-none"
                    />
                </div>
                <div className="admin-card p-6 border-none bg-transparent hover:bg-white/5 transition-all text-center">
                    <Shield className="w-5 h-5 text-blue-500 mx-auto mb-3" />
                    <label className="admin-label text-center mb-2">{isTrap ? 'Odolnost' : 'Obrana'}</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={getSpecificStatValue('DEF')}
                        onChange={(e) => setSpecificStat('DEF', e.target.value)}
                        className="w-full bg-transparent text-center text-white font-black font-mono text-2xl outline-none"
                    />
                </div>
            </div>

            {/* BOSS PHASES MODULE */}
            {isBoss && (
                <div className="admin-card bg-black/40 p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
                        <div className="flex items-center gap-3">
                            <Zap size={18} className="text-red-500" />
                            <h4 className="text-xs font-black text-white uppercase tracking-widest">Bojové Fáze Bosse</h4>
                        </div>
                        <button
                            type="button"
                            onClick={addBossPhase}
                            className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black py-2 px-4 rounded-xl border border-red-500/30 transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                        >
                            <Plus size={14} /> Přidat Fázi
                        </button>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {event.bossPhases?.map((phase, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="relative group bg-black/60 border border-white/5 rounded-2xl p-5 hover:border-red-500/30 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="admin-label text-[10px] opacity-60">Název Fáze</label>
                                                    <input
                                                        value={phase.name}
                                                        onChange={(e) => updateBossPhase(idx, 'name', e.target.value)}
                                                        className="admin-input py-2 text-sm font-black text-red-500"
                                                        placeholder="NÁZEV FÁZE"
                                                    />
                                                </div>
                                                <div className="space-y-2 text-right">
                                                    <label className="admin-label text-[10px] opacity-60">Spuštění @ HP%</label>
                                                    <div className="flex items-center justify-end gap-3 mt-1">
                                                        <span className="text-2xl font-black text-white font-mono">{phase.triggerValue}%</span>
                                                        <input
                                                            type="range"
                                                            min="1" max="99"
                                                            value={phase.triggerValue}
                                                            onChange={(e) => updateBossPhase(idx, 'triggerValue', parseInt(e.target.value))}
                                                            className="h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-500 w-24"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="admin-label text-[10px] opacity-60">Taktický Popis</label>
                                                <textarea
                                                    value={phase.description}
                                                    onChange={(e) => updateBossPhase(idx, 'description', e.target.value)}
                                                    className="admin-input py-3 text-xs bg-black/60 min-h-[80px]"
                                                    placeholder="Popište chování bosse..."
                                                />
                                            </div>
                                        </div>
                                        <div className="md:w-32 flex flex-col items-center justify-center border-l border-white/5 pl-6 gap-2">
                                            <label className="admin-label text-[10px] text-center opacity-60">DMG Bonus</label>
                                            <div className="text-3xl font-black text-white font-mono">+{phase.damageBonus}</div>
                                            <div className="flex gap-1 mt-2">
                                                <button type="button" onClick={() => updateBossPhase(idx, 'damageBonus', Math.max(0, phase.damageBonus - 1))} className="p-1 px-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all">-</button>
                                                <button type="button" onClick={() => updateBossPhase(idx, 'damageBonus', phase.damageBonus + 1)} className="p-1 px-3 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all">+</button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeBossPhase(idx)}
                                        className="absolute -top-2 -right-2 p-2 bg-red-500 text-black rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-neon-red"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {(!event.bossPhases || event.bossPhases.length === 0) && (
                            <div className="text-center py-8 border border-dashed border-white/5 rounded-3xl text-zinc-700 text-[10px] font-black uppercase tracking-widest">
                                Žádné aktivní bojové fáze
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* NORMAL COMBAT CONFIG */}
            {!isTrap && (
                <div className="admin-card bg-black/40 p-6 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <Target size={18} className="text-green-500" />
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Pravděpodobnost Slabiny</h4>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase">Šance na kritický průraz brněním, který ignoruje obranu nepřítele.</p>
                            <div className="flex items-center gap-6 pt-4">
                                <input
                                    type="range"
                                    min="0" max="100"
                                    value={event.combatConfig?.defBreakChance || 0}
                                    onChange={(e) => updateCombatConfig('defBreakChance', parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-black border border-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                                <div className="bg-primary/10 border border-primary/30 px-6 py-2 rounded-2xl text-primary font-black font-mono text-2xl shadow-neon min-w-[100px] text-center">
                                    {event.combatConfig?.defBreakChance || 0}%
                                </div>
                            </div>
                        </div>

                        {!isBoss && (
                            <div className="md:w-64 bg-black/40 border border-white/5 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center gap-3">
                                    <Wind size={18} className="text-zinc-500" />
                                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Pravděpodobnost Útěku</h4>
                                </div>
                                <div className="text-3xl font-black text-white font-mono">
                                    {fleeChance}%
                                </div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase leading-relaxed">
                                    Vygenerováno ústřednou na základě rarity <span className="text-primary">{event.rarity}</span>.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-white/5 pt-8">
                        <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl">
                            <Dice5 size={20} className="text-zinc-500 mt-1" />
                            <div className="space-y-1">
                                <h5 className="text-[10px] font-black text-white uppercase">MECHANIKY BOJE</h5>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase leading-relaxed">Brnění absorbuje poškození jako první. Obrana snižuje příchozí poškození. Slabina ignoruje obranu.</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <span className="text-[10px] font-black text-primary uppercase">Generovat náhodnou raritní sadu?</span>
                            <ArrowRight size={16} className="text-primary" />
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CombatPanel;
