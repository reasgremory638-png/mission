import { motion } from 'framer-motion';

const STATUS_CONFIG = {
  locked: {
    bg: 'bg-warm-400/30',
    border: 'border-warm-400/40',
    text: 'text-warm-500',
    icon: '🔒',
    glow: '',
  },
  available: {
    bg: 'bg-nature-400',
    border: 'border-nature-500',
    text: 'text-white',
    icon: null,
    glow: 'day-node-available shadow-lg shadow-nature-300/50',
  },
  completed: {
    bg: 'bg-nature-600',
    border: 'border-nature-700',
    text: 'text-white',
    icon: '✅',
    glow: 'shadow-md shadow-nature-500/30',
  },
  missed: {
    bg: 'bg-red-400',
    border: 'border-red-500',
    text: 'text-white',
    icon: '❌',
    glow: '',
  },
  compensated: {
    bg: 'bg-calm-400',
    border: 'border-calm-500',
    text: 'text-white',
    icon: '🔁',
    glow: 'shadow-md shadow-calm-300/30',
  },
};

export default function LevelNode({ day, onClick, index }) {
  const config = STATUS_CONFIG[day.status] || STATUS_CONFIG.locked;
  const isClickable = day.status === 'available' || day.status === 'missed';

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.03, type: 'spring', stiffness: 200 }}
      whileHover={isClickable ? { scale: 1.15 } : {}}
      whileTap={isClickable ? { scale: 0.9 } : {}}
      onClick={() => isClickable && onClick(day)}
      disabled={!isClickable}
      title={`اليوم ${day.id}`}
      className={`
        relative w-12 h-12 rounded-full border-2 flex items-center justify-center
        font-display font-bold text-sm transition-all duration-200
        ${config.bg} ${config.border} ${config.text} ${config.glow}
        ${isClickable ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Day number or icon */}
      {config.icon ? (
        <span className="text-base">{config.icon}</span>
      ) : (
        <span>{day.id}</span>
      )}

      {/* Pulse ring for available */}
      {day.status === 'available' && (
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-nature-400"
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-warm-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
        يوم {day.id}
      </div>
    </motion.button>
  );
}
