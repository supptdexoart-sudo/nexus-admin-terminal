import React from 'react';
import type { GameEvent } from '../../types';
import { Satellite, Wind, Shield, Fuel, Radio, Scan, Terminal, Activity, Layout } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpaceStationPanelProps {
    event: GameEvent;
    onUpdate: (updates: Partial<GameEvent>) => void;
}

const SpaceStationPanel: React.FC<SpaceStationPanelProps> = ({ event, onUpdate }) => {

    const updateConfig = (field: string, value: any) => {
        const currentConfig = event.stationConfig || {
            fuelReward: 50,
            repairAmount: 30,
            refillO2: true,
            welcomeMessage: "Vítejte na palubě.",
            modules: {
                shop: { enabled: true, title: "Obchodní Zóna" },
                factory: { enabled: false, title: "Výrobní Linka" },
                quarters: { enabled: true, title: "Ubytování Posádky" },
                missions: { enabled: false, title: "Mise a Úkoly" }
            }
        };

        onUpdate({
            stationConfig: {
                ...currentConfig,
                [field]: value
            }
        });
    };

    const updateModule = (moduleName: 'shop' | 'factory' | 'quarters' | 'missions', field: 'enabled' | 'title', value: any) => {
        const currentConfig = event.stationConfig || {
            fuelReward: 50, repairAmount: 30, refillO2: true, welcomeMessage: "Vítejte na palubě.",
            modules: {
                shop: { enabled: true, title: "Obchodní Zóna" },
                factory: { enabled: false, title: "Výrobní Linka" },
                quarters: { enabled: true, title: "Ubytování Posádky" },
                missions: { enabled: false, title: "Mise a Úkoly" }
            }
        };

        const currentModules = currentConfig.modules || {
            shop: { enabled: true, title: "Obchodní Zóna" },
            factory: { enabled: false, title: "Výrobní Linka" },
            quarters: { enabled: true, title: "Ubytování Posádky" },
            missions: { enabled: false, title: "Mise a Úkoly" }
        };

        onUpdate({
            stationConfig: {
                ...currentConfig,
                modules: {
                    ...currentModules,
                    [moduleName]: {
                        ...currentModules[moduleName],
                        [field]: value
                    }
                }
            }
        });
    };

    const getModuleIcon = (name: string) => {
        switch (name) {
            case 'shop': return <Terminal size={16} />;
            case 'factory': return <Activity size={16} />;
            case 'quarters': return <Shield size={16} />;
            case 'missions': return <Scan size={16} />;
            default: return <Satellite size={16} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">

            {/* SUBHEADER INDICATOR */}
            <div className="flex items-center gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
                <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400 relative z-10 shadow-neon-cyan">
                    <Satellite size={20} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Dokovací Terminál</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Konfigurace systémů orbitální stanice</p>
                </div>
                <div className="ml-auto opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={32} className="text-cyan-400" />
                </div>
            </div>

            {/* WELCOME MESSAGE */}
            <div className="admin-card p-6 bg-black/40 border-cyan-500/20 group hover:border-cyan-500/40 transition-all">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="admin-label m-0 flex items-center gap-2">
                            <Radio size={14} className="text-cyan-500" /> Komunikační Protokol
                        </label>
                        <span className="text-[10px] font-black text-cyan-500/60 uppercase font-mono tracking-tighter">OS_COMMS_INT_V4</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={event.stationConfig?.welcomeMessage ?? "Vítejte na palubě."}
                            onChange={(e) => updateConfig('welcomeMessage', e.target.value)}
                            className="admin-input py-4 pl-12 text-xs font-bold border-cyan-500/10 focus:border-cyan-500/40"
                            placeholder="Zadejte uvítačku..."
                        />
                        <Terminal size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/40 group-hover:text-cyan-500 transition-colors" />
                    </div>
                </div>
            </div>

            {/* REWARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="admin-card p-6 bg-black/40 border-orange-500/10 group hover:border-orange-500/40 transition-all relative overflow-hidden"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                        <Fuel size={80} className="text-orange-500" />
                    </div>
                    <label className="admin-label m-0 flex items-center gap-2 text-orange-400/80 mb-4">
                        <Fuel size={14} /> Doplnění Paliva
                    </label>
                    <div className="flex items-end gap-2">
                        <input
                            type="number"
                            value={event.stationConfig?.fuelReward ?? 50}
                            onChange={(e) => updateConfig('fuelReward', parseInt(e.target.value))}
                            className="bg-transparent text-4xl font-black text-white outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="mb-2 text-xs font-black text-zinc-600 uppercase tracking-widest">Jednotek</span>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="admin-card p-6 bg-black/40 border-blue-500/10 group hover:border-blue-500/40 transition-all relative overflow-hidden"
                >
                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                        <Shield size={80} className="text-blue-500" />
                    </div>
                    <label className="admin-label m-0 flex items-center gap-2 text-blue-400/80 mb-4">
                        <Shield size={14} /> Strukturální Integrita
                    </label>
                    <div className="flex items-end gap-2">
                        <input
                            type="number"
                            value={event.stationConfig?.repairAmount ?? 30}
                            onChange={(e) => updateConfig('repairAmount', parseInt(e.target.value))}
                            className="bg-transparent text-4xl font-black text-white outline-none w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="mb-2 text-xs font-black text-zinc-600 uppercase tracking-widest">HP Bonus</span>
                    </div>
                </motion.div>
            </div>

            {/* O2 REFILL */}
            <div className={`admin-card p-6 transition-all duration-500 overflow-hidden relative ${event.stationConfig?.refillO2 ? 'bg-cyan-500/10 border-cyan-500/40' : 'bg-black/40 border-white/5 opacity-60'}`}>
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl transition-all duration-500 ${event.stationConfig?.refillO2 ? 'bg-cyan-500 text-black shadow-neon-cyan' : 'bg-white/5 text-zinc-600'}`}>
                            <Wind size={24} className={event.stationConfig?.refillO2 ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-tight text-white leading-none mb-1">Doplnění Kyslíku</h4>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">Generování atmosférických směsí</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={event.stationConfig?.refillO2 ?? true}
                            onChange={(e) => updateConfig('refillO2', e.target.checked)}
                        />
                        <div className="w-14 h-7 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                </div>
            </div>

            {/* MODULES CONFIG */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-2">
                    <Layout size={14} className="text-cyan-500" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Instalované Moduly</h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {['shop', 'factory', 'quarters', 'missions'].map((modKey) => {
                        const mKey = modKey as 'shop' | 'factory' | 'quarters' | 'missions';
                        const module = event.stationConfig?.modules?.[mKey] || { enabled: false, title: modKey.toUpperCase() };

                        return (
                            <div key={mKey} className={`admin-card p-4 flex items-center justify-between transition-all ${module.enabled ? 'border-cyan-500/30 bg-cyan-500/5' : 'opacity-60 grayscale'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${module.enabled ? 'bg-cyan-500 text-black' : 'bg-white/10 text-white/40'}`}>
                                        {getModuleIcon(mKey)}
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            value={module.title}
                                            onChange={(e) => updateModule(mKey, 'title', e.target.value)}
                                            className="bg-transparent border-none p-0 text-sm font-black text-white uppercase focus:ring-0 focus:outline-none"
                                            disabled={!module.enabled}
                                        />
                                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{mKey} MODULE</span>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={module.enabled}
                                        onChange={(e) => updateModule(mKey, 'enabled', e.target.checked)}
                                    />
                                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
    );
};

export default SpaceStationPanel;
