import { Link } from 'react-router-dom';
import { MapPin, LayoutDashboard, User, Clock } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ar', { day: 'numeric', month: 'short' });
}

function DayCard({ day }) {
  return (
    <div
      className={`card border-r-4 text-right ${
        day.status === 'completed' ? 'border-r-nature-500' :
        day.status === 'compensated' ? 'border-r-calm-400' :
        day.status === 'missed' ? 'border-r-red-400' : 'border-r-sand-300'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-warm-700">يوم {day.id}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              day.status === 'completed' ? 'bg-nature-100 text-nature-700' :
              day.status === 'compensated' ? 'bg-calm-100 text-calm-700' :
              'bg-red-50 text-red-500'
            }`}>
              {day.status === 'completed' ? '✅ مكتمل' :
               day.status === 'compensated' ? '🔁 معوض' : '❌ فائت'}
            </span>
          </div>
          {day.description && (
            <p className="text-warm-500 text-sm line-clamp-2">{day.description}</p>
          )}

        </div>
        <div className="text-xs text-warm-300 flex items-center gap-1 flex-shrink-0 mr-3 mt-1">
          <Clock size={10} />
          {formatDate(day.completedAt || day.missedAt)}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { challenge, stats, todayDay } = useChallenge();

  if (!challenge) return null;

  const doneDays = challenge.days.filter(d => d.status === 'completed' || d.status === 'compensated');
  const startDate = new Date(challenge.startDate);
  // Pure way to get current time for render calculation
  const daysPassed = Math.floor((new Date().setHours(0,0,0,0) - new Date(startDate).setHours(0,0,0,0)) / 86400000) + 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 pb-24" dir="rtl">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 border-b border-sand-200 px-4 py-4">
        <h1 className="font-display text-xl font-bold text-warm-700 text-center">📋 السجل اليومي</h1>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Today Status card */}
        <div
          className="card-glass"
        >
          <h2 className="font-display font-bold text-warm-700 mb-4 flex items-center gap-2">
            <span className="text-xl">📊</span> حالة التحدي
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'اليوم الحالي', value: Math.min(daysPassed, 30), icon: '📅', color: 'text-warm-700' },
              { label: 'مكتمل', value: `${stats?.completed}`, icon: '✅', color: 'text-nature-700' },
              { label: 'فائت', value: `${stats?.missed}`, icon: '❌', color: 'text-red-500' },
              { label: 'معوض', value: `${stats?.compensated}`, icon: '🔁', color: 'text-calm-600' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-3 text-center border border-sand-100">
                <div className="text-xl mb-0.5">{item.icon}</div>
                <div className={`font-display text-2xl font-bold ${item.color}`}>{item.value}</div>
                <div className="text-xs text-warm-400">{item.label}</div>
              </div>
            ))}
          </div>

          {todayDay && (
            <Link to="/map">
              <div
                className="mt-4 bg-nature-500 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer"
              >
                <div>
                  <p className="font-display font-bold text-lg">اليوم {todayDay.id} جاهز! 🎯</p>
                  <p className="text-nature-200 text-sm">انقر لإنجاز مهمة اليوم</p>
                </div>
                <span className="text-3xl">▶️</span>
              </div>
            </Link>
          )}

          {challenge.completedAll && (
            <div className="mt-4 bg-nature-50 border border-nature-200 rounded-2xl p-4 text-center">
              <div className="text-4xl mb-1">🏆</div>
              <p className="font-display font-bold text-nature-700">أتممت التحدي بنجاح!</p>
            </div>
          )}
        </div>

        {/* History List */}
        <div>
          <h2 className="font-display font-bold text-warm-700 mb-3 flex items-center gap-2">
            <span>📜</span> سجل الأيام المنجزة
          </h2>
          {doneDays.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🌱</div>
              <p className="text-warm-400">لم تنجز أي يوم بعد</p>
              <Link to="/map" className="text-nature-600 text-sm font-medium hover:underline mt-1 inline-block">
                ابدأ من الخريطة ←
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {[...doneDays].reverse().map(day => (
                <DayCard key={day.id} day={day} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sand-200 z-30">
        <div className="flex justify-around max-w-md mx-auto py-2">
          <Link to="/map" className="flex flex-col items-center gap-0.5 p-2 text-warm-400 hover:text-warm-600 transition-colors">
            <MapPin size={22} />
            <span className="text-xs font-medium">الخريطة</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 p-2 text-nature-600">
            <LayoutDashboard size={22} />
            <span className="text-xs font-medium">السجل</span>
          </Link>
          <Link to="/profile" className="flex flex-col items-center gap-0.5 p-2 text-warm-400 hover:text-warm-600 transition-colors">
            <User size={22} />
            <span className="text-xs font-medium">حسابي</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
