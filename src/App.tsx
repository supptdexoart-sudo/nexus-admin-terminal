import { useState, useEffect } from 'react';
import { Users, Database, Layout, ShieldCheck, ChevronRight, Search, PlusCircle, RefreshCcw } from 'lucide-react';
import Generator from './components/Generator';
import CharacterManagement from './components/CharacterManagement';
import LoginScreen from './components/LoginScreen';
import type { GameEvent } from './types';
import * as apiService from './services/apiService';
import './App.css';

type Tab = 'generator' | 'characters';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('generator');
  const [masterCatalog, setMasterCatalog] = useState<GameEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<GameEvent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('nexus_admin_user'));

  const AUTHORIZED_ADMIN = "zbynekbal97@gmail.com";

  useEffect(() => {
    if (userEmail?.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase()) {
      loadCatalog();
    }
  }, [userEmail]);

  const handleLogin = (email: string) => {
    localStorage.setItem('nexus_admin_user', email);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('nexus_admin_user');
    setUserEmail(null);
  };

  const loadCatalog = async () => {
    if (!userEmail) return;
    setIsSyncing(true);
    try {
      const catalog = await apiService.getMasterCatalog(userEmail);
      setMasterCatalog(catalog);
    } catch (e) {
      console.error("Failed to load catalog", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveCard = async (event: GameEvent) => {
    if (!userEmail) return;
    try {
      await apiService.saveCard(userEmail, event);
      // Malé zpoždění pro zajištění zápisu do DB před načtením
      await new Promise(resolve => setTimeout(resolve, 300));
      await loadCatalog();
      setEditingEvent(null);
    } catch (e) {
      console.error("Failed to save card", e);
      throw e; // Rethrow to show error in Generator
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!userEmail) return;
    try {
      await apiService.deleteCard(userEmail, id);
      // Malé zpoždění pro zajištění smazání v DB
      await new Promise(resolve => setTimeout(resolve, 300));
      await loadCatalog();
      setEditingEvent(null);
    } catch (e) {
      console.error("Failed to delete card", e);
    }
  };

  const filteredCatalog = masterCatalog.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!userEmail || userEmail.toLowerCase() !== AUTHORIZED_ADMIN.toLowerCase()) {
    return <LoginScreen onLogin={handleLogin} onLogout={handleLogout} />;
  }

  return (
    <div className="flex h-screen bg-darker text-zinc-300 font-sans selection:bg-primary/30">

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-16 lg:w-64 flex flex-col bg-black/40 border-r border-white/5 backdrop-blur-xl">
        <div className="p-4 lg:p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-neon shrink-0">
            <ShieldCheck className="text-dark w-6 h-6" />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <h1 className="text-sm font-black uppercase tracking-tighter text-white leading-none mb-1 truncate">Nexus Master</h1>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase opacity-80">Admin Terminal</span>
          </div>
        </div>

        <nav className="flex-1 px-2 lg:px-4 space-y-2 py-6">
          <button
            onClick={() => setActiveTab('generator')}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all group ${activeTab === 'generator'
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon'
              : 'hover:bg-white/5 text-zinc-500 hover:text-white border border-transparent'}`}
          >
            <Layout size={20} className={activeTab === 'generator' ? 'text-primary' : 'group-hover:text-white'} />
            <span className="hidden lg:block font-bold text-sm uppercase tracking-wide">Fabrikace</span>
          </button>

          <button
            onClick={() => setActiveTab('characters')}
            className={`w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all group ${activeTab === 'characters'
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-neon'
              : 'hover:bg-white/5 text-zinc-500 hover:text-white border border-transparent'}`}
          >
            <Users size={20} className={activeTab === 'characters' ? 'text-primary' : 'group-hover:text-white'} />
            <span className="hidden lg:block font-bold text-sm uppercase tracking-wide">Postavy</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
          >
            Odpojit Terminál
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* HEADER */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-black/20 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/5 rounded-lg hidden sm:block">
              {activeTab === 'generator' ? <Layout className="text-primary w-5 h-5" /> : <Users className="text-primary w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-tight leading-none mb-1">
                {activeTab === 'generator' ? 'Modul Fabrikace' : 'Správa Postav'}
              </h2>
              <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                Nexus Registry <ChevronRight size={10} /> {activeTab}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-lg px-3 py-2 w-48 lg:w-64 focus-within:border-primary/50 transition-all">
              <Search size={16} className="text-zinc-500" />
              <input
                type="text"
                placeholder="Hledat v registru..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs text-white placeholder:text-zinc-600 w-full"
              />
            </div>
            <button
              onClick={loadCatalog}
              disabled={isSyncing}
              className={`p-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 hover:text-primary transition-all ${isSyncing ? 'opacity-50' : ''}`}
              title="Synchronizovat s mainframe"
            >
              <RefreshCcw size={18} className={isSyncing ? 'animate-spin' : ''} />
            </button>
            {activeTab === 'generator' && (
              <button
                onClick={() => setEditingEvent(null)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all shadow-neon"
              >
                <PlusCircle size={14} /> <span className="hidden sm:inline">Nový Asset</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="flex-1 flex min-h-0">

          <section className="flex-1 overflow-y-auto no-scrollbar p-4 lg:p-8">
            {activeTab === 'generator' && (
              <Generator
                onSaveCard={handleSaveCard}
                userEmail={userEmail}
                initialData={editingEvent}
                onClearData={() => setEditingEvent(null)}
                onDelete={handleDeleteCard}
                masterCatalog={masterCatalog}
                isSyncing={isSyncing}
                onRefresh={loadCatalog}
              />
            )}
            {activeTab === 'characters' && (
              <CharacterManagement userEmail={userEmail} />
            )}
          </section>

          {/* RIGHT SIDEBAR (Catalog List) */}
          {activeTab === 'generator' && (
            <aside className="w-80 border-l border-white/5 bg-black/20 hidden xl:flex flex-col">
              <div className="p-6 border-b border-white/5 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-2">
                  <Database size={16} className="text-primary" />
                  <h3 className="font-bold text-sm text-white uppercase tracking-wider">Registr Assetů</h3>
                </div>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">{filteredCatalog.length}</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {filteredCatalog.map((item: GameEvent) => (
                  <button
                    key={item.id}
                    onClick={() => setEditingEvent(item)}
                    className={`w-full group p-4 rounded-xl transition-all border text-left flex items-center justify-between ${editingEvent?.id === item.id
                      ? 'bg-primary border-primary shadow-neon text-dark'
                      : 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10 text-zinc-300'}`}
                  >
                    <div className="flex flex-col min-w-0">
                      <span className={`text-[10px] font-black font-mono tracking-tighter mb-1 truncate ${editingEvent?.id === item.id ? 'text-dark/70' : 'text-primary'}`}>
                        {item.id}
                      </span>
                      <span className="text-sm font-bold truncate leading-tight">{item.title}</span>
                    </div>
                    <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${editingEvent?.id === item.id ? 'text-dark' : 'text-zinc-500'}`} />
                  </button>
                ))}
                {filteredCatalog.length === 0 && (
                  <div className="text-center py-20 px-8">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <Search className="text-zinc-600" size={24} />
                    </div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Žádné shody nenalezeny</p>
                  </div>
                )}
              </div>
            </aside>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
