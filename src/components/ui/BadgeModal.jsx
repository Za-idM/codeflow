import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';

export default function BadgeModal() {
  const { showBadgeModal, lastBadge } = useGameStore();

  return (
    <AnimatePresence>
      {showBadgeModal && lastBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pointer-events-none"
          style={{ paddingTop: '5rem' }}
        >
          <motion.div
            initial={{ y: -60, scale: 0.5, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -40, scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="rounded-2xl p-5 flex items-center gap-4 pointer-events-auto"
            style={{
              background: 'rgba(10, 10, 25, 0.95)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 50px rgba(245, 158, 11, 0.3)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, -15, 15, -10, 10, 0] }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl"
            >
              {lastBadge.icon}
            </motion.div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-0.5"
                style={{ color: 'var(--accent-amber)' }}>
                🏆 Badge Earned!
              </p>
              <p className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{lastBadge.name}</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{lastBadge.desc}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
