import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Floating hearts config: [left%, delay(s), duration(s), size(px), opacity]
const HEARTS = [
  [8,  0,   7,  18, 0.6], [18, 1.5, 9,  14, 0.5], [30,  0.5, 8,  22, 0.7],
  [42, 2,   6,  12, 0.4], [55, 0.8, 10, 16, 0.6], [65,  1.2, 7,  20, 0.5],
  [75, 0.3, 9,  13, 0.7], [85, 1.8, 8,  18, 0.5], [93,  0.6, 6,  15, 0.6],
  [22, 2.5, 7,  11, 0.4], [48, 1,   9,  24, 0.5], [70,  2.2, 8,  14, 0.6],
];

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      await login();
    } catch (e) {
      console.error('Sign-in error:', e?.code, e?.message);
      setError('Oops! Sign-in failed. Please try again 💕');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #831843 0%, #be185d 40%, #e11d48 100%)' }}>

      {/* Floating hearts background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {HEARTS.map(([left, delay, duration, size, opacity], i) => (
          <span
            key={i}
            className="absolute bottom-0 float-heart text-pink-200"
            style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s`, fontSize: size, opacity }}
          >
            ♥
          </span>
        ))}
      </div>

      {/* Soft glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-center">

          {/* Heart logo */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Heart size={42} className="text-white fill-white/80" />
          </motion.div>

          <h1 className="text-3xl font-bold text-white mb-2">Favi Packing Together</h1>

          {/* India → Costa Rica */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-white/70 text-sm font-medium">India</span>
            <div className="flex items-center gap-1">
              <div className="w-8 h-px bg-white/30" />
              <Heart size={12} className="text-pink-300 fill-pink-300" />
              <div className="w-8 h-px bg-white/30" />
            </div>
            <span className="text-4xl">🇨🇷</span>
          </div>

          <p className="text-pink-100 mb-8 text-sm leading-relaxed">
            Our little app for our big adventure together 🌎❤️<br />
            <span className="text-white/60 text-xs">Sign in to continue</span>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-300/30 rounded-xl text-red-100 text-sm">{error}</div>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-pink-50 text-rose-700 font-semibold py-3.5 px-6 rounded-2xl transition-colors shadow-lg disabled:opacity-70">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </motion.button>

          <p className="text-pink-200/60 text-xs mt-6">Made with love, just for us ❤️</p>
        </div>
      </motion.div>
    </div>
  );
}
