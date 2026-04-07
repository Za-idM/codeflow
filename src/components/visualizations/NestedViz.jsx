import { motion } from 'framer-motion';
import VariableViz from './VariableViz';
import IfElseViz from './IfElseViz';
import LoopViz from './LoopViz';
import PrintViz from './PrintViz';

// Smart combined visualization for nested logic (level 5)
export default function NestedViz({ steps, currentStep }) {
  const step = steps[currentStep];
  if (!step) return null;

  const isLoop = step.action?.startsWith('for_') || step.action?.startsWith('while_');
  const isBranch = step.action?.startsWith('if_') || step.action === 'else';
  const isAssign = step.action === 'assign';
  const isPrint = step.action === 'print';

  // Show respective visualization based on current action
  if (isLoop) return <LoopViz steps={steps} currentStep={currentStep} />;
  if (isBranch) return <IfElseViz steps={steps} currentStep={currentStep} />;
  if (isPrint) return <PrintViz steps={steps} currentStep={currentStep} />;
  if (isAssign) return <VariableViz steps={steps} currentStep={currentStep} />;

  // Default: show combined state
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-5xl"
      >
        ⚡
      </motion.div>
      <p className="font-bold text-lg gradient-text">Nested Logic</p>
      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        Combining loops + conditions to solve complex problems
      </p>

      {Object.keys(step.variables).length > 0 && (
        <div className="w-full max-w-sm glass rounded-xl p-3">
          <p className="text-xs mb-2 font-mono" style={{ color: 'var(--text-muted)' }}>Variables</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(step.variables).map(([k, v]) => (
              <span key={k} className="font-mono text-xs px-2 py-1 rounded"
                style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)' }}>
                {k} = {typeof v === 'string' ? `"${v}"` : String(v)}
              </span>
            ))}
          </div>
        </div>
      )}

      {step.output?.length > 0 && (
        <div className="w-full max-w-sm glass rounded-xl p-3 max-h-32 overflow-y-auto">
          <p className="text-xs mb-1 font-mono" style={{ color: 'var(--text-muted)' }}>Output ({step.output.length} lines)</p>
          {step.output.map((line, i) => (
            <p key={i} className="font-mono text-xs" style={{ color: 'var(--accent-emerald)' }}>› {line}</p>
          ))}
        </div>
      )}
    </div>
  );
}
