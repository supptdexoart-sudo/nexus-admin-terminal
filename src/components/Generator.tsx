
import React, { useState, useEffect, useMemo } from 'react';
import { GameEventType } from '../types';
import type { GameEvent } from '../types';
import { Download, RotateCcw, QrCode, Trash2, Upload, AlertTriangle, Save, Skull, Database, Layout, RefreshCcw, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound, vibrate } from '../services/soundService';
import * as apiService from '../services/apiService';

// Import modular panels
import MerchantPanel from './generator/MerchantPanel';
import DilemmaPanel from './generator/DilemmaPanel';
import CombatPanel from './generator/CombatPanel';
import ItemPanel from './generator/ItemPanel';
import TrapPanel from './generator/TrapPanel';
import EnemyLootPanel from './generator/EnemyLootPanel';
import NightVariantPanel from './generator/NightVariantPanel';
import SpaceStationPanel from './generator/SpaceStationPanel';
import PlanetPanel from './generator/PlanetPanel';
import ChestPanel from './generator/ChestPanel';

interface GeneratorProps {
    onSaveCard: (event: GameEvent) => void;
    userEmail: string;
    initialData?: GameEvent | null;
    onClearData?: () => void;
    onDelete?: (id: string) => void;
    masterCatalog?: GameEvent[];
    characters?: any[];
    isSyncing?: boolean;
    onRefresh?: () => void;
}

const initialEventState: GameEvent = {
    id: '',
    title: '',
    description: '',
    type: GameEventType.ITEM,
    rarity: 'Common',
    flavorText: '',
    stats: [],
    isShareable: true,
    isConsumable: true,
    isSellOnly: false,
    canBeSaved: true,
    price: 0,
    trapConfig: { difficulty: 10, damage: 20, disarmClass: 'ANY', successMessage: "Past zneškodněna.", failMessage: "Past sklapla!" },
    enemyLoot: { goldReward: 20, dropItemChance: 0 },
    timeVariant: { enabled: false, nightStats: [] },
    stationConfig: {
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
    },
    resourceConfig: { isResourceContainer: false, resourceName: 'Surovina', resourceAmount: 1, customLabel: 'NALEZENO:' },
    craftingRecipe: { enabled: false, requiredResources: [], craftingTimeSeconds: 60 },
    planetConfig: { planetId: 'p1', landingEventType: GameEventType.ENCOUNTER, phases: [] },
    shipUpgradeConfig: { fuelCapacityBonus: 0, oxygenCapacityBonus: 0, hullCapacityBonus: 0, hullDamageReduction: 0, isDoubleJump: false, maxUses: 2 }
};

const ID_PREFIXES: Record<string, string> = {
    [GameEventType.ITEM]: 'PRE-',
    [GameEventType.ENCOUNTER]: 'SET-',
    [GameEventType.TRAP]: 'NAS-',
    [GameEventType.MERCHANT]: 'OBCH-',
    [GameEventType.DILEMA]: 'DIL-',
    [GameEventType.BOSS]: 'BOSS-',
    [GameEventType.SPACE_STATION]: 'VS-',
    [GameEventType.PLANET]: 'PLA-',
    [GameEventType.CHEST]: 'TRU-',
    [GameEventType.SHIP_UPGRADE]: 'LOD-',
};

