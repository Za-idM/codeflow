import { motion } from 'framer-motion';

export default function IfElseViz({ steps, currentStep }) {
  const step = steps[currentStep];
  if (!step) return null;

  const isCheck = step.action === 'if_check' || step.action === 'while_check';
  const isTrue = step.action === 'if_true' || (isCheck && step.conditionResult);
  const isFalse = step.action === 'if_false' || (isCheck && !step.conditionResult);
  const isElse = step.action === 'else';
  const condition = step.condition;
  const result = step.conditionResult;

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 gap-4">
      {/* Condition box */}
      <motion.div
        layout
        className="w-full max-w-xs"
      >
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            border: `2px solid ${isCheck ? '#ec4899' : 'var(--border-subtle)'}`,
            background: isCheck ? 'rgba(236, 72, 153, 0.12)' : 'var(--bg-card)',
            boxShadow: isCheck ? '0 0 30px rgba(236, 72, 153, 0.3)' : 'none',
          }}
        >
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Condition</p>
          <p className="font-mono font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
            {condition || 'Waiting...'}
          </p>
          {isCheck && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-2 inline-block px-3 py-1 rounded-full text-sm font-bold"
              style={{
                background: result ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: result ? 'var(--accent-emerald)' : '#ef4444',
              }}
            >
              {result ? '✅ TRUE' : '❌ FALSE'}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Fork SVG */}
      <div className="relative w-full max-w-xs h-32">
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {/* Center line down */}
          <motion.line
            x1="150" y1="0" x2="150" y2="40"
            stroke="rgba(255,255,255,0.2)" strokeWidth="2"
            animate={{ stroke: isCheck ? 'rgba(236, 72, 153, 0.8)' : 'rgba(255,255,255,0.2)' }}
          />
          {/* Left branch (TRUE) */}
          <motion.path
            d="M 150 40 Q 80 60 60 90"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              stroke: (isTrue || (isCheck && result)) ? '#10b981' : 'rgba(16, 185, 129, 0.25)',
              strokeWidth: (isTrue || (isCheck && result)) ? 3 : 2,
            }}
            transition={{ duration: 0.4 }}
          />
          {/* Right branch (FALSE) */}
          <motion.path
            d="M 150 40 Q 220 60 240 90"
            fill="none"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{
              stroke: (isFalse || isElse || (isCheck && !result)) ? '#ef4444' : 'rgba(239, 68, 68, 0.25)',
              strokeWidth: (isFalse || isElse || (isCheck && !result)) ? 3 : 2,
            }}
            transition={{ duration: 0.4 }}
          />

          {/* TRUE label */}
          <text x="60" y="108" textAnchor="middle" fontSize="11" fill="rgba(16, 185, 129, 0.7)" fontFamily="Inter">TRUE</text>
          {/* FALSE label */}
          <text x="240" y="108" textAnchor="middle" fontSize="11" fill="rgba(239, 68, 68, 0.7)" fontFamily="Inter">FALSE</text>
        </svg>

        {/* Moving ball */}
        {isCheck && (
          <motion.div
            initial={{ top: 0, left: '50%', x: '-50%' }}
            animate={
              result
                ? { top: '70%', left: '20%', x: '-50%' }
                : { top: '70%', left: '80%', x: '-50%' }
            }
            transition={{ duration: 0.6, type: 'spring' }}
            className="absolute w-5 h-5 rounded-full"
            style={{
              background: result ? 'var(--accent-emerald)' : '#ef4444',
              boxShadow: result
                ? '0 0 15px rgba(16, 185, 129, 0.8)'
                : '0 0 15px rgba(239, 68, 68, 0.8)',
            }}
          />
        )}
      </div>

      {/* Outcome boxes */}
      <div className="flex gap-4 w-full max-w-xs">
        <motion.div
          animate={{
            scale: (isTrue || (isCheck && result)) ? 1.05 : 1,
            borderColor: (isTrue || (isCheck && result)) ? '#10b981' : 'rgba(255,255,255,0.08)',
          }}
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: 'rgba(16, 185, 129, 0.08)', border: '2px solid rgba(16,185,129,0.15)' }}
        >
          <p className="text-2xl">✅</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: 'var(--accent-emerald)' }}>True Path</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>if block runs</p>
        </motion.div>

        <motion.div
          animate={{
            scale: (isFalse || isElse || (isCheck && !result)) ? 1.05 : 1,
            borderColor: (isFalse || isElse || (isCheck && !result)) ? '#ef4444' : 'rgba(255,255,255,0.08)',
          }}
          className="flex-1 rounded-xl p-3 text-center"
          style={{ background: 'rgba(239, 68, 68, 0.08)', border: '2px solid rgba(239,68,68,0.15)' }}
        >
          <p className="text-2xl">❌</p>
          <p className="text-xs mt-1 font-semibold" style={{ color: '#ef4444' }}>False Path</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>else block runs</p>
        </motion.div>
      </div>

      {/* Variable state */}
      {Object.keys(step.variables).length > 0 && (
        <div className="w-full max-w-xs">
          <div className="glass rounded-xl p-3">
            <p className="text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Variables</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(step.variables).map(([k, v]) => (
                <span key={k} className="font-mono text-xs px-2 py-1 rounded"
                  style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-cyan)' }}>
                  {k} = {typeof v === 'string' ? `"${v}"` : String(v)}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
