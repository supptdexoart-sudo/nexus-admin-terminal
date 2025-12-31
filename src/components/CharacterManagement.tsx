import React, { useState, useEffect } from 'react';
import type { Character } from '../types';
import * as apiService from '../services/apiService';
import CharacterList from './generator/CharacterList';
import CharacterCreator from './generator/CharacterCreator';
import { playSound } from '../services/soundService';
import { Users, PlusCircle } from 'lucide-react';

interface CharacterManagementProps {
    userEmail: string;
    onRefreshReady?: (refreshFn: () => void) => void;
    isSyncing?: boolean;
}

const CharacterManagement: React.FC<CharacterManagementProps> = ({ userEmail, onRefreshReady, isSyncing = false }) => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
    const [showCreator, setShowCreator] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const loadCharacters = async () => {
        try {
            console.log(`🔍 [CHARACTER] Fetching characters for admin: ${userEmail}`);
            const chars = await apiService.getCharacters(userEmail);
            console.log(`✅ [CHARACTER] Fetched ${chars.length} subjects from registry.`);
            setCharacters(chars);
        } catch (e: any) {
            console.error('❌ [CHARACTER] Failed to load characters:', e.message);
        }
    };

    useEffect(() => {
        loadCharacters();
    }, [userEmail]);

    // Expose loadCharacters to parent via callback
    useEffect(() => {
        if (onRefreshReady) {
            onRefreshReady(loadCharacters);
        }
    }, [onRefreshReady]);

    const handleCreate = () => {
        setEditingCharacter(null);
        setShowCreator(true);
    };

    const handleEdit = (char: Character) => {
        setEditingCharacter(char);
        setShowCreator(true);
    };

    const handleSave = async (char: Character) => {
        try {
            await apiService.saveCharacter(userEmail, char);
            setFeedback({ message: 'Postava uložena!', type: 'success' });
            playSound('success');
            setShowCreator(false);
            // Malé zpoždění pro zajištění zápisu do DB před načtením
            await new Promise(resolve => setTimeout(resolve, 300));
            await loadCharacters();
            setTimeout(() => setFeedback(null), 3000);
        } catch (e: any) {
            setFeedback({ message: `Chyba: ${e.message}`, type: 'error' });
            playSound('error');
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const handleDelete = async (characterId: string) => {
        try {
            await apiService.deleteCharacter(userEmail, characterId);
            setFeedback({ message: 'Postava smazána.', type: 'success' });
            playSound('success');
            // Malé zpoždění pro zajištění smazání v DB
            await new Promise(resolve => setTimeout(resolve, 300));
            await loadCharacters();
            setTimeout(() => setFeedback(null), 3000);
        } catch (e: any) {
            setFeedback({ message: `Chyba: ${e.message}`, type: 'error' });
            playSound('error');
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">

            {/* HEADER ACTIONS */}
            <div className="flex items-center justify-between bg-black/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-xl shadow-neon">
                        <Users className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-1">
                            Správa <span className="text-primary">Postav</span>
                        </h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aktivní Databáze: {characters.length} Subjektů</p>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    className="admin-button-primary"
                >
                    <PlusCircle size={20} />
                    <span className="hidden sm:inline">Vytvořit Postavu</span>
                </button>
            </div>

            <div className="grid grid-cols-1">
                <CharacterList
                    characters={characters}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {showCreator && (
                <CharacterCreator
                    character={editingCharacter}
                    onSave={handleSave}
                    onClose={() => setShowCreator(false)}
                />
            )}

            {feedback && (
                <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 z-[300] px-8 py-4 rounded-2xl border-2 font-black text-xs uppercase tracking-widest animate-in slide-in-from-bottom-8 duration-300 shadow-2xl backdrop-blur-xl ${feedback.type === 'success'
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-red-500/10 border-red-500/50 text-red-400'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {feedback.message}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CharacterManagement;
