import React, { useState } from 'react';
import { X, Plus, Trash2, Save, User, FileText, Zap, Shield, Swords, Heart, Moon } from 'lucide-react';
import type { Character, CharacterPerk } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterCreatorProps {
    character: Character | null;
    onSave: (character: Character) => Promise<void>;
    onClose: () => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ character, onSave, onClose }) => {
    const [formData, setFormData] = useState<Character>(character || {
        characterId: '',
        adminEmail: '',
        name: '',
        description: '',
        imageUrl: '',
        baseStats: {
            hp: 100,
            armor: 0,
            damage: 10
        },
        perks: [],
        timeVariant: {
            enabled: false,
            nightModifiers: {
                statChanges: [],
                additionalPerks: []
            }
        }
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleStatChange = (stat: keyof Character['baseStats'], value: number) => {
        setFormData(prev => ({
            ...prev,
            baseStats: { ...prev.baseStats, [stat]: value }
        }));
    };

    const addPerk = () => {
        setFormData(prev => ({
            ...prev,
            perks: [...prev.perks, {
                name: '',
                description: '',
                effect: {
                    stat: 'damage',
                    modifier: 0,
                    condition: 'always'
                }
            }]
        }));
    };

    const updatePerk = (index: number, perk: CharacterPerk) => {
        setFormData(prev => ({
            ...prev,
            perks: prev.perks.map((p, i) => i === index ? perk : p)
        }));
    };

    const removePerk = (index: number) => {
        setFormData(prev => ({
            ...prev,
            perks: prev.perks.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!formData.name.trim()) {
            alert('Jméno postavy je povinné!');
            return;
        }
        setIsSaving(true);
        try {
            await onSave(formData);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-4xl h-[85vh] bg-arc-panel border border-white/10 flex flex-col relative shadow-2xl rounded-3xl overflow-hidden"
            >
                {/* HEADER */}
                <div className="flex justify-between items-center p-8 bg-black/40 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/20 rounded-2xl shadow-neon">
                            <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-1">
                                {character ? 'Upravit' : 'Nová'} <span className="text-primary text-2xl">Postava</span>
                            </h2>
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Konfigurace parametrů jednotky</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white rounded-2xl transition-all"
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
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Základní Identifikace</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="admin-label">Jméno Jednotky</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="admin-input"
                                    placeholder="NAPŘ. ARC-7 VANGUARD"
                                />
                            </div>

                            <div className="space-y-2 opacity-50">
                                <label className="admin-label">Systémové ID (Automaticky)</label>
                                <div className="admin-input bg-black/40 text-zinc-500 font-mono text-xs flex items-center">
                                    {character ? character.characterId : 'GENEROVÁNO PŘI ULOŽENÍ'}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="admin-label">Popis / Služební Záznam</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="admin-input h-24 resize-none"
                                    placeholder="Zadejte biografické nebo technické údaje..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section: Stats */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Zap size={16} className="text-primary opacity-60" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Bojové Parametry</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'hp', label: 'Zdraví (HP)', icon: Heart, iconColor: 'text-red-500', value: formData.baseStats.hp },
                                { id: 'armor', label: 'Brnění (ARM)', icon: Shield, iconColor: 'text-blue-500', value: formData.baseStats.armor },
                                { id: 'damage', label: 'Útok (DMG)', icon: Swords, iconColor: 'text-orange-500', value: formData.baseStats.damage }
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
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section: Perks */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Plus size={16} className="text-primary opacity-60" />
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Instalované Moduly ({formData.perks.length})</h3>
                            </div>
                            <button
                                onClick={addPerk}
                                className="admin-button-secondary py-2 px-4"
                            >
                                <Plus size={14} /> Přidat Modul
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {formData.perks.map((perk, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className="admin-card p-6 bg-black/20 group relative"
                                    >
                                        <button
                                            onClick={() => removePerk(index)}
                                            className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="admin-label">Název Modulu</label>
                                                <input
                                                    type="text"
                                                    value={perk.name}
                                                    onChange={(e) => updatePerk(index, { ...perk, name: e.target.value })}
                                                    className="admin-input text-xs font-black uppercase"
                                                    placeholder="NÁZEV MODULU"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="admin-label">Statistiky</label>
                                                    <select
                                                        value={perk.effect.stat}
                                                        onChange={(e) => updatePerk(index, { ...perk, effect: { ...perk.effect, stat: e.target.value } })}
                                                        className="admin-input text-[10px] uppercase font-bold"
                                                    >
                                                        <option value="damage">ÚTOČNÁ SÍLA</option>
                                                        <option value="hp">MAX. ZDRAVÍ</option>
                                                        <option value="armor">ODOLNOST</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="admin-label">Hodnota</label>
                                                    <input
                                                        type="number"
                                                        value={perk.effect.modifier}
                                                        onChange={(e) => updatePerk(index, { ...perk, effect: { ...perk.effect, modifier: parseFloat(e.target.value) || 0 } })}
                                                        className="admin-input text-xs font-mono font-bold text-center"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                                            <div className="space-y-2">
                                                <label className="admin-label">Efekt Modulu</label>
                                                <input
                                                    type="text"
                                                    value={perk.description}
                                                    onChange={(e) => updatePerk(index, { ...perk, description: e.target.value })}
                                                    className="admin-input text-[10px]"
                                                    placeholder="POPIS ÚČINKU MODULU PRO UŽIVATELE..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="admin-label">Aktivační Podmínka</label>
                                                <select
                                                    value={perk.effect.condition || 'always'}
                                                    onChange={(e) => updatePerk(index, { ...perk, effect: { ...perk.effect, condition: e.target.value as any } })}
                                                    className="admin-input text-[10px] uppercase font-bold"
                                                >
                                                    <option value="always">PERMANENTNÍ</option>
                                                    <option value="night">POUZE V NOCI</option>
                                                    <option value="day">POUZE VE DNE</option>
                                                    <option value="combat">POUZE V BOJI</option>
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {formData.perks.length === 0 && (
                                <div className="admin-card py-12 bg-black/20 border-dashed border-white/5 flex flex-col items-center justify-center text-zinc-600">
                                    <Plus size={24} className="mb-4 opacity-20" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">Žádné moduly nenalezeny</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section: Night Mode */}
                    <div className={`admin-card p-8 transition-all duration-500 ${formData.timeVariant?.enabled ? 'bg-primary/10 border-primary/30' : 'bg-black/40 border-white/5'}`}>
                        <label className="flex items-center gap-6 cursor-pointer group">
                            <div className={`p-4 rounded-2xl transition-all shadow-neon ${formData.timeVariant?.enabled ? 'bg-primary text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                <Moon size={24} />
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-1 ${formData.timeVariant?.enabled ? 'text-primary' : 'text-zinc-400'}`}>
                                    Noční Operace (Variantní Režim)
                                </h4>
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed">
                                    Povolit specifickou konfiguraci pro noční cyklus herního času
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={formData.timeVariant?.enabled || false}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    timeVariant: {
                                        ...formData.timeVariant!,
                                        enabled: e.target.checked
                                    }
                                })}
                                className="hidden"
                            />
                            <div className={`w-14 h-7 rounded-full p-1.5 transition-colors ${formData.timeVariant?.enabled ? 'bg-primary' : 'bg-zinc-800'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform ${formData.timeVariant?.enabled ? 'translate-x-7' : 'translate-x-0'}`}></div>
                            </div>
                        </label>
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
                        {isSaving ? 'ZPRACOVÁVÁM...' : 'ULOŽIT KONFIGURACI'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default CharacterCreator;
