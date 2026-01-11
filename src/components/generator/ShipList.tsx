
import React, { useState } from 'react';
import { Edit, Trash2, Search, ChevronRight, Rocket, Gauge, Battery, Layout } from 'lucide-react';
import type { Ship } from '../../types';
import { ShipRarity } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ShipListProps {
    ships: Ship[];
    onEdit: (ship: Ship) => void;
    onDelete: (shipId: string) => void;
    onCreate: () => void;
}

const ShipList: React.FC<ShipListProps> = ({ ships, onEdit, onDelete }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (ship: Ship) => {
        if (confirm(`Opravdu chcete smazat loď "${ship.name}"? Tuto akci nelze vzít zpět.`)) {
            onDelete(ship.shipId);
        }
    };

    const filteredShips = ships.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.shipId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRarityColor = (rarity: ShipRarity) => {
        switch (rarity) {
            case ShipRarity.COMMON: return 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10';
            case ShipRarity.RARE: return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
            case ShipRarity.EPIC: return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
            case ShipRarity.LEGENDARY: return 'text-amber-400 border-amber-500/30 bg-amber-500/10 shadow-[0_0_15px_rgba(251,191,36,0.2)]';
            default: return 'text-zinc-400 border-zinc-500/30 bg-zinc-500/10';
        }
    };

    return (
        <div className="space-y-6">
            {/* SEARCH BAR */}
            <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all max-w-md">
                <Search size={18} className="text-zinc-500 mr-3" />
                <input
                    type="text"
                    placeholder="Hledat loď..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-600 w-full p-0"
                />
            </div>

            {filteredShips.length === 0 ? (
                <div className="text-center py-32 admin-card bg-black/20 border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Rocket className="text-zinc-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest leading-none mb-2">Žádné lodě</h3>
                    <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">Zkuste vytvořit novou loď</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredShips.map((ship) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={ship.shipId}
                                className="admin-card group hover:border-primary/40 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1 min-w-0">
                                            <div className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border mb-2 ${getRarityColor(ship.rarity)}`}>
                                                {ship.rarity}
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">{ship.name}</h3>
                                            <p className="text-[10px] font-mono font-bold text-zinc-500 tracking-[0.2em] mt-1">{ship.shipId}</p>
                                        </div>
                                        <div className="flex gap-1 ml-4 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-2 lg:group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(ship); }}
                                                className="p-2 bg-white/5 hover:bg-primary/20 text-zinc-400 hover:text-primary rounded-lg transition-all"
                                                title="Upravit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(ship); }}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-all"
                                                title="Smazat"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {ship.description && (
                                        <p className="text-xs font-medium text-zinc-500 mb-6 line-clamp-2 leading-relaxed h-8">
                                            {ship.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-3 gap-2 mb-6">
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Rocket size={12} className="text-amber-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{ship.baseStats.hull}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">Hull</span>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Gauge size={12} className="text-blue-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{ship.baseStats.fuelCapacity}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">Fuel</span>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Battery size={12} className="text-emerald-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{ship.baseStats.oxygenCapacity}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">O2</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <Layout size={14} className="text-primary opacity-60" />
                                            <div className="flex gap-1">
                                                {[...Array(ship.slots)].map((_, i) => (
                                                    <div key={i} className="w-3 h-1.5 rounded-full bg-primary/40 border border-primary/20" />
                                                ))}
                                                {[...Array(5 - ship.slots)].map((_, i) => (
                                                    <div key={i} className="w-3 h-1.5 rounded-full bg-zinc-800 border border-white/5" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 transition-colors group-hover:text-primary">
                                                {ship.slots} Sloty
                                            </span>
                                            <ChevronRight size={14} className="text-zinc-700 group-hover:text-primary transition-colors" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default ShipList;
