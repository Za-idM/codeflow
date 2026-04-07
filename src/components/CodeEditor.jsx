import Editor from '@monaco-editor/react';
import { useRef } from 'react';

const PYTHON_KEYWORDS = ['print', 'if', 'elif', 'else', 'for', 'while', 'in', 'range', 'and', 'or', 'not', 'True', 'False', 'None'];

export default function CodeEditor({ code, onChange, highlightLine, readOnly = false }) {
  const editorRef = useRef(null);
  const decorationsRef = useRef([]);

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
    
    // Custom Python-lite language
    monaco.editor.defineTheme('codeflow-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: 'c084fc', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fb923c' },
        { token: 'comment', foreground: '475569', fontStyle: 'italic' },
        { token: 'identifier', foreground: 'e2e8f0' },
        { token: 'delimiter', foreground: '94a3b8' },
      ],
      colors: {
        'editor.background': '#080815',
        'editor.foreground': '#e2e8f0',
        'editor.lineHighlightBackground': '#1e1b4b40',
        'editor.selectionBackground': '#7c3aed40',
        'editor.cursor': '#8b5cf6',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#8b5cf6',
        'editorGutter.background': '#080815',
        'editorWidget.background': '#0f0f23',
        'editor.findMatchBackground': '#7c3aed60',
        'scrollbarSlider.background': '#1e293b80',
        'scrollbarSlider.hoverBackground': '#7c3aed40',
      },
    });
    monaco.editor.setTheme('codeflow-dark');
  }

  function handleEditorChange(value) {
    onChange?.(value || '');
  }

  // Highlight current line externally
  if (editorRef.current && highlightLine > 0) {
    const monaco = editorRef.current._themeService?.['_theme'] ? null : null;
    // Decorations via editor instance
    const editor = editorRef.current;
    try {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: { startLineNumber: highlightLine, startColumn: 1, endLineNumber: highlightLine, endColumn: 999 },
          options: {
            isWholeLine: true,
            className: 'line-highlight-decoration',
            glyphMarginClassName: 'line-glyph',
            overviewRuler: { color: '#8b5cf6', position: 1 },
          },
        },
      ]);
      editor.revealLineInCenter(highlightLine);
    } catch {}
  }

  return (
    <div className="h-full w-full overflow-hidden" style={{ borderRadius: 'inherit' }}>
      <Editor
        height="100%"
        defaultLanguage="python"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          fontLigatures: true,
          lineHeight: 22,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'all',
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          readOnly,
          lineNumbers: 'on',
          glyphMargin: true,
          folding: false,
          lineDecorationsWidth: 8,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderWhitespace: 'none',
          guides: { indentation: true, bracketPairs: false },
          bracketPairColorization: { enabled: true },
          automaticLayout: true,
        }}
      />
      <style>{`
        .line-highlight-decoration {
          background: linear-gradient(90deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.05) 100%) !important;
          border-left: 3px solid #8b5cf6 !important;
        }
        .line-glyph::before {
          content: '▶';
          color: #8b5cf6;
          font-size: 10px;
        }
      `}</style>
    </div>
  );
}
