import { useState } from 'react';
import { useChallenge } from '../context/ChallengeContext';
import { useAuth } from '../context/AuthContext';

export default function SetupChallenge() {
  const { startChallenge } = useChallenge();
  const { user, logout } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleStart = () => {
    if (!title.trim()) return;
    startChallenge(title.trim(), description.trim(), false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 flex flex-col items-center justify-center p-4 relative overflow-hidden" dir="rtl">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path fill="#8bc34a" fillOpacity="0.12" d="M0,128L60,117.3C120,107,240,85,360,90.7C480,96,600,128,720,133.3C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,200L0,200Z" />
        </svg>
        {['🌲', '🌳', '🍀', '🌿'].map((em, i) => (
          <span key={i} className="absolute text-3xl opacity-20"
            style={{ left: `${5 + i * 25}%`, bottom: '10%' }}
          >
            {em}
          </span>
        ))}
      </div>

      <div
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🎯</div>
          <h1 className="font-display text-3xl font-bold text-warm-700">أهلاً {user?.name}!</h1>
          <p className="text-warm-500 mt-1">ما هو تحدي الـ 30 يوم الذي ستبدأه؟</p>
        </div>

        <div className="card-glass space-y-5">
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
              <button
                onClick={handleStart}
                disabled={!title.trim()}
                className="btn-primary w-full text-lg"
              >
                ابدأ الرحلة 🗺️
              </button>
            </div>
        </div>

        <button onClick={logout} className="mt-4 text-center w-full text-warm-400 text-sm hover:text-warm-600 transition-colors">
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
