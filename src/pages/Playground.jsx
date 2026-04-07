import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Square, ChevronLeft, ChevronRight, SkipForward,
  ArrowLeft, Trophy, HelpCircle, X, CheckCircle, AlertCircle,
  BookOpen, Zap
} from 'lucide-react';
import { traceCode } from '../engine/tracer';
import { useGameStore, LEVELS } from '../store/gameStore';
import CodeEditor from '../components/CodeEditor';
import XPBar from '../components/ui/XPBar';
import BadgeModal from '../components/ui/BadgeModal';
import PrintViz from '../components/visualizations/PrintViz';
import VariableViz from '../components/visualizations/VariableViz';
import IfElseViz from '../components/visualizations/IfElseViz';
import LoopViz from '../components/visualizations/LoopViz';
import NestedViz from '../components/visualizations/NestedViz';

const STEP_DELAY = 800; // ms between cinematic steps

function VizPanel({ level, steps, currentStep }) {
  if (!steps.length) return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-6xl"
      >
        {level?.icon || '⚡'}
      </motion.div>
      <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        Press <strong style={{ color: 'var(--accent-purple)' }}>▶ Run</strong> to animate your code
      </p>
    </div>
  );

  const vizType = level?.vizType || 'variables';
  const props = { steps, currentStep };

  switch (vizType) {
    case 'print': return <PrintViz {...props} />;
    case 'variables': return <VariableViz {...props} />;
    case 'ifelse': return <IfElseViz {...props} />;
    case 'loop': return <LoopViz {...props} />;
    case 'nested': return <NestedViz {...props} />;
    default: return <VariableViz {...props} />;
  }
}

