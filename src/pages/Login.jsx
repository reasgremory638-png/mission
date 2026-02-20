import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('البريد الإلكتروني غير صحيح');
      return;
    }
    login({ name: name.trim(), email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mountains */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="#6aaf3a" fillOpacity="0.15" d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="#388e3c" fillOpacity="0.1" d="M0,256L60,245.3C120,235,240,213,360,218.7C480,224,600,256,720,261.3C840,267,960,245,1080,234.7C1200,224,1320,224,1380,224L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>

        {/* Floating elements */}
        {['🌿', '🌸', '🍃', '🌼', '✨'].map((em, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-40"
            style={{ left: `${15 + i * 18}%`, top: `${10 + (i % 3) * 15}%` }}
            animate={{ y: [-8, 8, -8], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            {em}
          </motion.div>
        ))}

        {/* Clouds */}
        <motion.div
          className="absolute top-12 left-0 opacity-60"
          animate={{ x: ['0%', '5%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-6xl">☁️</div>
        </motion.div>
        <motion.div
          className="absolute top-20 right-0 opacity-40"
          animate={{ x: ['0%', '-5%', '0%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="text-4xl">☁️</div>
        </motion.div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo / Hero */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="text-7xl mb-4 inline-block"
          >
            🗺️
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-warm-700 mb-2">Mission Path</h1>
          <p className="text-warm-500 text-lg">رحلة 30 يوم نحو عادة جديدة</p>
        </div>

        {/* Form Card */}
        <div className="card-glass">
          <h2 className="font-display text-xl font-semibold text-warm-700 mb-6 text-center">
            ابدأ رحلتك 🌱
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1.5">الاسم</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="اكتب اسمك هنا..."
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-warm-600 mb-1.5">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="input-field"
                dir="ltr"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full text-lg mt-2"
            >
              ابدأ المهمة 🚀
            </motion.button>
          </form>

          <p className="text-center text-warm-400 text-xs mt-4">
            بياناتك محفوظة محلياً على جهازك فقط 🔒
          </p>
        </div>

        {/* Feature hints */}
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {[
            { icon: '🗺️', label: 'خريطة المهام' },
            { icon: '🤖', label: 'مساعد AI' },
            { icon: '🐍', label: 'مكافأة لعبة' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-white/50 rounded-2xl p-3"
            >
              <div className="text-2xl mb-1">{f.icon}</div>
              <p className="text-xs text-warm-600 font-medium">{f.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
