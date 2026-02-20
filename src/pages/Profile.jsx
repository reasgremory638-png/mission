import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, LayoutDashboard, User, Camera, Save, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChallenge } from '../context/ChallengeContext';

const TIMEZONES = [
  'Asia/Riyadh', 'Asia/Baghdad', 'Asia/Dubai',
  'Africa/Cairo', 'Africa/Casablanca',
  'Europe/London', 'America/New_York', 'Asia/Kolkata', 'Asia/Tokyo',
];

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const { resetChallenge } = useChallenge();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    timezone: user?.timezone || 'Asia/Riyadh',
    password: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateUser({ avatar: ev.target.result });
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'الاسم مطلوب';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'بريد غير صحيح';
    if (form.password && form.password !== form.confirmPassword) errs.confirmPassword = 'كلمتا المرور غير متطابقتين';
    if (form.password && form.password.length < 6) errs.password = 'كلمة المرور قصيرة جداً (6 أحرف)';
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    updateUser({
      name: form.name.trim(),
      email: form.email.trim(),
      timezone: form.timezone,
      ...(form.password ? { password: form.password } : {}),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    if (!confirmReset) { setConfirmReset(true); return; }
    resetChallenge();
    setConfirmReset(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-sand-200 px-4 py-4">
        <h1 className="font-display text-xl font-bold text-warm-700 text-center">👤 حسابي</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass text-center"
        >
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 rounded-3xl bg-nature-100 border-2 border-nature-200 overflow-hidden mx-auto flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="avatar" />
              ) : (
                <span className="text-4xl">👤</span>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -left-1 w-8 h-8 bg-nature-500 text-white rounded-xl flex items-center justify-center shadow-md hover:bg-nature-600 transition-colors"
            >
              <Camera size={14} />
            </button>
            <input type="file" ref={fileRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
          </div>
          <p className="font-display font-bold text-warm-700 text-lg">{user?.name}</p>
          <p className="text-warm-400 text-sm">{user?.email}</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-4"
        >
          <h2 className="font-display font-semibold text-warm-700">المعلومات الشخصية</h2>

          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1.5">الاسم</label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              className="input-field"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={form.email}
              onChange={e => handleChange('email', e.target.value)}
              className="input-field"
              dir="ltr"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1.5">المنطقة الزمنية</label>
            <select
              value={form.timezone}
              onChange={e => handleChange('timezone', e.target.value)}
              className="input-field"
              dir="ltr"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>

          <hr className="border-sand-200" />
          <h3 className="font-medium text-warm-600 text-sm">تغيير كلمة المرور (اختياري)</h3>

          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1.5">كلمة المرور الجديدة</label>
            <input
              type="password"
              value={form.password}
              onChange={e => handleChange('password', e.target.value)}
              placeholder="اتركه فارغاً إذا لا تريد التغيير"
              className="input-field"
              dir="ltr"
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-600 mb-1.5">تأكيد كلمة المرور</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              placeholder="أعد كتابة كلمة المرور"
              className="input-field"
              dir="ltr"
            />
            {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className={`btn-primary w-full flex items-center justify-center gap-2 ${saved ? 'bg-nature-600' : ''}`}
          >
            {saved ? '✅ تم الحفظ!' : <><Save size={16} /> حفظ التغييرات</>}
          </motion.button>
        </motion.div>

        {/* Challenge management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card space-y-3"
        >
          <h2 className="font-display font-semibold text-warm-700">إدارة التحدي</h2>

          {!confirmReset ? (
            <button
              onClick={handleReset}
              className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> إعادة ضبط التحدي
            </button>
          ) : (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
              <p className="text-red-600 font-medium text-sm mb-3 text-center">⚠️ هل أنت متأكد؟ ستُحذف جميع بياناتك<br/>ولا يمكن التراجع عن هذا القرار!</p>
              <div className="flex gap-2">
                <button onClick={handleReset} className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-semibold">
                  نعم، أعد الضبط
                </button>
                <button onClick={() => setConfirmReset(false)} className="flex-1 py-2.5 bg-sand-200 text-warm-600 rounded-xl font-semibold hover:bg-sand-300">
                  إلغاء
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => { logout(); resetChallenge(); }}
            className="w-full py-3 rounded-2xl text-warm-400 font-medium hover:text-warm-600 transition-colors text-sm"
          >
            تسجيل الخروج 👋
          </button>
        </motion.div>

        {/* Theme section (future) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card opacity-60"
        >
          <h2 className="font-display font-semibold text-warm-500 mb-2">🎨 الثيم (قريباً)</h2>
          <div className="flex gap-3">
            {[
              { name: 'طبيعة', color: 'bg-nature-400', active: true },
              { name: 'غروب', color: 'bg-orange-400', active: false },
              { name: 'ليل', color: 'bg-blue-800', active: false },
              { name: 'ربيع', color: 'bg-pink-400', active: false },
            ].map(t => (
              <div key={t.name} className="text-center">
                <div className={`w-10 h-10 ${t.color} rounded-2xl mx-auto mb-1 ${t.active ? 'ring-2 ring-warm-500 ring-offset-1' : 'opacity-50'}`} />
                <p className="text-xs text-warm-400">{t.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sand-200 z-30">
        <div className="flex justify-around max-w-md mx-auto py-2">
          <Link to="/map" className="flex flex-col items-center gap-0.5 p-2 text-warm-400 hover:text-warm-600 transition-colors">
            <MapPin size={22} />
            <span className="text-xs font-medium">الخريطة</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 p-2 text-warm-400 hover:text-warm-600 transition-colors">
            <LayoutDashboard size={22} />
            <span className="text-xs font-medium">السجل</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-0.5 p-2 text-nature-600">
            <User size={22} />
            <span className="text-xs font-medium">حسابي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
