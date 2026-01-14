
import React, { useState, useEffect } from 'react';
import { X, Save, Rocket, FileText, Zap, Layout, Info, AlertTriangle, Fuel, Wind } from 'lucide-react';
import type { Ship } from '../../types';
import { ShipRarity } from '../../types';
import { motion } from 'framer-motion';

interface ShipCreatorProps {
    ship: Ship | null;
    onSave: (ship: Ship) => Promise<void>;
    onClose: () => void;
}

const ShipCreator: React.FC<ShipCreatorProps> = ({ ship, onSave, onClose }) => {
    const [formData, setFormData] = useState<Ship>(() => {
        if (ship) return { ...ship };

        return {
            shipId: '',
            adminEmail: '',
            name: '',
            description: '',
            imageUrl: '',
            rarity: ShipRarity.COMMON,
            slots: 2,
            baseStats: {
                hull: 100,
                fuelCapacity: 100,
                oxygenCapacity: 100
            }
        };
    });

    const [isSaving, setIsSaving] = useState(false);

    // Auto-update slots based on rarity
    useEffect(() => {
        let slots = 2;
        switch (formData.rarity) {
            case ShipRarity.COMMON: slots = 2; break;
            case ShipRarity.RARE: slots = 3; break;
            case ShipRarity.EPIC: slots = 4; break;
            case ShipRarity.LEGENDARY: slots = 5; break;
        }
        if (formData.slots !== slots) {
            setFormData(prev => ({ ...prev, slots }));
        }
    }, [formData.rarity]);

    const handleStatChange = (stat: keyof Ship['baseStats'], value: number) => {
        setFormData(prev => ({
            ...prev,
            baseStats: { ...prev.baseStats, [stat]: value }
        }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Jméno lodi je povinné!');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };

    const getRarityInfo = (rarity: ShipRarity) => {
        switch (rarity) {
            case ShipRarity.COMMON: return { color: 'text-zinc-400', desc: 'Základní trup, 2 sloty pro systémy.' };
            case ShipRarity.RARE: return { color: 'text-blue-400', desc: 'Vylepšená konstrukce, 3 sloty pro systémy.' };
            case ShipRarity.EPIC: return { color: 'text-purple-400', desc: 'Pokročilá technologie, 4 sloty pro systémy.' };
            case ShipRarity.LEGENDARY: return { color: 'text-amber-400', desc: 'Prototypová loď, 5 slotů pro systémy.' };
            default: return { color: 'text-zinc-400', desc: '' };
        }
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-4xl h-[80vh] bg-arc-panel border border-white/10 flex flex-col relative shadow-2xl rounded-3xl overflow-hidden"
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-8 bg-black/40 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl shadow-neon">
                            <Rocket className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-1">
                                {ship ? 'Upravit' : 'Vytvořit'} <span className="text-primary text-2xl">Loď</span>
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurace plavidla...</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-2xl transition-all"
                        aria-label="Zavřít formulář"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10">

                    {/* Section: Basic Info */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <FileText size={16} className="text-primary opacity-60" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Identifikace a Rarita</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <label className="admin-label">UNIKÁTNÍ ID</label>
                                <input
                                    type="text"
                                    value={formData.shipId}
                                    onChange={(e) => setFormData({ ...formData, shipId: e.target.value.toUpperCase() })}
                                    className="admin-input font-mono"
                                    placeholder="AUTO-GEN"
                                    readOnly={!!ship}
                                />
                                {!formData.shipId && !ship && (
                                    <p className="text-[10px] text-primary/40 font-bold uppercase tracking-widest mt-2 italic">Auto-generováno</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="admin-label">Název LODĚ</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="admin-input"
                                    placeholder="NAPŘ. Void Runner.."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="admin-label">Třída / Rarita</label>
                                <select
                                    value={formData.rarity}
                                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value as ShipRarity })}
                                    className="admin-input font-black uppercase tracking-widest"
                                    aria-label="Třída a rarita lodi"
                                >
                                    <option value={ShipRarity.COMMON}>COMMON</option>
                                    <option value={ShipRarity.RARE}>RARE</option>
                                    <option value={ShipRarity.EPIC}>EPIC</option>
                                    <option value={ShipRarity.LEGENDARY}>LEGENDARY</option>
                                </select>
                            </div>

                            <div className="md:col-span-3 p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-4">
                                <Info size={20} className="text-primary mt-1 shrink-0" />
                                <div>
                                    <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${getRarityInfo(formData.rarity).color}`}>
                                        Specifikace {formData.rarity}
                                    </h4>
                                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest leading-relaxed">
                                        {getRarityInfo(formData.rarity).desc} Počet slotů pro budoucí vylepšení je pevně nastaven třídou plavidla.
                                    </p>
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-2">
                                <label className="admin-label">Popis Plavidla</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="admin-input h-24 resize-none"
                                    placeholder="Zadejte technické detaily nebo lore lodi..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Stats */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-primary opacity-60" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Základní Parametry Trupu:</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'hull', label: 'Odolnost Trupu', icon: AlertTriangle, iconColor: 'text-orange-400', value: formData.baseStats.hull },
                                { id: 'fuelCapacity', label: 'Kapacita Paliva', icon: Fuel, iconColor: 'text-orange-500', value: formData.baseStats.fuelCapacity },
                                { id: 'oxygenCapacity', label: 'Kapacita O2', icon: Wind, iconColor: 'text-cyan-400', value: formData.baseStats.oxygenCapacity }
                            ].map((stat) => (
                                <div key={stat.id} className="admin-card p-4 bg-black/40 border-white/5 flex flex-col gap-4">
                                    <div className="flex items-center gap-3">
                                        <stat.icon size={18} className={stat.iconColor} />
                                        <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{stat.label}</label>
                                    </div>
                                    <input
                                        type="number"
                                        value={stat.value}
                                        onChange={(e) => handleStatChange(stat.id as any, parseInt(e.target.value) || 0)}
                                        className="bg-transparent border-none p-0 text-3xl font-black text-white focus:ring-0 w-full"
                                        aria-label={stat.label}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Slots Visualization */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Layout size={16} className="text-primary opacity-60" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Upgrade Sloty: ({formData.slots}/5)</h3>
                        </div>

                        <div className="admin-card p-8 bg-black/40 border-white/5 flex items-center justify-center gap-4">
                            {[...Array(formData.slots)].map((_, i) => (
                                <div key={i} className="w-16 h-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex flex-col items-center justify-center gap-2 shadow-neon">
                                    <Zap size={20} className="text-primary opacity-40" />
                                    <span className="text-[8px] font-black text-primary uppercase">Slot {i + 1}</span>
                                </div>
                            ))}
                            {[...Array(5 - formData.slots)].map((_, i) => (
                                <div key={i} className="w-16 h-20 rounded-2xl bg-black/40 border-2 border-white/5 flex flex-col items-center justify-center gap-2 opacity-30">
                                    <X size={20} className="text-zinc-700" />
                                    <span className="text-[8px] font-black text-zinc-700 uppercase">Zamčeno</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* FOOTER ACTIONS */}
                <div className="p-8 bg-black/60 border-t border-white/5 flex gap-4">
                    <button
                        onClick={onClose}
                        className="admin-button-secondary py-4 px-8"
                    >
                        ZRUŠIT
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="admin-button-primary flex-1 py-4 text-sm"
                    >
                        <Save size={18} />
                        {isSaving ? 'ZPRACOVÁVÁM...' : 'ULOŽIT LOĎ'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ShipCreator;
