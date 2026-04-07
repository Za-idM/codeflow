import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import { useGameStore, LEVELS } from '../store/gameStore';
import XPBar from '../components/ui/XPBar';

const DIFFICULTY_STARS = [1, 1, 2, 3, 3]; // stars per level

export default function LevelSelect() {
  const navigate = useNavigate();
  const { completedLevels, unlockedLevels, badges, xp, getBadgeInfo } = useGameStore();

  return (
    <div style={{ minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden', position: 'relative' }} className="bg-animated">
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', maxWidth: '1152px', margin: '0 auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => navigate('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer', background: 'none', border: 'none', opacity: 1 }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <ArrowLeft size={16} />
            Home
          </button>

          <div style={{ width: 1, height: 16, background: 'var(--border-subtle)' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))' }}>
              ⚡
            </div>
            <span className="font-display font-bold gradient-text">CodeFlow</span>
          </div>
        </div>

        <XPBar />
      </header>

      {/* Content */}
      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1024px', margin: '0 auto',
        padding: '32px 24px 80px',
      }}>
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: 12 }}>
            <span className="gradient-text">Choose Your Level</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {completedLevels.length}/{LEVELS.length} levels completed · {xp} XP earned
          </p>
        </motion.div>

        {/* Progress path */}
        <div className="flex flex-col gap-6">
          {LEVELS.map((level, i) => {
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = unlockedLevels.includes(level.id);
            const isLocked = !isUnlocked;
            const stars = DIFFICULTY_STARS[i];

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
              >
                {/* Connector line */}
                {i > 0 && (
                  <div className="flex justify-center mb-0 -mt-2 h-6">
                    <div
                      className="w-0.5 h-full"
                      style={{ background: isUnlocked ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.06)' }}
                    />
                  </div>
                )}

                <motion.div
                  whileHover={isUnlocked ? { scale: 1.02, y: -2 } : {}}
                  onClick={() => isUnlocked && navigate(`/playground/${level.id}`)}
                  className={`relative rounded-2xl p-6 transition-all duration-300 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                  style={{
                    background: isCompleted
                      ? `rgba(${level.color === '#10b981' ? '16,185,129' : level.color === '#8b5cf6' ? '139,92,246' : level.color === '#ec4899' ? '236,72,153' : level.color === '#06b6d4' ? '6,182,212' : '245,158,11'}, 0.08)`
                      : isUnlocked
                        ? 'var(--bg-card)'
                        : 'rgba(255,255,255,0.02)',
                    border: isCompleted
                      ? `1px solid ${level.color}40`
                      : isUnlocked
                        ? '1px solid var(--border-subtle)'
                        : '1px solid rgba(255,255,255,0.04)',
                    opacity: isLocked ? 0.5 : 1,
                  }}
                >
                  <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap">
                    {/* Level icon */}
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 relative"
                      style={{
                        background: isLocked
                          ? 'rgba(255,255,255,0.04)'
                          : `linear-gradient(135deg, ${level.color}30, ${level.color}10)`,
                        border: `2px solid ${isLocked ? 'rgba(255,255,255,0.06)' : level.color + '50'}`,
                        boxShadow: isCompleted || (!isLocked && i === unlockedLevels.length - 1)
                          ? `0 0 25px ${level.color}40`
                          : 'none',
                      }}
                    >
                      {isLocked ? '🔒' : level.icon}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full font-mono"
                          style={{ background: `${level.color}20`, color: level.color }}>
                          Level {level.id}
                        </span>
                        {/* Stars */}
                        <div className="flex gap-0.5">
                          {[...Array(3)].map((_, si) => (
                            <Star
                              key={si}
                              size={12}
                              fill={si < stars ? level.color : 'transparent'}
                              stroke={si < stars ? level.color : 'var(--text-muted)'}
                            />
                          ))}
                        </div>
                        {isCompleted && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                            style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)' }}>
                            ✅ Complete
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold mb-0.5" style={{ color: isLocked ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {level.title}
                      </h2>
                      <p className="text-sm mb-2" style={{ color: level.color }}>{level.subtitle}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {level.description}
                      </p>

                      {/* Concepts */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {level.concepts.map((c) => (
                          <span key={c} className="text-xs px-2 py-0.5 rounded font-mono"
                            style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="text-sm font-bold" style={{ color: level.color }}>
                        +{level.xpReward} XP
                      </div>
                      {isUnlocked && (
                        <motion.div
                          whileHover={{ x: 3 }}
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{
                            background: `linear-gradient(135deg, ${level.color}, ${level.color}80)`,
                            boxShadow: `0 0 15px ${level.color}50`,
                          }}
                        >
                          <ChevronRight size={18} color="#fff" />
                        </motion.div>
                      )}
                      {isLocked && (
                        <div className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ background: 'rgba(255,255,255,0.05)' }}>
                          <Lock size={16} color="var(--text-muted)" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* Badges section */}
        {badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Trophy size={20} style={{ color: 'var(--accent-amber)' }} />
              <span>Your Badges</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {badges.map((badgeId) => {
                const badge = getBadgeInfo(badgeId);
                if (!badge) return null;
                return (
                  <div
                    key={badgeId}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.25)' }}
                  >
                    <span className="text-xl">{badge.icon}</span>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--accent-amber)' }}>{badge.name}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{badge.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
