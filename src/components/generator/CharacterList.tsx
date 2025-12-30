
import React, { useState } from 'react';
import { Edit, Trash2, QrCode, X, Search, ChevronRight, Shield, Sword, Heart } from 'lucide-react';
import type { Character } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CharacterListProps {
    characters: Character[];
    onEdit: (character: Character) => void;
    onDelete: (characterId: string) => void;
    onCreate: () => void;
}

const CharacterList: React.FC<CharacterListProps> = ({ characters, onEdit, onDelete }) => {
    const [showQR, setShowQR] = useState<Character | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDelete = (char: Character) => {
        if (confirm(`Opravdu chcete smazat postavu "${char.name}"? Tuto akci nelze vzít zpět.`)) {
            onDelete(char.characterId);
        }
    };

    const filteredCharacters = characters.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.characterId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* SEARCH BAR (In-List) */}
            <div className="flex items-center bg-black/40 border border-white/5 rounded-xl px-4 py-3 focus-within:border-primary/50 transition-all max-w-md">
                <Search size={18} className="text-zinc-500 mr-3" />
                <input
                    type="text"
                    placeholder="Hledat postavu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-600 w-full p-0"
                />
            </div>

            {filteredCharacters.length === 0 ? (
                <div className="text-center py-32 admin-card bg-black/20 border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                        <Search className="text-zinc-600" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-zinc-500 uppercase tracking-widest leading-none mb-2">Žádné shody</h3>
                    <p className="text-xs font-medium text-zinc-600 uppercase tracking-widest">Zkuste upravit parametry hledání</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredCharacters.map((char) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                key={char.characterId}
                                className="admin-card group hover:border-primary/40 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight truncate group-hover:text-primary transition-colors">{char.name}</h3>
                                            <p className="text-[10px] font-mono font-bold text-zinc-500 tracking-[0.2em] mt-1">{char.characterId}</p>
                                        </div>
                                        <div className="flex gap-1 ml-4 lg:opacity-0 lg:group-hover:opacity-100 transition-all transform lg:translate-x-2 lg:group-hover:translate-x-0">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowQR(char); }}
                                                className="p-2 bg-white/5 hover:bg-primary/20 text-zinc-400 hover:text-primary rounded-lg transition-all"
                                                title="Zobrazit QR"
                                            >
                                                <QrCode size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onEdit(char); }}
                                                className="p-2 bg-white/5 hover:bg-primary/20 text-zinc-400 hover:text-primary rounded-lg transition-all"
                                                title="Upravit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(char); }}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-all"
                                                title="Smazat"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {char.description && (
                                        <p className="text-xs font-medium text-zinc-500 mb-6 line-clamp-2 leading-relaxed h-8">
                                            {char.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Heart size={12} className="text-red-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{char.baseStats.hp}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">HP</span>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Sword size={12} className="text-orange-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{char.baseStats.damage}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">ATK</span>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center">
                                            <Shield size={12} className="text-blue-500 mb-1 opacity-60" />
                                            <span className="text-sm font-black text-white">{char.baseStats.armor}</span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase">DEF</span>
                                        </div>
                                    </div>

                                    {char.perks.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-4">
                                            {char.perks.slice(0, 3).map((perk, i) => (
                                                <span key={i} className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">
                                                    {perk.name}
                                                </span>
                                            ))}
                                            {char.perks.length > 3 && (
                                                <span className="text-[9px] font-black text-zinc-600 py-0.5 px-1">+{char.perks.length - 3}</span>
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${char.timeVariant?.enabled ? 'bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-zinc-800'}`} />
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${char.timeVariant?.enabled ? 'text-purple-500' : 'text-zinc-600'}`}>
                                                {char.timeVariant?.enabled ? 'Noční Režim' : 'Standard'}
                                            </span>
                                        </div>
                                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-primary transition-colors" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* QR Code Modal */}
            <AnimatePresence>
                {showQR && (
                    <motion.div
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                        onClick={() => setShowQR(null)}
                    >
                        <motion.div
                            layout
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-arc-panel border border-white/10 p-1 max-w-sm w-full rounded-3xl overflow-hidden shadow-2xl shadow-primary/20"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8 pb-6 flex flex-col items-center">
                                <div className="absolute top-6 right-6">
                                    <button onClick={() => setShowQR(null)} className="p-2 hover:bg-white/5 text-zinc-500 hover:text-white rounded-xl transition-all">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="p-3 bg-primary/20 rounded-2xl mb-6 mt-4">
                                    <Shield className="text-primary w-8 h-8 font-black" />
                                </div>

                                <h3 className="text-2xl font-black uppercase tracking-tight text-white mb-2 text-center">{showQR.name}</h3>
                                <p className="text-[10px] font-mono font-bold text-primary mb-8 tracking-[0.3em] uppercase opacity-70">Subjekt: {showQR.characterId}</p>

                                <div className="bg-white p-4 mb-8 rounded-2xl shadow-neon-strong">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(showQR.characterId)}`}
                                        alt="QR Code"
                                        className="w-48 h-48 object-contain"
                                    />
                                </div>

                                <button
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(showQR.characterId)}`;
                                        link.download = `${showQR.characterId}_QR.png`;
                                        link.click();
                                    }}
                                    className="w-full admin-button-primary"
                                >
                                    STÁHNOUT DATOVÝ KLÍČ
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CharacterList;
