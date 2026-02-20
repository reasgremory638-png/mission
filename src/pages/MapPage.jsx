import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, LayoutDashboard, User } from 'lucide-react';
import { useChallenge } from '../context/ChallengeContext';
import { useAuth } from '../context/AuthContext';
import LevelNode from '../components/LevelNode';
import ProgressBar from '../components/ProgressBar';
import TaskModal from '../components/TaskModal';

// Nature elements distributed across the map
const NATURE_ELEMENTS = [
  { icon: '🌲', pos: { top: '8%', left: '5%' }, delay: 0 },
  { icon: '🌳', pos: { top: '15%', right: '6%' }, delay: 0.3 },
  { icon: '🏔️', pos: { top: '30%', left: '3%' }, delay: 0.2 },
  { icon: '🌸', pos: { top: '45%', right: '4%' }, delay: 0.5 },
  { icon: '🌿', pos: { top: '60%', left: '4%' }, delay: 0.1 },
  { icon: '⛰️', pos: { top: '72%', right: '3%' }, delay: 0.4 },
  { icon: '🌾', pos: { top: '85%', left: '6%' }, delay: 0.2 },
  { icon: '🏡', pos: { top: '5%', right: '4%' }, delay: 0.6 },
  { icon: '☁️', pos: { top: '3%', left: '30%' }, delay: 0 },
  { icon: '☁️', pos: { top: '6%', right: '25%' }, delay: 1 },
];

// Row layout: each row has columns (1-4 nodes, alternating left/right direction)
function buildRows(days) {
  const rows = [];
  let idx = 0;
  let goRight = true;
  while (idx < days.length) {
    const rowSize = idx === 0 ? 3 : idx < 6 ? 4 : idx < 18 ? 4 : idx < 27 ? 3 : 3;
    const slice = days.slice(idx, idx + rowSize);
    rows.push({ days: goRight ? slice : [...slice].reverse(), reversed: !goRight });
    idx += rowSize;
    goRight = !goRight;
  }
  return rows;
}

export default function MapPage() {
  const { challenge, stats } = useChallenge();
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState(null);

  if (!challenge) return null;

  const rows = buildRows(challenge.days);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-light via-nature-50 to-sand-100 pb-24 relative" dir="rtl">
      {/* Nature background decorations */}
      {NATURE_ELEMENTS.map((el, i) => (
        <div
          key={i}
          className="fixed text-3xl pointer-events-none select-none opacity-25 z-0"
          style={el.pos}
        >
          {el.icon}
        </div>
      ))}

      {/* Progress bar */}
      <ProgressBar stats={stats} challengeTitle={challenge.title} />

      {/* Challenge failed banner */}
      {challenge.failed && (
        <div className="bg-red-50 border-b border-red-200 text-center py-3 px-4">
          <p className="text-red-600 font-semibold">😔 انتهى التحدي — واجهت صعوبة هذه المرة</p>
          <Link to="/setup" className="text-red-500 text-sm underline">ابدأ تحدياً جديداً</Link>
        </div>
      )}

      {/* All 30 completed banner */}
      {challenge.completedAll && (
        <div className="bg-nature-50 border-b border-nature-200 text-center py-4 px-4">
          <div className="text-4xl mb-1">🏆</div>
          <p className="text-nature-700 font-bold font-display text-lg">أتممت التحدي!</p>
          <p className="text-nature-600 text-sm">أنجزت 30 يوماً متتالياً. أنت رائع! 🌟</p>
        </div>
      )}

      {/* Map content */}
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-10">
        {/* Header info */}
        <div className="card mb-6 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-nature-100 flex items-center justify-center text-2xl flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full object-cover rounded-2xl" alt="avatar" />
            ) : '👤'}
          </div>
          <div>
            <p className="font-display font-bold text-warm-700">{user?.name}</p>
            <p className="text-warm-400 text-sm">{challenge.title}</p>
          </div>
          <div className="mr-auto text-center">
            <p className="text-2xl font-display font-bold text-nature-600">{stats?.completed + stats?.compensated || 0}</p>
            <p className="text-xs text-warm-400">/ 30 يوم</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-3 flex-wrap justify-center mb-6 text-xs text-warm-500">
          {[
            ['🔒', 'مقفل', 'text-warm-400'],
            ['🟢', 'اليوم', 'text-nature-600'],
            ['✅', 'مكتمل', 'text-nature-700'],
            ['❌', 'فائت', 'text-red-400'],
            ['🔁', 'معوض', 'text-calm-500'],
          ].map(([icon, label, color]) => (
            <span key={label} className={`flex items-center gap-1 ${color}`}>
              <span>{icon}</span>{label}
            </span>
          ))}
        </div>

        {/* Winding path rows */}
        <div className="space-y-2 relative">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx}>
              {/* Row container with winding path hint */}
              <div className={`flex items-center gap-3 ${row.reversed ? 'flex-row-reverse' : 'flex-row'} relative`}>
                {/* Path connector line */}
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-sand-300 via-sand-200 to-sand-300 rounded-full opacity-60 -translate-y-1/2 -z-10" />

                {row.days.map((day, dayIdx) => (
                  <div key={day.id} className="relative flex-1 flex justify-center">
                    <LevelNode
                      day={day}
                      index={rowIdx * 4 + dayIdx}
                      onClick={() => setSelectedDay(day)}
                    />
                  </div>
                ))}
              </div>

              {/* Connector between rows (U-turn) */}
              {rowIdx < rows.length - 1 && (
                <div className={`flex ${row.reversed ? 'justify-start pl-2' : 'justify-end pr-2'} my-1`}>
                  <div className="w-4 h-6 border-2 border-sand-300 rounded-b-full opacity-60"
                    style={{ borderTop: 'none', borderLeft: row.reversed ? '2px solid #d4a76a' : 'none', borderRight: row.reversed ? 'none' : '2px solid #d4a76a' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Missed days compensation notice */}
        {stats && stats.missed > 0 && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 font-semibold text-sm">⚠️ عندك {stats.missed} يوم فائت</p>
            <p className="text-red-400 text-xs mt-1">انقر على الأيام الحمراء لتعويضها</p>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {selectedDay && (
        <TaskModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}



      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sand-200 z-30">
        <div className="flex justify-around max-w-md mx-auto py-2">
          <Link to="/map" className="flex flex-col items-center gap-0.5 p-2 text-nature-600">
            <MapPin size={22} />
            <span className="text-xs font-medium">الخريطة</span>
          </Link>
          <Link to="/dashboard" className="flex flex-col items-center gap-0.5 p-2 text-warm-400 hover:text-warm-600 transition-colors">
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
