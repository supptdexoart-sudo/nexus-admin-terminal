
import React, { useState, useEffect, useCallback } from 'react';
import type { Ship } from '../types';
import * as apiService from '../services/apiService';
import ShipList from './generator/ShipList';
import ShipCreator from './generator/ShipCreator';
import { playSound } from '../services/soundService';
import { Rocket, PlusCircle } from 'lucide-react';

interface ShipManagementProps {
    userEmail: string;
    onRefreshReady?: (refreshFn: () => void) => void;
}

const ShipManagement: React.FC<ShipManagementProps> = ({ userEmail, onRefreshReady }) => {
    const [ships, setShips] = useState<Ship[]>([]);
    const [editingShip, setEditingShip] = useState<Ship | null>(null);
    const [showCreator, setShowCreator] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const loadShips = useCallback(async () => {
        try {
            console.log(`🔍 [SHIP] Fetching ships for admin: ${userEmail}`);
            const data = await apiService.getShips(userEmail);
            console.log(`✅ [SHIP] Fetched ${data.length} vessels.`);
            setShips(data);
        } catch (e: any) {
            console.error('❌ [SHIP] Failed to load ships:', e.message);
        }
    }, [userEmail]);

    useEffect(() => {
        loadShips();
    }, [userEmail, loadShips]);

    useEffect(() => {
        if (onRefreshReady) {
            onRefreshReady(loadShips);
        }
    }, [onRefreshReady, loadShips]);

    const handleCreate = () => {
        setEditingShip(null);
        setShowCreator(true);
    };

    const handleEdit = (ship: Ship) => {
        setEditingShip(ship);
        setShowCreator(true);
    };

    const handleSave = async (ship: Ship) => {
        try {
            // Generate ID if new
            if (!ship.shipId) {
                ship.shipId = `SHIP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            }

            await apiService.saveShip(userEmail, ship);
            setFeedback({ message: 'Loď uložena!', type: 'success' });
            playSound('success');
            setShowCreator(false);
            await new Promise(resolve => setTimeout(resolve, 300));
            await loadShips();
            setTimeout(() => setFeedback(null), 3000);
        } catch (e: any) {
            setFeedback({ message: `Chyba: ${e.message}`, type: 'error' });
            playSound('error');
            setTimeout(() => setFeedback(null), 3000);
        }
    };

    const handleDelete = async (shipId: string) => {
        try {
            await apiService.deleteShip(userEmail, shipId);
            setFeedback({ message: 'Loď smazána.', type: 'success' });
            playSound('success');
            await new Promise(resolve => setTimeout(resolve, 300));
            await loadShips();
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
                        <Rocket className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-1">
                            Fabrikace <span className="text-primary">Lodí</span>
                        </h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Aktivní Loděnice: {ships.length} Plavidel</p>
                    </div>
                </div>

                <button
                    onClick={handleCreate}
                    className="admin-button-primary"
                >
                    <PlusCircle size={20} />
                    <span className="hidden sm:inline">Vytvořit Loď</span>
                </button>
            </div>

            <div className="grid grid-cols-1">
                <ShipList
                    ships={ships}
                    onCreate={handleCreate}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {showCreator && (
                <ShipCreator
                    ship={editingShip}
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

export default ShipManagement;
