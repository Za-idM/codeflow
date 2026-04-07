import { motion, AnimatePresence } from 'framer-motion';

export default function VariableViz({ steps, currentStep }) {
  const step = steps[currentStep];
  if (!step) return null;

  const vars = step.variables;
  const entries = Object.entries(vars);

  // Find which var just changed
  const prevStep = currentStep > 0 ? steps[currentStep - 1] : null;
  const changedVar = step.action === 'assign' ? step.varName : null;

  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 p-6">
      <div className="text-center mb-2">
        <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Variable Memory Boxes</p>
      </div>

      {entries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="w-20 h-20 rounded-2xl glass flex items-center justify-center text-4xl opacity-30">
            📦
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">No variables yet</p>
        </motion.div>
      ) : (
        <div className="flex flex-wrap gap-4 justify-center max-w-md">
          <AnimatePresence>
            {entries.map(([name, value]) => {
              const isChanged = name === changedVar;
              const prevVal = prevStep?.variables?.[name];
              const isNew = prevStep && !(name in prevStep.variables);

              return (
                <motion.div
                  key={name}
                  layout
                  initial={{ scale: 0.5, opacity: 0, y: 20 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    boxShadow: isChanged
                      ? '0 0 30px rgba(139, 92, 246, 0.6)'
                      : '0 0 0px rgba(139, 92, 246, 0)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  {/* Box */}
                  <div
                    className="w-32 rounded-2xl overflow-hidden"
                    style={{
                      border: isChanged
                        ? '2px solid var(--accent-purple)'
                        : '2px solid var(--border-subtle)',
                      background: isChanged
                        ? 'rgba(139, 92, 246, 0.15)'
                        : 'var(--bg-card)',
                    }}
                  >
                    {/* Label */}
                    <div
                      className="px-3 py-1.5 text-center"
                      style={{
                        background: isChanged
                          ? 'rgba(139, 92, 246, 0.3)'
                          : 'rgba(255,255,255,0.05)',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <p className="font-mono text-xs font-bold" style={{ color: 'var(--accent-cyan)' }}>
                        {name}
                      </p>
                    </div>
                    {/* Value */}
                    <div className="p-3 text-center min-h-[52px] flex items-center justify-center">
                      <motion.p
                        key={String(value)}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="font-mono font-bold text-lg break-all"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {typeof value === 'string' ? `"${value}"` : String(value)}
                      </motion.p>
                    </div>
                  </div>

                  {/* NEW badge */}
                  {isNew && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{ background: 'var(--accent-emerald)', color: '#fff' }}
                    >
                      NEW
                    </motion.div>
                  )}

                  {/* Old → new arrow */}
                  {isChanged && prevVal !== undefined && prevVal !== value && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-7 left-0 right-0 text-center"
                    >
                      <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                        was: {typeof prevVal === 'string' ? `"${prevVal}"` : String(prevVal)}
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Print output at bottom */}
      {step.output && step.output.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mt-4"
        >
          <div className="glass rounded-xl p-3">
            <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>Console Output</p>
            {step.output.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="font-mono text-sm"
                style={{ color: 'var(--accent-emerald)' }}
              >
                &gt; {line}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
