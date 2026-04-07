import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Code2, Zap, ArrowRight, ChevronRight } from 'lucide-react';

const features = [
  { icon: '🎬', title: 'Cinematic Execution', desc: 'Watch code run step-by-step with beautiful animations', color: 'var(--accent-purple)' },
  { icon: '📦', title: 'Variable Visualization', desc: 'See variables as animated boxes that update live', color: 'var(--accent-cyan)' },
  { icon: '🔀', title: 'If/Else Paths', desc: 'Watch code choose a path — green for true, red for false', color: 'var(--accent-pink)' },
  { icon: '🔁', title: 'Loop Counter', desc: 'See loops iterate with a progress track and counter', color: 'var(--accent-emerald)' },
  { icon: '🏆', title: 'Gamified Progress', desc: 'Earn XP, unlock badges, and progress through 5 levels', color: 'var(--accent-amber)' },
  { icon: '🎮', title: 'Coding Challenges', desc: 'Test your knowledge with challenges after each concept', color: 'var(--accent-purple)' },
];

const codeLines = [
  { n: 1, text: '# Visualize a loop', muted: true },
  { n: 2, text: 'total = 0', color: '#94a3b8' },
  { n: 3, text: '' },
  { n: 4, text: 'for i in range(5):', highlight: true, color: '#c084fc' },
  { n: 5, text: '    total = total + i', color: '#94a3b8' },
  { n: 6, text: '    print(i)', color: '#34d399' },
  { n: 7, text: '' },
  { n: 8, text: 'print(total)', color: '#34d399' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="bg-animated"
      style={{
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      {/* Grid background */}
      <div className="bg-grid" style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }} />

      {/* ── Navbar ───────────────────────────────────── */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 24px', maxWidth: '1152px', margin: '0 auto',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
          }}>⚡</div>
          <span className="font-display font-bold gradient-text" style={{ fontSize: 18 }}>CodeFlow</span>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <button
            onClick={() => navigate('/levels')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 9999,
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 20px rgba(139,92,246,0.4)',
            }}
          >
            <Play size={13} /> Start Learning
          </button>
        </motion.div>
      </nav>

      {/* ── Hero ─────────────────────────────────────── */}
      <main style={{
        position: 'relative', zIndex: 10,
        maxWidth: '1152px', margin: '0 auto',
        padding: '40px 24px 80px',
        textAlign: 'center',
      }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>

          {/* Badge pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 16px', borderRadius: 9999, marginBottom: 24,
            background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.3)',
            color: 'var(--accent-purple)', fontSize: 14,
          }}>
            <Zap size={13} />
            <span style={{ fontWeight: 600 }}>Visual Coding Platform</span>
            <span style={{ opacity: 0.4 }}>•</span>
            <span>5 Levels · Python</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900, lineHeight: 1.1,
            marginBottom: 24, color: 'var(--text-primary)',
          }}>
            Learn to Code<br />
            <span className="gradient-text">Visually.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-secondary)', maxWidth: 600,
            margin: '0 auto 40px', lineHeight: 1.7,
          }}>
            Don't just read about loops and variables —{' '}
            <strong style={{ color: 'var(--text-primary)' }}>watch them happen.</strong>{' '}
            CodeFlow animates every step of your Python code in real time.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.button
              onClick={() => navigate('/levels')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 16,
                background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
                color: '#fff', fontWeight: 700, fontSize: 16, border: 'none', cursor: 'pointer',
                boxShadow: '0 0 40px rgba(139,92,246,0.35)',
              }}
            >
              <Play size={18} /> Start for Free <ArrowRight size={16} />
            </motion.button>

            <motion.button
              onClick={() => navigate('/playground/1')}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="glass glass-hover"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '14px 32px', borderRadius: 16,
                color: 'var(--text-primary)', fontWeight: 600, fontSize: 16,
                border: '1px solid var(--border-subtle)', cursor: 'pointer',
                background: 'transparent',
              }}
            >
              <Code2 size={18} /> Try Demo
            </motion.button>
          </div>
        </motion.div>

        {/* ── Mock Preview ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{ marginTop: 56, maxWidth: 840, marginLeft: 'auto', marginRight: 'auto' }}
        >
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: '1px solid rgba(139,92,246,0.3)',
            boxShadow: '0 0 80px rgba(139,92,246,0.12)',
          }}>
            {/* Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px',
              background: 'rgba(8,8,25,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', gap: 7 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                CodeFlow Playground
              </span>
              <div style={{
                padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700,
                background: 'rgba(16,185,129,0.2)', color: 'var(--accent-emerald)',
              }}>▶ Run</div>
            </div>

            {/* Split screen */}
            <div style={{ display: 'flex', background: '#080815', minHeight: 220, maxHeight: 260 }}>
              {/* Code pane */}
              <div style={{
                flex: 1, padding: '16px 12px',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'monospace', fontSize: 13, lineHeight: '28px',
                overflow: 'hidden',
              }}>
                {codeLines.map((line) => (
                  <div key={line.n} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: line.highlight ? 'rgba(139,92,246,0.15)' : 'transparent',
                    borderLeft: line.highlight ? '3px solid #8b5cf6' : '3px solid transparent',
                    paddingLeft: 8, marginLeft: -8,
                  }}>
                    <span style={{ width: 16, textAlign: 'right', flexShrink: 0, fontSize: 11, color: line.highlight ? '#8b5cf6' : '#334155' }}>
                      {line.n}
                    </span>
                    <span style={{ color: line.muted ? '#334155' : (line.color || '#e2e8f0') }}>{line.text}</span>
                  </div>
                ))}
              </div>

              {/* Viz pane */}
              <div style={{
                width: 200, flexShrink: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 14, padding: 16,
              }}>
                <div style={{ fontSize: 28 }}>🔁</div>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <motion.div key={i}
                      animate={{
                        background: i <= 2 ? 'var(--accent-purple)' : 'rgba(255,255,255,0.08)',
                        scale: i === 2 ? 1.3 : 1,
                      }}
                      style={{
                        width: 30, height: 30, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 12, fontWeight: 700, color: '#fff',
                      }}
                    >{i}</motion.div>
                  ))}
                </div>
                <div style={{ width: '100%', height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.06)' }}>
                  <div style={{ height: '100%', width: '60%', borderRadius: 9999, background: 'linear-gradient(90deg, var(--accent-purple), var(--accent-cyan))' }} />
                </div>
                <div style={{
                  borderRadius: 12, padding: '8px 16px', textAlign: 'center',
                  background: 'rgba(139,92,246,0.15)', border: '2px solid rgba(139,92,246,0.4)',
                }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0 }}>i</p>
                  <p className="gradient-text" style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>2</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Features grid ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            marginTop: 80,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            textAlign: 'left',
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="glass glass-hover"
              style={{ borderRadius: 20, padding: '20px', cursor: 'default' }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: f.color }}>{f.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--text-muted)', margin: 0 }}>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Bottom CTA ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ marginTop: 72, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}
        >
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-secondary)' }}>
            Ready to see code come alive? 🚀
          </p>
          <motion.button
            onClick={() => navigate('/levels')}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', borderRadius: 16,
              background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))',
              color: '#fff', fontWeight: 700, fontSize: 17, border: 'none', cursor: 'pointer',
              boxShadow: '0 0 40px rgba(139,92,246,0.4)',
            }}
          >
            Begin Your Journey <ChevronRight size={18} />
          </motion.button>
        </motion.div>
      </main>
    </div>
  );
}
