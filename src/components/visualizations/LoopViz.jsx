import { motion, AnimatePresence } from 'framer-motion';

export default function LoopViz({ steps, currentStep }) {
  const step = steps[currentStep];
  if (!step) return null;

  const isForStart = step.action === 'for_start';
  const isForIter = step.action === 'for_iter';
  const isForEnd = step.action === 'for_end';
  const isWhile = step.action === 'while_check';

  const loopVar = step.loopVar || (isWhile ? 'condition' : null);
  const loopTotal = step.loopTotal || 0;
  const loopCurrent = step.loopCurrent ?? 0;
  const loopValues = step.loopValues || [];
  const iterValue = step.iterValue;

  // Number of bubbles to show (cap at 10)
  const displayTotal = Math.min(loopTotal, 10);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-6">
      {/* Loop header */}
      <div className="text-center">
        <motion.div
          animate={{ rotate: isForIter ? [0, 360] : 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl mb-2 inline-block"
        >
          🔁
        </motion.div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {loopVar ? `for ${loopVar} in range(${loopTotal})` : 'Loop'}
        </p>
      </div>

      {/* Iteration bubbles track */}
      {displayTotal > 0 && (
        <div className="w-full max-w-sm">
          <div className="flex flex-wrap gap-2 justify-center mb-3">
            {Array.from({ length: displayTotal }, (_, i) => {
              const isDone = i < loopCurrent;
              const isCurrent = i === loopCurrent && isForIter;
              const val = loopValues[i] !== undefined ? loopValues[i] : i;

              return (
                <motion.div
                  key={i}
                  animate={{
                    scale: isCurrent ? 1.3 : 1,
                    background: isCurrent
                      ? 'var(--accent-purple)'
                      : isDone
                        ? 'var(--accent-emerald)'
                        : 'rgba(255,255,255,0.06)',
                    boxShadow: isCurrent ? '0 0 20px rgba(139, 92, 246, 0.7)' : 'none',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold"
                  style={{
                    border: isCurrent
                      ? '2px solid var(--accent-purple)'
                      : isDone
                        ? '2px solid var(--accent-emerald)'
                        : '2px solid var(--border-subtle)',
                    color: isCurrent || isDone ? '#fff' : 'var(--text-muted)',
                  }}
                >
                  {String(val)}
                </motion.div>
              );
            })}
            {loopTotal > 10 && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs"
                style={{ color: 'var(--text-muted)', border: '2px dashed var(--border-subtle)' }}>
                ...
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))' }}
              animate={{ width: `${loopTotal > 0 ? ((loopCurrent + (isForIter ? 1 : 0)) / loopTotal) * 100 : 0}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {isForEnd ? loopTotal : loopCurrent}{isForIter ? '' : ''}/{loopTotal}
            </span>
            <span className="text-xs font-mono" style={{ color: 'var(--accent-cyan)' }}>
              {isForEnd ? '✅ Done' : isForIter ? `${loopVar} = ${iterValue}` : ''}
            </span>
          </div>
        </div>
      )}

      {/* Big counter display */}
      {isForIter && (
        <motion.div
          key={iterValue}
          initial={{ scale: 0.5, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="rounded-2xl px-8 py-4 text-center"
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '2px solid rgba(139, 92, 246, 0.4)',
          }}
        >
          <p className="text-xs font-mono mb-1" style={{ color: 'var(--text-muted)' }}>{loopVar}</p>
          <p className="font-display text-5xl font-bold gradient-text">{String(iterValue)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            Iteration {loopCurrent + 1} of {loopTotal}
          </p>
        </motion.div>
      )}

      {isForEnd && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="rounded-2xl px-8 py-4 text-center"
          style={{ background: 'rgba(16, 185, 129, 0.15)', border: '2px solid rgba(16, 185, 129, 0.4)' }}
        >
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-bold" style={{ color: 'var(--accent-emerald)' }}>Loop Complete!</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{loopTotal} iterations finished</p>
        </motion.div>
      )}

      {/* Variables */}
      {Object.keys(step.variables).length > 0 && (
        <div className="w-full max-w-sm glass rounded-xl p-3">
          <p className="text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Variables</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(step.variables).map(([k, v]) => (
              <motion.span
                key={`${k}-${v}`}
                layout
                animate={{ scale: [1.1, 1] }}
                className="font-mono text-xs px-2 py-1 rounded"
                style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-cyan)' }}
              >
                {k} = {typeof v === 'string' ? `"${v}"` : String(v)}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Output */}
      {step.output?.length > 0 && (
        <div className="w-full max-w-sm glass rounded-xl p-3 max-h-28 overflow-y-auto">
          <p className="text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>Output</p>
          {step.output.map((line, i) => (
            <p key={i} className="font-mono text-xs" style={{ color: 'var(--accent-emerald)' }}>› {line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