const Generator: React.FC<GeneratorProps> = ({
    onSaveCard,
    userEmail,
    initialData,
    onClearData,
    onDelete,
    masterCatalog = [],
    characters = [],
    isSyncing = false,
    onRefresh
}) => {
    const [newEvent, setNewEvent] = useState<GameEvent>(initialEventState);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null });
    const [isEditingMode, setIsEditingMode] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isBackingUp, setIsBackingUp] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPurgeModal, setShowPurgeModal] = useState(false);

    const isIdDuplicate = useMemo(() => {
        if (!newEvent.id) return false;
        if (isEditingMode && initialData?.id === newEvent.id) return false;
        return masterCatalog.some(item => item.id.toLowerCase() === newEvent.id.toLowerCase());
    }, [newEvent.id, masterCatalog, isEditingMode, initialData]);

    useEffect(() => {
        if (initialData) {
            setNewEvent({
                ...initialEventState,
                ...initialData,
                price: (initialData.price !== undefined && initialData.price !== null) ? initialData.price : initialEventState.price,
                resourceConfig: {
                    isResourceContainer: initialData.resourceConfig?.isResourceContainer ?? false,
                    resourceName: initialData.resourceConfig?.resourceName ?? 'Surovina',
                    resourceAmount: initialData.resourceConfig?.resourceAmount ?? 1,
                    customLabel: initialData.resourceConfig?.customLabel
                },
                craftingRecipe: {
                    enabled: initialData.craftingRecipe?.enabled ?? false,
                    requiredResources: initialData.craftingRecipe?.requiredResources ?? [],
                    craftingTimeSeconds: initialData.craftingRecipe?.craftingTimeSeconds ?? 60
                },
                stationConfig: {
                    fuelReward: initialData.stationConfig?.fuelReward ?? 50,
                    repairAmount: initialData.stationConfig?.repairAmount ?? 30,
                    refillO2: initialData.stationConfig?.refillO2 ?? true,
                    welcomeMessage: initialData.stationConfig?.welcomeMessage ?? "Vítejte na palubě.",
                    modules: initialData.stationConfig?.modules ?? {
                        shop: { enabled: true, title: "Obchodní Zóna" },
                        factory: { enabled: false, title: "Výrobní Linka" },
                        quarters: { enabled: true, title: "Ubytování Posádky" },
                        missions: { enabled: false, title: "Mise a Úkoly" }
                    }
                },
                planetConfig: {
                    planetId: initialData.planetConfig?.planetId ?? 'p1',
                    landingEventType: initialData.planetConfig?.landingEventType ?? GameEventType.ENCOUNTER,
                    landingEventId: initialData.planetConfig?.landingEventId,
                    phases: initialData.planetConfig?.phases ?? []
                },
                shipUpgradeConfig: {
                    fuelCapacityBonus: initialData.shipUpgradeConfig?.fuelCapacityBonus ?? 0,
                    oxygenCapacityBonus: initialData.shipUpgradeConfig?.oxygenCapacityBonus ?? 0,
                    hullCapacityBonus: initialData.shipUpgradeConfig?.hullCapacityBonus ?? 0,
                    hullDamageReduction: initialData.shipUpgradeConfig?.hullDamageReduction ?? 0,
                    isDoubleJump: initialData.shipUpgradeConfig?.isDoubleJump ?? false,
                    maxUses: initialData.shipUpgradeConfig?.maxUses ?? 2
                },
                isSellOnly: initialData.isSellOnly ?? false
            });
            setIsEditingMode(true);
        } else {
            const prefix = ID_PREFIXES[GameEventType.ITEM];
            const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
            setNewEvent({ ...initialEventState, id: `${prefix}${randomSuffix}` });
            setIsEditingMode(false);
        }
    }, [initialData]);

    const updateEvent = (updates: Partial<GameEvent>) => setNewEvent(prev => ({ ...prev, ...updates }));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => updateEvent({ [e.target.name]: e.target.value });

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value as GameEventType;
        if (!isEditingMode) {
            const prefix = ID_PREFIXES[newType] || 'GEN-';
            const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
            updateEvent({ type: newType, id: `${prefix}${randomSuffix}` });
        } else {
            updateEvent({ type: newType });
        }
    };

    const handleDeleteClick = () => {
        if (!onDelete || !newEvent.id) return;
        playSound('error');
        vibrate(50);
        setShowDeleteModal(true);
    };

    const handlePurgeClick = () => {
        if (!newEvent.id) return;
        playSound('siren');
        vibrate([100, 100, 100]);
        setShowPurgeModal(true);
    };

    const confirmDelete = () => {
        if (onDelete && newEvent.id) {
            onDelete(newEvent.id);
            setShowDeleteModal(false);
        }
    };

    const confirmPurge = async () => {
        if (!newEvent.id) return;
        try {
            await apiService.purgeItemFromAllUsers(newEvent.id);
            setFeedback({ message: 'GLOBAL PURGE COMPLETE.', type: 'success' });
            playSound('damage');
            if (onDelete) onDelete(newEvent.id);
            setShowPurgeModal(false);
        } catch (e: any) {
            setFeedback({ message: `Purge Error: ${e.message}`, type: 'error' });
        }
    };

    const handleBackup = async () => {
        setIsBackingUp(true);
        try {
            await apiService.downloadBackup();
            setFeedback({ message: 'Backup Encrypted & Downloaded.', type: 'success' });
            playSound('success');
        } catch (e) {
            setFeedback({ message: 'Backup Failed.', type: 'error' });
            playSound('error');
        } finally {
            setIsBackingUp(false);
        }
    };

    const getQrUrl = (id: string, type: GameEventType) => {
        if (!id) return '';
        const colorMap: Record<string, string> = {
            [GameEventType.BOSS]: 'ff3b30',
            [GameEventType.TRAP]: 'f5c518',
            [GameEventType.ENCOUNTER]: 'ff3b30',
            [GameEventType.DILEMA]: '9333ea',
            [GameEventType.MERCHANT]: 'f5c518',
            [GameEventType.ITEM]: '007aff',
            [GameEventType.SPACE_STATION]: '22d3ee',
            [GameEventType.PLANET]: '6366f1',
            [GameEventType.SHIP_UPGRADE]: '6366f1'
        };
        const color = colorMap[type] || 'ffffff';
        return `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&color=${color}&bgcolor=0a0a0c&margin=20&data=${encodeURIComponent(id)}`;
    };

    const currentQrUrl = getQrUrl(newEvent.id, newEvent.type);

    const handleDownloadQr = async () => {
        if (!currentQrUrl || !newEvent.id) {
            setFeedback({ message: 'Missing Identifier.', type: 'error' });
            return;
        }
        setIsDownloading(true);
        try {
            const response = await fetch(currentQrUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const safeTitle = newEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'unnamed_asset';
            link.download = `nexus_${newEvent.type.toLowerCase()}_${safeTitle}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setFeedback({ message: 'QR Code Cached.', type: 'success' });
        } catch (e) {
            setFeedback({ message: 'Download Protocol Error.', type: 'error' });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userEmail || !newEvent.id) { setFeedback({ message: 'Identifier Missing.', type: 'error' }); return; }
        if (isIdDuplicate) { setFeedback({ message: 'CRITICAL ERROR: ID CONFLICT', type: 'error' }); playSound('error'); return; }

        try {
            const eventToSave = { ...newEvent };
            if (userEmail === 'zbynekbal97@gmail.com') eventToSave.qrCodeUrl = currentQrUrl;
            await onSaveCard(eventToSave);
            setFeedback({ message: 'Data Synced to Mainframe.', type: 'success' });
            if (!isEditingMode) {
                const prefix = ID_PREFIXES[GameEventType.ITEM];
                const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
                setNewEvent({ ...initialEventState, id: `${prefix}${randomSuffix}` });
            }
        } catch (e: any) { setFeedback({ message: e.message, type: 'error' }); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-32">

            {/* TOP ACTIONS BAR */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md gap-6 sm:gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-primary/20 p-3 rounded-lg">
                        <Layout className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tight text-white leading-none mb-1">
                            {isEditingMode ? 'Editace' : 'Nový'} <span className="text-primary">Asset</span>
                        </h1>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ID: {newEvent.id || 'NXS-TEMP'}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                    <button
                        type="button"
                        onClick={handleBackup}
                        className="p-3 bg-white/5 border border-primary/20 text-primary rounded-lg hover:bg-primary/10 transition-all shadow-neon shrink-0"
                        title="Zálohovat DB"
                    >
                        {isBackingUp ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </button>
                    {isEditingMode && (
                        <button type="button" onClick={handlePurgeClick} className="p-3 bg-red-600/10 border border-red-500/30 text-red-500 rounded-lg hover:bg-red-500/20 transition-all shadow-lg shrink-0" title="GLOBÁLNÍ ČISTKA">
                            <Skull className="w-5 h-5" />
                        </button>
                    )}
                    {isEditingMode && onDelete && (
                        <button type="button" onClick={handleDeleteClick} className="p-3 bg-white/5 border border-white/10 text-zinc-400 rounded-lg hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                    {isEditingMode && (
                        <button type="button" onClick={onClearData} className="p-3 bg-white/5 border border-white/10 text-zinc-400 rounded-lg hover:text-primary hover:bg-primary/10 transition-all shrink-0" title="Resetovat Formu">
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isSyncing}
                        className={`p-3 bg-white/5 border border-white/10 text-zinc-400 rounded-lg hover:text-primary transition-all shrink-0 ${isSyncing ? 'opacity-50' : ''}`}
                        title="Synchronizovat Data"
                    >
                        <RefreshCcw className={`w-5 h-5 ${isSyncing ? 'animate-spin text-primary' : 'text-primary/40'}`} />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 relative z-10">

                {/* MOBILE SEARCH - Sticky */}
                <div className="lg:hidden sticky top-0 z-20 bg-darker/95 backdrop-blur-md p-4 -mx-4 border-b border-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                        <input
                            type="text"
                            placeholder="Hledat asset..."
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-primary focus:outline-none transition-all"
                        />
                    </div>
                </div>

                {/* LEFT COLUMN: BASIC INFO */}
                <div className="space-y-8">
                    <div className="admin-card p-6 space-y-6">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <Database className="text-primary w-4 h-4" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Základní Identifikace</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="admin-label">Typ Předmětu</label>
                                <select
                                    name="type"
                                    value={newEvent.type}
                                    onChange={handleTypeChange}
                                    className="admin-input appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207L10%2012L15%207%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_10px_center] bg-no-repeat"
                                >
                                    {Object.values(GameEventType).map(t => <option key={t} value={t} className="bg-darker">{t}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="admin-label">Unikátní ID</label>
                                <input
                                    name="id"
                                    value={newEvent.id}
                                    onChange={handleChange}
                                    placeholder="NXS-001"
                                    className={`admin-input font-mono transition-all ${isIdDuplicate ? 'border-red-500 ring-2 ring-red-500/20 text-red-500' : ''}`}
                                    required
                                    readOnly={isEditingMode}
                                />
                                {isIdDuplicate && <p className="text-[10px] text-red-500 font-bold mt-2 uppercase flex items-center gap-1 animate-pulse"><AlertTriangle size={12} /> ID již existuje v registru</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <label className="admin-label">Název Assetu</label>
                                <input name="title" value={newEvent.title} onChange={handleChange} placeholder="VLOŽTE NÁZEV" className="admin-input text-lg font-black tracking-tight" required />
                            </div>
                            <div>
                                <label className="admin-label">Rarita</label>
                                <select name="rarity" value={newEvent.rarity} onChange={handleChange} className="admin-input uppercase font-bold text-xs">
                                    {['Common', 'Rare', 'Epic', 'Legendary'].map(r => <option key={r} value={r} className="bg-darker">{r}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="admin-label">Technická Specifikace</label>
                            <textarea name="description" value={newEvent.description} onChange={handleChange} placeholder="Zadejte technický popis předmětu..." rows={4} className="admin-input font-sans text-sm resize-none leading-relaxed" required />
                        </div>
                    </div>

                    {/* MODULAR CONTENT PANEL */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {(newEvent.type === GameEventType.ITEM || newEvent.type === GameEventType.SHIP_UPGRADE) && (
                            <ItemPanel event={newEvent} onUpdate={updateEvent} masterCatalog={masterCatalog} />
                        )}
                        {newEvent.type === GameEventType.TRAP && <TrapPanel event={newEvent} onUpdate={updateEvent} characters={characters} />}
                        {(newEvent.type === GameEventType.ENCOUNTER || newEvent.type === GameEventType.BOSS) && (
                            <div className="space-y-8">
                                <CombatPanel event={newEvent} onUpdate={updateEvent} />
                                {newEvent.type === GameEventType.ENCOUNTER && <EnemyLootPanel event={newEvent} onUpdate={updateEvent} />}
                            </div>
                        )}
                        {newEvent.type === GameEventType.MERCHANT && <MerchantPanel event={newEvent} onUpdate={updateEvent} characters={characters} masterCatalog={masterCatalog} />}
                        {newEvent.type === GameEventType.SPACE_STATION && <SpaceStationPanel event={newEvent} onUpdate={updateEvent} />}
                        {newEvent.type === GameEventType.PLANET && <PlanetPanel event={newEvent} onUpdate={updateEvent} masterCatalog={masterCatalog} />}
                        {newEvent.type === GameEventType.DILEMA && <DilemmaPanel event={newEvent} onUpdate={updateEvent} />}
                        {newEvent.type === GameEventType.CHEST && <ChestPanel event={newEvent} onUpdate={updateEvent} masterCatalog={masterCatalog} />}

                        <div className="mt-8">
                            <NightVariantPanel event={newEvent} onUpdate={updateEvent} />
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PREVIEW & ACTIONS - Responsive */}
                <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
                    <div className="admin-card p-6 bg-gradient-to-b from-primary/10 to-transparent sticky top-8">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                            <QrCode className="text-primary w-4 h-4 shadow-neon" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Identifikace!</h3>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="bg-white p-4 rounded-2xl shadow-neon-strong mb-6 transform hover:scale-105 transition-transform duration-500">
                                {newEvent.id ? (
                                    <img src={currentQrUrl} alt="QR" className="w-48 h-48 object-contain" />
                                ) : (
                                    <div className="w-48 h-48 flex items-center justify-center bg-zinc-100 rounded-xl">
                                        <QrCode className="w-16 h-16 text-zinc-300" />
                                    </div>
                                )}
                            </div>

                            <div className="w-full space-y-4">
                                <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                                    <p className="admin-label text-center mb-1 text-primary/60">ID A QR kod KARTY!!</p>
                                    <p className="text-center font-mono text-xs font-bold text-white truncate px-2">{newEvent.id || 'WAITING_FOR_ID'}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleDownloadQr}
                                    disabled={!newEvent.id || isDownloading}
                                    className="w-full admin-button-secondary text-xs"
                                >
                                    {isDownloading ? <RotateCcw className="w-4 h-4 animate-spin text-primary" /> : <Download className="w-4 h-4" />}
                                    {isDownloading ? 'PŘENÁŠÍM DATA...' : 'STÁHNOUT PNG'}
                                </button>

                                <div className="h-px bg-white/5 my-4"></div>

                                <button
                                    type="submit"
                                    disabled={isIdDuplicate}
                                    className={`w-full admin-button-primary ${isIdDuplicate ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                >
                                    <Upload className="w-5 h-5" />
                                    {isEditingMode ? 'UPDATE' : 'DEPLOY'}
                                </button>

                                {feedback.message && (
                                    <div className={`mt-4 p-3 rounded-lg border font-bold text-[10px] text-center animate-in fade-in slide-in-from-top-2 ${feedback.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                        {feedback.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>

            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div
                        {...({ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } as any)}
                        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            {...({ initial: { scale: 0.9, y: 20 }, animate: { scale: 1, y: 0 } } as any)}
                            className="bg-arc-panel border border-red-500/30 w-full max-w-sm rounded-2xl shadow-[0_0_100px_rgba(239,68,68,0.2)] overflow-hidden"
                        >
                            <div className="p-8 text-center space-y-6">
                                <div className="flex justify-center">
                                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                                        <AlertTriangle className="w-10 h-10 text-red-500" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Smazat Asset?</h3>
                                    <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">Tato akce je nevratná</p>
                                </div>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Opravdu chcete trvale odstranit tento objekt z Nexus registru?
                                </p>
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 admin-button-secondary"
                                    >
                                        ZPĚT
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="flex-1 py-3 px-6 rounded-lg bg-red-600 text-white font-black uppercase tracking-wider hover:bg-red-500 transition-all shadow-lg"
                                    >
                                        SMAZAT
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showPurgeModal && (
                    <motion.div
                        {...({ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } } as any)}
                        className="fixed inset-0 z-[250] bg-red-950/80 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            {...({ initial: { scale: 0.9, y: 20 }, animate: { scale: 1, y: 0 } } as any)}
                            className="bg-black border-2 border-red-500 w-full max-w-sm rounded-[2rem] p-1 shadow-[0_0_150px_rgba(220,38,38,0.5)]"
                        >
                            <div className="bg-arc-panel rounded-[1.8rem] p-10 text-center space-y-8 border border-white/5">
                                <div className="flex justify-center">
                                    <div className="w-24 h-24 bg-red-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl transform -rotate-6 animate-pulse">
                                        <Skull className="w-12 h-12 text-black" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 leading-none">Globální Čistka</h3>
                                    <span className="text-[10px] bg-red-600 text-black px-3 py-1 font-black rounded-full uppercase">Level 5 Authorization required</span>
                                </div>
                                <p className="text-sm text-zinc-400 font-medium leading-relaxed">
                                    Tato akce odstraní asset z Master DB i ze všech živých hráčských inventářů.
                                </p>
                                <div className="space-y-4">
                                    <button
                                        onClick={confirmPurge}
                                        className="w-full py-5 bg-red-600 text-white font-black uppercase text-sm tracking-[0.3em] rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl"
                                    >
                                        SPUSTIT ČISTKU
                                    </button>
                                    <button
                                        onClick={() => setShowPurgeModal(false)}
                                        className="w-full text-zinc-500 font-bold uppercase text-[10px] tracking-widest hover:text-white transition-colors"
                                    >
                                        ZRUŠIT OPERACI
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Generator;
