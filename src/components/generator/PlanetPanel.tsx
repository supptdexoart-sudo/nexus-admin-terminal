import React from 'react';
import { GameEventType } from '../../types';
import type { GameEvent } from '../../types';
import { Globe, MapPin, Layers, Trash2, Plus, ScanLine, Target, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanetPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
    masterCatalog: GameEvent[];
}

const PlanetPanel: React.FC<PlanetPanelProps> = ({ event, onUpdate, masterCatalog }) => {

    const updatePlanetConfig = (field: string, value: any) => {
        onUpdate({
            planetConfig: {
                ...(event.planetConfig || {
                    planetId: 'p1',
                    landingEventType: GameEventType.ENCOUNTER,
                    phases: []
                }),
                [field]: value
            }
        });
    };

    const addPhase = () => {
        const currentPhases = event.planetConfig?.phases || [];
        updatePlanetConfig('phases', [...currentPhases, '']);
    };

    const updatePhase = (index: number, eventId: string) => {
        const currentPhases = [...(event.planetConfig?.phases || [])];
        currentPhases[index] = eventId;
        updatePlanetConfig('phases', currentPhases);
    };

    const removePhase = (index: number) => {
        const currentPhases = (event.planetConfig?.phases || []).filter((_, i) => i !== index);
        updatePlanetConfig('phases', currentPhases);
    };

    // Filter available cards (NO PLANETS allowed inside a planet)
    const availableCards = masterCatalog.filter(i => i.type !== GameEventType.PLANET);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-indigo-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-500 relative z-10 shadow-neon-indigo">
                    <Globe size={20} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Editor Expedice</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Konfigurace stadií a cílů planety</p>
                </div>
                <div className="ml-auto opacity-10 group-hover:opacity-20 transition-opacity">
                    <ScanLine size={32} className="text-indigo-400 rotate-12" />
                </div>
            </div>

            {/* DESTINATION SELECTION */}
            <div className="admin-card p-6 bg-black/40 border-indigo-500/20 group hover:border-indigo-500/40 transition-all">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="admin-label m-0 flex items-center gap-2">
                            <MapPin size={14} className="text-indigo-500" /> Cílová Destinace
                        </label>
                        <span className="text-[10px] font-black text-indigo-500/60 uppercase font-mono">ID: {event.planetConfig?.planetId || 'P_UNSET'}</span>
                    </div>
                    <select
                        value={event.planetConfig?.planetId ?? 'p1'}
                        onChange={(e) => updatePlanetConfig('planetId', e.target.value)}
                        className="admin-input py-4 text-xs font-black uppercase border-indigo-500/10 focus:border-indigo-500/40 cursor-pointer appearance-none"
                    >
                        <option value="p1" className="bg-zinc-900">P1 (TERRA NOVA - HABITABLE)</option>
                        <option value="p2" className="bg-zinc-900">P2 (KEPLER-186F - SCORCHED)</option>
                        <option value="p3" className="bg-zinc-900">P3 (MARS OUTPOST - COLONY)</option>
                        <option value="p4" className="bg-zinc-900">P4 (BLACK NEBULA - ANOMALY)</option>
                    </select>
                </div>
            </div>

            {/* PHASES LIST */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Layers size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Sekvence Fází</span>
                    </div>
                    <div className="h-px flex-1 mx-4 bg-white/5" />
                    <span className="text-[10px] font-black text-indigo-500 font-mono">[{event.planetConfig?.phases?.length || 0}]</span>
                </div>

                <div className="space-y-3">
                    <AnimatePresence>
                        {event.planetConfig?.phases?.map((phaseId, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="admin-card p-2 bg-black/60 flex items-center gap-3 group hover:border-indigo-500/30 transition-all border-white/5"
                            >
                                <div className="w-10 h-10 flex items-center justify-center bg-indigo-500/10 rounded-xl text-[10px] font-black text-indigo-500 font-mono border border-indigo-500/20">
                                    0{idx + 1}
                                </div>
                                <div className="flex-1 relative group/sel">
                                    <select
                                        value={phaseId}
                                        onChange={(e) => updatePhase(idx, e.target.value)}
                                        className="w-full h-10 bg-transparent text-white text-[10px] uppercase font-black px-4 outline-none border-b border-white/5 focus:border-indigo-500/40 transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-zinc-900 text-zinc-600">-- ARCHIV UDÁLOSTÍ --</option>
                                        {availableCards.map(item => (
                                            <option key={item.id} value={item.id} className="bg-zinc-900 text-white">
                                                [{item.type}] {item.title}
                                            </option>
                                        ))}
                                    </select>
                                    <Target size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-indigo-500 opacity-20 group-hover/sel:opacity-100 transition-opacity" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removePhase(idx)}
                                    className="p-3 text-zinc-700 hover:text-red-500 transition-all rounded-xl hover:bg-red-500/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {(!event.planetConfig?.phases || event.planetConfig.phases.length === 0) && (
                        <div className="text-center py-12 border border-dashed border-white/5 rounded-3xl group">
                            <Layers size={32} className="mx-auto text-zinc-800 mb-3 group-hover:text-indigo-900 transition-colors" />
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest leading-none">
                                Expedice je momentálně neaktivní
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={addPhase}
                    className="admin-button-secondary w-full py-5 rounded-3xl border-dashed border-2 flex items-center justify-center gap-3 group border-indigo-500/20 hover:border-indigo-500/40"
                >
                    <Plus size={18} className="group-hover:rotate-90 transition-all duration-500 text-indigo-500" />
                    <span className="text-indigo-400 group-hover:text-indigo-200">Definovat další logistický krok</span>
                </button>
            </div>

            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex items-start gap-4">
                <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Systémové varování</h4>
                    <p className="text-[10px] font-bold text-zinc-500 leading-relaxed">
                        Každý "Skok" spotřebovává palivo a posouvá hráče na další index fáze. Dokončení všech fází znamená dobytí planety a návrat do orbitální sekce.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlanetPanel;
