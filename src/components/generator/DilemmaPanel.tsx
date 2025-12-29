import React from 'react';
import type { GameEvent, DilemmaOption, DilemmaReward } from '../../types';
import { Split, User, Globe, Skull, AlertTriangle, ArrowRight, Plus, Trash2, CheckCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DilemmaPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const DilemmaPanel: React.FC<DilemmaPanelProps> = ({ event, onUpdate }) => {

    const addDilemmaOption = () => {
        const newOption: DilemmaOption = {
            label: `MOŽNOST ${(event.dilemmaOptions?.length || 0) + 1}`,
            successChance: 100,
            consequenceText: 'Mise úspěšná.',
            rewards: [],
            failMessage: 'Mise selhala.',
            failDamage: 0,
            physicalInstruction: ''
        };
        onUpdate({
            dilemmaOptions: [...(event.dilemmaOptions || []), newOption]
        });
    };

    const updateOption = (index: number, updates: Partial<DilemmaOption>) => {
        const updatedOptions = [...(event.dilemmaOptions || [])];
        updatedOptions[index] = { ...updatedOptions[index], ...updates };
        onUpdate({ dilemmaOptions: updatedOptions });
    };

    const removeDilemmaOption = (index: number) => {
        onUpdate({
            dilemmaOptions: (event.dilemmaOptions || []).filter((_, i) => i !== index)
        });
    };

    // Reward Management Helpers
    const addReward = (optIndex: number) => {
        const options = [...(event.dilemmaOptions || [])];
        if (!options[optIndex].rewards) {
            options[optIndex].rewards = [];
        }
        options[optIndex].rewards!.push({ type: 'GOLD', value: 10 });
        onUpdate({ dilemmaOptions: options });
    };

    const updateReward = (optIndex: number, rewIndex: number, field: keyof DilemmaReward, value: any) => {
        const options = [...(event.dilemmaOptions || [])];
        if (options[optIndex].rewards) {
            options[optIndex].rewards![rewIndex] = { ...options[optIndex].rewards![rewIndex], [field]: value };
            onUpdate({ dilemmaOptions: options });
        }
    };

    const removeReward = (optIndex: number, rewIndex: number) => {
        const options = [...(event.dilemmaOptions || [])];
        if (options[optIndex].rewards) {
            options[optIndex].rewards = options[optIndex].rewards!.filter((_, i) => i !== rewIndex);
            onUpdate({ dilemmaOptions: options });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="p-2 bg-purple-500/20 rounded-xl text-purple-500">
                    <Split size={20} />
                </div>
                <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Editor Dilemmatu</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Větvení příběhu a podmínky rozhodování</p>
                </div>
            </div>

            {/* DILEMMA SCOPE */}
            <div className="admin-card p-6 bg-black/40 border-purple-500/20 group hover:border-purple-500/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <label className="admin-label m-0 flex items-center gap-2">
                            <HelpCircle size={14} className="text-purple-500" /> Rozsah rozhodnutí
                        </label>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase">Určuje, zda dopad pocítí jeden hráč, nebo celá posádka</p>
                    </div>
                    <div className="flex p-1 bg-black/60 rounded-2xl border border-white/5">
                        <button
                            type="button"
                            onClick={() => onUpdate({ dilemmaScope: 'INDIVIDUAL' })}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${event.dilemmaScope === 'INDIVIDUAL' ? 'bg-purple-600 text-black shadow-neon-purple' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <User size={14} /> Individuální
                        </button>
                        <button
                            type="button"
                            onClick={() => onUpdate({ dilemmaScope: 'GLOBAL' })}
                            className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${event.dilemmaScope === 'GLOBAL' ? 'bg-purple-600 text-black shadow-neon-purple' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <Globe size={14} /> Globální
                        </button>
                    </div>
                </div>
            </div>

            {/* OPTIONS LIST */}
            <div className="space-y-6">
                <AnimatePresence>
                    {event.dilemmaOptions?.map((opt, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="admin-card bg-black/40 overflow-hidden border-purple-500/10 group hover:border-purple-500/30 transition-all"
                        >
                            {/* Option Header */}
                            <div className="bg-purple-500/5 p-4 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-full bg-black border border-purple-500/30 flex items-center justify-center font-mono text-xs font-black text-purple-500">
                                        {idx + 1}
                                    </div>
                                    <input
                                        value={opt.label}
                                        onChange={(e) => updateOption(idx, { label: e.target.value })}
                                        className="bg-transparent text-white font-black text-xs uppercase tracking-widest outline-none w-full placeholder-purple-900/50"
                                        placeholder="ZADEJTE NÁZEV MOŽNOSTI"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeDilemmaOption(idx)}
                                    className="p-2 text-zinc-600 hover:text-red-500 transition-all hover:bg-red-500/10 rounded-xl"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* SUCCESS CHANCE SLIDER */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <label className="admin-label m-0 text-zinc-500">Pravděpodobnost úspěchu</label>
                                            <p className="text-[9px] font-bold text-zinc-600 uppercase">Matematická šance na splnění této cesty</p>
                                        </div>
                                        <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                                            {opt.successChance}<span className="text-xs text-purple-500">%</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100" step="5"
                                        value={opt.successChance}
                                        onChange={(e) => updateOption(idx, { successChance: parseInt(e.target.value) })}
                                        className="w-full h-2 bg-black border border-white/5 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* SUCCESS COLUMN */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 border-b border-green-500/20 pb-2">
                                            <CheckCircle size={14} className="text-green-500" />
                                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Při úspěchu</span>
                                        </div>
                                        <textarea
                                            value={opt.consequenceText}
                                            onChange={(e) => updateOption(idx, { consequenceText: e.target.value })}
                                            className="admin-input min-h-[100px] text-xs py-3 border-green-500/10 focus:border-green-500/30"
                                            placeholder="Popište, co se stane v případě úspěchu..."
                                        />

                                        <div className="space-y-3">
                                            <label className="text-[9px] font-black text-zinc-600 uppercase">Odměny a Benefity</label>
                                            <div className="space-y-2">
                                                {opt.rewards?.map((rew, rIdx) => (
                                                    <div key={rIdx} className="flex gap-2 animate-in slide-in-from-left-1">
                                                        <select
                                                            value={rew.type}
                                                            onChange={(e) => updateReward(idx, rIdx, 'type', e.target.value)}
                                                            className="admin-input py-2 flex-1 text-[10px] font-black uppercase"
                                                        >
                                                            <option value="HP">OBNOVA HP</option>
                                                            <option value="GOLD">KREDITY / ZLATO</option>
                                                        </select>
                                                        <input
                                                            type="number"
                                                            value={rew.value}
                                                            onChange={(e) => updateReward(idx, rIdx, 'value', parseInt(e.target.value))}
                                                            className="admin-input py-2 w-20 text-center font-mono"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeReward(idx, rIdx)}
                                                            className="p-2 text-zinc-600 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addReward(idx)}
                                                    className="w-full py-2 bg-green-500/5 hover:bg-green-500/10 border border-green-500/30 text-green-500 text-[10px] font-black uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Přidat Odměnu
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FAIL COLUMN */}
                                    <div className={`space-y-4 transition-all duration-500 ${opt.successChance === 100 ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                                        <div className="flex items-center gap-2 border-b border-red-500/20 pb-2">
                                            <Skull size={14} className="text-red-500" />
                                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Při selhání</span>
                                        </div>
                                        <textarea
                                            value={opt.failMessage || ''}
                                            onChange={(e) => updateOption(idx, { failMessage: e.target.value })}
                                            className="admin-input min-h-[100px] text-xs py-3 border-red-500/10 focus:border-red-500/30"
                                            placeholder="Popište tragický následek selhání..."
                                            disabled={opt.successChance === 100}
                                        />
                                        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl flex items-center justify-between">
                                            <label className="text-[10px] font-black text-red-500/80 uppercase">Body Poškození</label>
                                            <input
                                                type="number"
                                                value={opt.failDamage || 0}
                                                onChange={(e) => updateOption(idx, { failDamage: parseInt(e.target.value) })}
                                                className="w-20 bg-black border-b border-red-500/50 text-red-500 font-black font-mono text-center outline-none p-1"
                                                disabled={opt.successChance === 100}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* PHYSICAL INSTRUCTION */}
                                <div className="border-t border-white/5 pt-6 group/phys">
                                    <label className="admin-label mb-3 flex items-center gap-2 group-hover/phys:text-yellow-500 transition-all">
                                        <AlertTriangle size={14} className="text-yellow-500" /> Board Instruction (Protokol Desky)
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={opt.physicalInstruction || ''}
                                            onChange={(e) => updateOption(idx, { physicalInstruction: e.target.value })}
                                            className="admin-input py-4 pl-12 text-xs text-yellow-500 border-yellow-500/10 focus:border-yellow-500/30"
                                            placeholder="NAPŘ. POSUŇ FIGURKU O 3 POLÍČKA ZPĚT..."
                                        />
                                        <ArrowRight size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-yellow-500 opacity-40" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    type="button"
                    onClick={addDilemmaOption}
                    className="admin-button-secondary w-full py-5 rounded-3xl border-dashed border-2 flex items-center justify-center gap-3 group"
                >
                    <Split size={18} className="group-hover:rotate-90 transition-all duration-500" />
                    <span>Inicializovat novou větev osudu</span>
                </button>
            </div>

        </div>
    );
};

export default DilemmaPanel;
