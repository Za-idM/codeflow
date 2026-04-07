import { motion, AnimatePresence } from 'framer-motion';

export default function PrintViz({ steps, currentStep }) {
  const step = steps[currentStep];
  if (!step) return null;

  const output = step.output || [];
  const lastPrint = step.action === 'print' ? step.printValue : null;

  return (
    <div className="h-full flex flex-col gap-4 p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">📢</span>
        <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Console Output</p>
      </div>

      {/* Terminal window */}
      <div
        className="flex-1 rounded-2xl overflow-hidden"
        style={{ border: '1px solid var(--border-subtle)', background: '#0a0a15' }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="ml-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>output</span>
        </div>

        {/* Output area */}
        <div className="p-4 min-h-[200px] space-y-1">
          <AnimatePresence>
            {output.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                <span className="opacity-50">$ Run your code to see output...</span>
              </motion.p>
            ) : (
              output.map((line, i) => (
                <motion.div
                  key={`${i}-${line}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0 }}
                  className="flex items-start gap-2"
                >
                  <span className="font-mono text-sm shrink-0" style={{ color: 'var(--accent-cyan)' }}>›</span>
                  <motion.p
                    className="font-mono text-sm"
                    style={{ color: i === output.length - 1 && step.action === 'print' ? 'var(--accent-emerald)' : 'var(--text-primary)' }}
                  >
                    {line}
                  </motion.p>
                  {i === output.length - 1 && step.action === 'print' && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0"
                      style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)' }}
                    >
                      NEW
                    </motion.span>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Blinking cursor */}
          <motion.span
            className="font-mono text-sm"
            style={{ color: 'var(--accent-purple)' }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            ▊
          </motion.span>
        </div>
      </div>

      {/* Print call highlight */}
      {lastPrint !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
        >
          <span className="text-2xl">📢</span>
          <div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>print() called with:</p>
            <p className="font-mono font-bold" style={{ color: 'var(--accent-emerald)' }}>"{lastPrint}"</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
