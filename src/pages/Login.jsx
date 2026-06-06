import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package2, Chrome } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login();
    } catch (e) {
      setError('Sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Package2 size={40} className="text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">Favi Packing Together</h1>
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="text-white/70 text-sm font-medium">India</span>
            <div className="flex-1 h-px bg-white/30 max-w-16" />
            <span className="text-white/70 text-sm font-medium">Moving to</span>
            <div className="flex-1 h-px bg-white/30 max-w-16" />
            <span className="text-4xl">🇨🇷</span>
          </div>

          <p className="text-blue-200 mb-8 text-sm leading-relaxed">
            Your shared relocation planner for the big move to Costa Rica. Sign in with your Google account to continue.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">{error}</div>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3.5 px-6 rounded-2xl transition-colors shadow-lg disabled:opacity-70">
            <Chrome size={20} className="text-blue-600" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>

          <p className="text-blue-300/60 text-xs mt-6">A private space for Favi</p>
        </div>
      </motion.div>
    </div>
  );
}