
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { ShieldAlert, Terminal, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';
import * as apiService from '../services/apiService';
import { motion } from 'framer-motion';

interface LoginScreenProps {
    onLogin: (email: string) => void;
    onLogout?: () => void;
}

const AUTHORIZED_ADMIN = "zbynekbal97@gmail.com";

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onLogout }) => {
    const [error, setError] = useState('');

    const handleGoogleSuccess = async (credentialResponse: any) => {
        setError('');
        try {
            if (credentialResponse.credential) {
                const data = await apiService.loginWithGoogle(credentialResponse.credential);

                if (data.email.toLowerCase() === AUTHORIZED_ADMIN.toLowerCase()) {
                    onLogin(data.email);
                } else {
                    setError('PŘÍSTUP ODEPŘEN: Účet nemá administrátorská oprávnění.');
                    if (onLogout) onLogout();
                }
            }
        } catch (err: any) {
            console.error('Admin Login Failed:', err);
            setError('AUTORIZACE SELHALA: ' + (err.message || 'Chyba Google OAuth.'));
        }
    };

    return (
        <div className="h-screen w-screen bg-darker flex flex-col items-center justify-center p-6 relative overflow-hidden font-mono">
            {/* Background Tech Effects */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)]"></div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <motion.div
                    animate={{ y: ['0%', '100%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-full h-[2px] bg-primary shadow-[0_0_15px_#ff9d00]"
                />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Terminal Header */}
                <div className="bg-black/80 border-x border-t border-white/10 rounded-t-2xl p-6 text-center">
                    <div className="space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border-2 border-primary/20 mb-4">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-3xl font-black uppercase tracking-tighter text-white">
                                Admin Terminál
                            </h1>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">
                                Official Google Auth 2.0
                            </p>
                            <p className="text-[10px] text-primary/60 font-medium uppercase tracking-wider">
                                Native 2FA Protection
                            </p>
                        </div>
                    </div>
                </div>

                {/* Login Body */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-8 shadow-2xl relative min-h-[220px] flex flex-col justify-center">
                    {error && (
                        <motion.div
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="mb-8 p-4 bg-red-950/20 border border-red-500/30 flex items-start gap-3"
                        >
                            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                            <p className="text-[10px] text-red-400 font-bold leading-tight uppercase tracking-wider">{error}</p>
                        </motion.div>
                    )}

                    <div className="space-y-6">
                        <div className="flex flex-col items-center gap-2 text-center mb-4">
                            <Terminal className="w-5 h-5 text-zinc-600" />
                            <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest leading-relaxed">
                                Použijte svůj registrovaný Google účet <br />
                                <span className="text-primary">{AUTHORIZED_ADMIN}</span>
                            </p>
                        </div>

                        <div className="flex justify-center p-2 bg-white/5 border border-white/5 rounded-xl hover:border-primary/30 transition-all">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setError('GOOGLE_AUTH_REFUSED: Přihlášení bylo zrušeno.')}
                                useOneTap
                                theme="filled_black"
                                shape="rectangular"
                                width="310"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-black/40 border-x border-b border-white/10 rounded-b-2xl p-6 text-center">
                    <div className="flex items-center justify-center gap-4 text-zinc-700">
                        <div className="flex flex-col items-center">
                            <AlertTriangle size={12} className="mb-1" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Master Access Only</span>
                        </div>
                        <div className="w-px h-6 bg-white/5" />
                        <div className="flex flex-col items-center">
                            <Lock size={12} className="mb-1" />
                            <span className="text-[8px] font-bold uppercase tracking-widest">Native 2FA Protection</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginScreen;
