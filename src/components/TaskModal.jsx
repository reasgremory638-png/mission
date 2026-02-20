import { useState, useRef, useCallback } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';
import SnakeGame from './SnakeGame';

const MIN_CHARS = 50;

export default function TaskModal({ day, onClose }) {
  const { completeDay, completeMissedDay, challenge } = useChallenge();
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [step, setStep] = useState('form'); // 'form' | 'success' | 'snake'
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  const charCount = description.length;
  const hasEnoughChars = charCount >= MIN_CHARS;
  const canSubmit = hasEnoughChars && file !== null;

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) {
        setError('الملف كبير جداً (الحد الأقصى 10MB)');
        return;
      }
      setFile(f);
      setError('');
    }
  };

  const handleComplete = useCallback(async () => {
    if (!canSubmit) return;
    setError('');

    const completionData = {
      description,
      fileName: file.name,
      fileType: file.type,
    };

    if (day.status === 'missed') {
      completeMissedDay(day.id, completionData);
    } else {
      completeDay(day.id, completionData);
    }

    setStep('success');
  }, [canSubmit, description, file, day, completeDay, completeMissedDay]);

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-sand-50 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto modal-scroll"
        dir="rtl"
      >
        {/* Snake Game Step */}
        {step === 'snake' && (
          <SnakeGame onClose={onClose} />
        )}

        {/* Success step */}
        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="text-7xl mb-4">🎉</div>
            <h2 className="font-display text-2xl font-bold text-warm-700 mb-1">أحسنت!</h2>
            <p className="text-warm-500 mb-6">اليوم {day.id} مكتمل ✅</p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep('snake')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                🐍 العب Snake كمكافأة
              </button>
              <button onClick={onClose} className="btn-ghost text-warm-500">
                تخطي اللعبة ↩
              </button>
            </div>
          </div>
        )}

        {/* Form step */}
        {step === 'form' && (
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-display text-xl font-bold text-warm-700">
                  {day.status === 'missed' ? '🔁 تعويض ' : '📝 إنجاز '}
                  اليوم {day.id}
                </h2>
                <p className="text-warm-400 text-sm">{challenge?.title}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-sand-200 rounded-xl text-warm-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-warm-600 mb-2">
                ماذا أنجزت اليوم؟ *
              </label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="اشرح بالتفصيل ماذا عملت وما الذي أنجزته اليوم... (50 حرف كحد أدنى)"
                  rows={5}
                  className="textarea-field"
                  maxLength={2000}
                />
                <div className={`absolute bottom-3 left-3 text-xs font-medium transition-colors ${
                  hasEnoughChars ? 'text-nature-600' : charCount > 30 ? 'text-sand-500' : 'text-red-400'
                }`}>
                  {charCount}/{MIN_CHARS}
                  {hasEnoughChars && <span className="mr-1">✓</span>}
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-warm-600 mb-2">
                صورة أو ملف دليل الإنجاز *
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip"
              />

              {file ? (
                <div className="flex items-center gap-3 bg-nature-50 border-2 border-nature-300 rounded-2xl p-4">
                  <CheckCircle size={24} className="text-nature-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-warm-700 font-medium text-sm truncate">{file.name}</p>
                    <p className="text-warm-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button
                    onClick={() => { setFile(null); fileInputRef.current.value = ''; }}
                    className="text-red-400 hover:text-red-600 p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-sand-300 rounded-2xl p-6 text-center hover:border-nature-400 hover:bg-nature-50 transition-all group"
                >
                  <Upload size={28} className="mx-auto mb-2 text-warm-400 group-hover:text-nature-500 transition-colors" />
                  <p className="text-warm-500 text-sm">انقر لرفع صورة أو ملف</p>
                  <p className="text-warm-300 text-xs mt-1">حد أقصى 10MB</p>
                </button>
              )}

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-sm mt-2">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="space-y-2">
              <div className="bg-sand-100 rounded-2xl p-3 space-y-1.5 text-sm mb-3">
                <div className={`flex items-center gap-2 ${hasEnoughChars ? 'text-nature-600' : 'text-warm-400'}`}>
                  <span>{hasEnoughChars ? '✅' : '⭕'}</span>
                  <span>الوصف (50+ حرف)</span>
                </div>
                <div className={`flex items-center gap-2 ${file ? 'text-nature-600' : 'text-warm-400'}`}>
                  <span>{file ? '✅' : '⭕'}</span>
                  <span>رفع ملف دليل الإنجاز</span>
                </div>
              </div>

              <button
                onClick={handleComplete}
                disabled={!canSubmit}
                className="btn-primary w-full text-base"
              >
                {canSubmit ? '🎯 تم الإنجاز!' : '⏳ أكمل الشروط أولاً'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