export default function Playground() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = LEVELS.find(l => l.id === Number(levelId));

  const { setCurrentLevel, incrementRunCount, completeLevel, showLevelComplete, closeLevelComplete } = useGameStore();

  const [code, setCode] = useState(level?.starterCode || '# Write your Python code here\nprint("Hello, World!")');
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [activeTab, setActiveTab] = useState('learn'); // 'learn' | 'challenge'
  const [challengeCode, setChallengeCode] = useState('');
  const [challengeResult, setChallengeResult] = useState(null); // null | 'pass' | 'fail'
  const [speed, setSpeed] = useState(STEP_DELAY);
  const [mobilePanel, setMobilePanel] = useState('editor'); // 'editor' | 'viz'

  // Responsive: detect mobile viewport
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  const playIntervalRef = useRef(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  useEffect(() => {
    if (level) {
      setCurrentLevel(level.id);
      setCode(level.starterCode);
      setChallengeCode('');
      setChallengeResult(null);
      setSteps([]);
      setCurrentStep(0);
      setError(null);
    }
  }, [levelId, level]);

  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    setIsPlaying(false);
    setIsRunning(false);
  }, []);

  const runCode = useCallback((codeToRun, isChallenge = false) => {
    stopPlayback();
    setError(null);
    setChallengeResult(null);

    const { steps: newSteps, error: traceError } = traceCode(codeToRun);

    if (traceError && newSteps.length === 0) {
      setError(traceError);
      return;
    }

    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
    setIsPlaying(true);
    incrementRunCount();
    // On mobile, auto-switch to animation panel when running
    if (isMobile) setMobilePanel('viz');

    let idx = 0;
    playIntervalRef.current = setInterval(() => {
      idx++;
      if (idx >= newSteps.length) {
        stopPlayback();
        setCurrentStep(newSteps.length - 1);
        setIsRunning(false);

        // Validate challenge
        if (isChallenge && level?.challenge) {
          const finalOutput = newSteps[newSteps.length - 1]?.output || [];
          const passed = level.challenge.validate(finalOutput);
          setChallengeResult(passed ? 'pass' : 'fail');
          if (passed) {
            completeLevel(level.id);
          }
        }
        return;
      }
      setCurrentStep(idx);
    }, speed);
  }, [stopPlayback, incrementRunCount, speed, level, completeLevel]);

  // Cleanup on unmount
  useEffect(() => () => stopPlayback(), [stopPlayback]);

  if (!level) {
    return (
      <div className="h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-bold" style={{ color: 'var(--text-secondary)' }}>Level not found</p>
        <button onClick={() => navigate('/levels')} className="px-4 py-2 rounded-xl glass">
          ← Back to Levels
        </button>
      </div>
    );
  }

  const currentStepData = steps[currentStep];
  const highlightLine = currentStepData?.line ?? -1;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-animated">
      <BadgeModal />

      {/* ── Header ─────────────────────────────────── */}
      <header
        className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(7, 7, 20, 0.9)', backdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => navigate('/levels')}
            className="flex items-center gap-1 text-xs sm:text-sm font-medium transition-opacity hover:opacity-70 shrink-0"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={14} />
            <span className="hidden xs:inline">Levels</span>
          </button>
          <div className="h-4 w-px shrink-0" style={{ background: 'var(--border-subtle)' }} />
          <div
            className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold shrink-0"
            style={{ background: `${level.color}20`, color: level.color }}
          >
            {level.icon} <span className="hidden sm:inline">Level </span>{level.id}
          </div>
          <span className="font-bold text-xs sm:text-sm truncate hidden md:block" style={{ color: 'var(--text-primary)' }}>
            {level.title}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Speed control */}
          <div className="hidden md:flex items-center gap-2">
            <Zap size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="text-xs font-mono rounded px-2 py-1"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <option value={1500}>Slow</option>
              <option value={800}>Normal</option>
              <option value={400}>Fast</option>
              <option value={150}>Turbo</option>
            </select>
          </div>
          {/* Compact speed on mobile */}
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="md:hidden text-xs rounded px-1.5 py-1"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <option value={1500}>🐢</option>
            <option value={800}>▶</option>
            <option value={400}>⚡</option>
            <option value={150}>🚀</option>
          </select>
          <XPBar />
        </div>
      </header>

      {/* ── Tabs ───────────────────────────────────── */}
      <div
        className="flex shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        {['learn', 'challenge'].map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); stopPlayback(); setSteps([]); setCurrentStep(0); setMobilePanel('editor'); }}
            className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold capitalize transition-all relative flex-1 sm:flex-none"
            style={{
              color: activeTab === tab ? level.color : 'var(--text-muted)',
              background: activeTab === tab ? `${level.color}0d` : 'transparent',
            }}
          >
            {tab === 'learn' ? '📖 Learn' : '🏆 Challenge'}
            {activeTab === tab && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: level.color }}
              />
            )}
          </button>
        ))}

        {/* Mobile panel toggle — shown inline next to tabs */}
        <div className="md:hidden flex items-center gap-1 ml-auto px-2" style={{ borderLeft: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setMobilePanel('editor')}
            className="px-2 py-1.5 rounded text-xs font-bold transition-all"
            style={{
              background: mobilePanel === 'editor' ? `${level.color}25` : 'transparent',
              color: mobilePanel === 'editor' ? level.color : 'var(--text-muted)',
            }}
          >
            {'</>'}  
          </button>
          <button
            onClick={() => setMobilePanel('viz')}
            className="px-2 py-1.5 rounded text-xs font-bold transition-all"
            style={{
              background: mobilePanel === 'viz' ? `${level.color}25` : 'transparent',
              color: mobilePanel === 'viz' ? level.color : 'var(--text-muted)',
            }}
          >
            🎬
          </button>
        </div>
      </div>

      {/* ── Main body ──────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Code editor pane */}
        <div
          className="flex flex-col shrink-0"
          style={{
            width: isMobile ? (mobilePanel === 'editor' ? '100%' : '0%') : '50%',
            overflow: 'hidden',
            borderRight: '1px solid var(--border-subtle)',
            transition: 'width 0.25s ease',
          }}
        >
          {/* Editor toolbar */}
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#28c840' }} />
              <span className="ml-2 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                {activeTab === 'learn' ? 'level' + level.id + '_learn.py' : 'challenge.py'}
              </span>
            </div>

            {/* Run / Stop button */}
            <div className="flex items-center gap-2">
              {isPlaying ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={stopPlayback}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
                >
                  <Square size={12} />
                  Stop
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => runCode(
                    activeTab === 'challenge' ? challengeCode : code,
                    activeTab === 'challenge'
                  )}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${level.color}, ${level.color}aa)`,
                    color: '#fff',
                    boxShadow: `0 0 15px ${level.color}50`,
                  }}
                >
                  <Play size={12} />
                  ▶ Run
                </motion.button>
              )}
            </div>
          </div>

          {/* Editor area */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'learn' ? (
              <CodeEditor
                code={code}
                onChange={setCode}
                highlightLine={isRunning ? highlightLine : -1}
              />
            ) : (
              <div className="h-full flex flex-col">
                {/* Challenge description */}
                <div
                  className="px-4 py-3 shrink-0"
                  style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.15)' }}
                >
                  <p className="text-sm font-bold mb-1" style={{ color: level.color }}>{level.challenge.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {level.challenge.description}
                  </p>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-xs mt-2 transition-opacity hover:opacity-80"
                    style={{ color: 'var(--accent-amber)' }}
                  >
                    <HelpCircle size={12} />
                    {showHint ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs mt-2 p-2 rounded-lg italic"
                          style={{ background: 'rgba(245, 158, 11, 0.08)', color: 'var(--accent-amber)' }}>
                          💡 {level.challenge.hint}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    code={challengeCode}
                    onChange={setChallengeCode}
                    highlightLine={isRunning ? highlightLine : -1}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-3 py-2 flex items-start gap-2 shrink-0"
                style={{ background: 'rgba(239, 68, 68, 0.1)', borderTop: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" style={{ color: '#ef4444' }} />
                <p className="text-xs font-mono" style={{ color: '#ef4444' }}>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: Visualization pane */}
        <div
          className="flex flex-col"
          style={{
            width: isMobile ? (mobilePanel === 'viz' ? '100%' : '0%') : '50%',
            overflow: 'hidden',
            transition: 'width 0.25s ease',
          }}
        >
          {/* Viz toolbar */}
          <div
            className="flex items-center justify-between px-3 py-2 shrink-0"
            style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}
          >
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
              🎬 Animation Panel
            </span>

            {steps.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  {currentStep + 1} / {steps.length}
                </span>
                {/* Manual step controls (visible when not auto-playing) */}
                {!isPlaying && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      className="w-6 h-6 rounded flex items-center justify-center transition-opacity disabled:opacity-30"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <ChevronLeft size={12} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <button
                      onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                      disabled={currentStep === steps.length - 1}
                      className="w-6 h-6 rounded flex items-center justify-center transition-opacity disabled:opacity-30"
                      style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                      <ChevronRight size={12} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                  </div>
                )}
                {isPlaying && (
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="flex items-center gap-1 text-xs font-bold"
                    style={{ color: level.color }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: level.color }} />
                    LIVE
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Main visualization */}
          <div className="flex-1 overflow-y-auto">
            <VizPanel level={level} steps={steps} currentStep={currentStep} />
          </div>

          {/* Step description bar */}
          <AnimatePresence mode="wait">
            {currentStepData && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="px-4 py-3 shrink-0"
                style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)' }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                  {currentStepData.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Challenge result overlay ─────────────── */}
      <AnimatePresence>
        {challengeResult === 'pass' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(7, 7, 20, 0.8)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.7, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-3xl p-8 text-center max-w-sm w-full mx-4"
              style={{
                background: 'rgba(10, 10, 25, 0.95)',
                border: '1px solid rgba(16, 185, 129, 0.5)',
                boxShadow: '0 0 80px rgba(16, 185, 129, 0.25)',
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.8 }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--accent-emerald)' }}>
                Challenge Complete!
              </h2>
              <p className="mb-1" style={{ color: 'var(--text-secondary)' }}>
                You earned <strong style={{ color: 'var(--accent-amber)' }}>+{level.xpReward} XP</strong>
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                {level.id < LEVELS.length ? 'Level ' + (level.id + 1) + ' unlocked!' : 'All levels complete! 🏆'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => navigate('/levels')}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
                    color: '#fff',
                  }}
                >
                  🗺️ Level Map
                </button>
                {level.id < LEVELS.length && (
                  <button
                    onClick={() => navigate(`/playground/${level.id + 1}`)}
                    className="px-5 py-2.5 rounded-xl font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                      color: '#fff',
                    }}
                  >
                    Next Level →
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {challengeResult === 'fail' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              backdropFilter: 'blur(16px)',
            }}
          >
            <AlertCircle size={18} style={{ color: '#ef4444' }} />
            <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>
              Not quite right — check your output and try again! 💪
            </p>
            <button onClick={() => setChallengeResult(null)}>
              <X size={16} style={{ color: '#ef4444' }} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
