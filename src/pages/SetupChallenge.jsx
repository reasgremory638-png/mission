import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';
import { useAuth } from '../context/AuthContext';
import { generateChallengeWithAI } from '../lib/gemini';

const CATEGORIES = [
  { id: 'coding', label: 'البرمجة', icon: '💻' },
  { id: 'writing', label: 'الكتابة', icon: '✍️' },
  { id: 'fitness', label: 'الرياضة', icon: '💪' },
  { id: 'reading', label: 'القراءة', icon: '📚' },
  { id: 'language', label: 'تعلم لغة', icon: '🌍' },
  { id: 'art', label: 'الفن', icon: '🎨' },
  { id: 'meditation', label: 'التأمل', icon: '🧘' },
  { id: 'nutrition', label: 'التغذية', icon: '🥗' },
  { id: 'business', label: 'الأعمال', icon: '💼' },
  { id: 'music', label: 'الموسيقى', icon: '🎵' },
];

export default function SetupChallenge() {
  const { startChallenge } = useChallenge();
  const { user, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState('manual'); // 'manual' | 'ai'

  const handleGenerate = async () => {
    if (!selectedCategory) return;
    setGenerating(true);
    try {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      const result = await generateChallengeWithAI(cat.label);
      setTitle(result.title);
      setDescription(result.description);
      setMode('manual');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  const handleStart = () => {
    if (!title.trim()) return;
    startChallenge(title.trim(), description.trim(), mode === 'ai');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="#8bc34a" fillOpacity="0.12" d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,133.3C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,200L0,200Z" />
        </svg>
        {['🌲', '🌳', '🍀', '🌿'].map((em, i) => (
          <motion.span key={i} className="absolute text-3xl opacity-20"
            style={{ left: `${5 + i * 25}%`, bottom: '10%' }}
            animate={{ y: [0, -5, 0] }} transition={{ duration: 3 + i, repeat: Infinity }}>
            {em}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎯</div>
          <h1 className="font-display text-3xl font-bold text-warm-700">أهلاً {user?.name}!</h1>
          <p className="text-warm-500 mt-1">ما هو تحدي الـ 30 يوم الذي ستبدأه؟</p>
        </div>

        <div className="card-glass space-y-5">
          {/* Mode Toggle */}
          <div className="flex gap-2 bg-sand-100 rounded-2xl p-1">
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'manual' ? 'bg-white shadow text-warm-700' : 'text-warm-400'}`}
            >
              ✏️ اكتب بنفسك
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === 'ai' ? 'bg-white shadow text-warm-700' : 'text-warm-400'}`}
            >
              🤖 اختار مع AI
            </button>
          </div>

          {mode === 'ai' ? (
            <div className="space-y-4">
              <p className="text-sm text-warm-600 text-center">اختر مجالاً وسيقترح لك الـ AI تحدياً مناسباً:</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`p-3 rounded-2xl border-2 text-right flex items-center gap-2 transition-all ${
                      selectedCategory === cat.id
                        ? 'border-nature-400 bg-nature-50 text-warm-700'
                        : 'border-sand-200 bg-white text-warm-500 hover:border-nature-200'
                    }`}
                  >
                    <span className="text-xl">{cat.icon}</span>
                    <span className="text-sm font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
              <motion.button
                onClick={handleGenerate}
                disabled={!selectedCategory || generating}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {generating ? (
                  <><Loader2 size={18} className="animate-spin" /> جار التوليد...</>
                ) : (
                  <><Sparkles size={18} /> توليد التحدي</>
                )}
              </motion.button>
              {(title || description) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-nature-50 rounded-2xl p-4 border border-nature-200">
                  <p className="text-sm font-semibold text-warm-700 mb-1">✨ اقتراح AI:</p>
                  <p className="font-display font-bold text-nature-700">{title}</p>
                  <p className="text-warm-600 text-sm mt-1">{description}</p>
                  <button onClick={() => startChallenge(title, description, true)}
                    className="btn-primary mt-3 w-full text-sm">
                    ابدأ هذا التحدي 🚀
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1.5">عنوان التحدي *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="مثال: تعلم البرمجة يومياً"
                  className="input-field"
                  maxLength={80}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-600 mb-1.5">وصف التحدي (اختياري)</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="ما الذي ستفعله كل يوم؟"
                  rows={3}
                  className="textarea-field"
                />
              </div>
              <motion.button
                onClick={handleStart}
                disabled={!title.trim()}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="btn-primary w-full text-lg"
              >
                ابدأ الرحلة 🗺️
              </motion.button>
            </div>
          )}
        </div>

        <button onClick={logout} className="mt-4 text-center w-full text-warm-400 text-sm hover:text-warm-600 transition-colors">
          تسجيل الخروج
        </button>
      </motion.div>
    </div>
  );
}
