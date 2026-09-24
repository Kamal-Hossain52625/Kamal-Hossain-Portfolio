/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, KeyRound, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { loginAdmin } from '../lib/storage';

interface AdminLoginProps {
  onSuccess: () => void;
  onBackToPortfolio: () => void;
}

export default function AdminLogin({ onSuccess, onBackToPortfolio }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please provide both administrative username and key credentials.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    // Small simulated cryptographic validation delay
    setTimeout(() => {
      const ok = loginAdmin(username, password);
      setIsSubmitting(false);
      if (ok) {
        onSuccess();
      } else {
        setError('Access denied: Invalid administrative username or passphrase.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-luxury-black bg-grid-pattern relative flex items-center justify-center p-4 md:p-8 font-sans text-white select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/3 w-[450px] h-[450px] bg-orange-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-20">
        <button
          onClick={onBackToPortfolio}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-mono text-[9px] font-bold tracking-widest uppercase transition-all cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> RETURN TO PORTFOLIO
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-[#09090c]/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
      >
        {/* Header Protocol Badge */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="font-mono text-[9px] font-extrabold tracking-[0.25em] text-orange-400 uppercase">
              SECURITY PROTOCOL // 0xAUTH
            </span>
          </div>
          <span className="text-[8px] font-mono border border-orange-500/20 px-2 py-0.5 rounded text-orange-400 font-bold uppercase">
            RESTRICTED
          </span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5 mb-6 text-left">
          <h2 className="font-sans text-2xl font-bold tracking-tight text-white uppercase">
            Admin Portal Access
          </h2>
          <p className="font-sans text-xs text-white/50 leading-relaxed font-light">
            Sign in to manage projects, review inbound client transmissions, and configure portfolio telemetry.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3.5 mb-6 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-400 font-sans"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
              ADMIN USERNAME / ID
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin or kamalhossainm5443@gmail.com"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-mono text-white outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[9px] font-mono font-bold tracking-widest text-white/40 uppercase">
              SECURITY KEY / PASSPHRASE
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 w-4 h-4 text-white/30" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 focus:border-orange-500/50 rounded-xl text-xs font-mono text-white outline-none transition-all placeholder:text-white/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-3 flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-mono text-[9px] font-extrabold tracking-widest rounded-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer uppercase shadow-2xl disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <span>ENTER ADMIN BACKEND</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center text-[9px] font-mono text-white/30 tracking-widest uppercase">
          SECURE PORTAL &bull; KAMAL HOSSAIN PORTFOLIO SYSTEM
        </div>
      </motion.div>
    </div>
  );
}
