import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export default function XPBar() {
  const { xp, badges } = useGameStore();
  const TOTAL_XP = 1000;
  const percent = Math.min((xp / TOTAL_XP) * 100, 100);

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {/* Level badge */}
      <div
        className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full font-bold text-xs sm:text-sm"
        style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid rgba(139, 92, 246, 0.4)' }}
      >
        <span className="text-sm sm:text-base">⚡</span>
        <span style={{ color: 'var(--accent-purple)' }}>Lv.{Math.floor(xp / 200) + 1}</span>
      </div>

      {/* XP Bar — hidden on mobile */}
      <div className="hidden sm:flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>XP</span>
        <div
          className="w-24 sm:w-32 h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))' }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <span className="text-xs font-mono" style={{ color: 'var(--text-secondary)' }}>{xp}</span>
      </div>

      {/* Badge count */}
      <div
        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
        style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)' }}
      >
        <span>🏆</span>
        <span className="font-bold" style={{ color: 'var(--accent-amber)' }}>{badges.length}</span>
      </div>
    </div>
  );
}
