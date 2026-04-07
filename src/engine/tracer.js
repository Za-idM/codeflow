/**
 * CodeFlow Python Pseudocode Tracer
 * Parses simple Python-style code and produces step-by-step execution traces
 * Supports: print(), variable assignment, if/elif/else, for loops, while loops, nested logic
 */

// Tokenizer
function tokenize(code) {
  const lines = code.split('\n');
  return lines.map((text, index) => ({
    number: index + 1,
    text: text,
    indent: text.match(/^(\s*)/)[1].length,
    trimmed: text.trim(),
  })).filter(l => l.trimmed && !l.trimmed.startsWith('#'));
}

// Safe expression evaluator
function evalExpr(expr, vars) {
  expr = expr.trim();
  
  // Replace Python-style boolean ops
  expr = expr.replace(/\bnot\b/g, '!').replace(/\band\b/g, '&&').replace(/\bor\b/g, '||');
  // Replace Python True/False/None
  expr = expr.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false').replace(/\bNone\b/g, 'null');
  
  // Replace f-strings: f"...{var}..." → string concat
  expr = expr.replace(/f"([^"]*)"/g, (_, inner) => {
    return '"' + inner.replace(/\{([^}]+)\}/g, '" + ($1) + "') + '"';
  });
  expr = expr.replace(/f'([^']*)'/g, (_, inner) => {
    return "'" + inner.replace(/\{([^}]+)\}/g, "' + ($1) + '") + "'";
  });

  // Replace ** with Math.pow (simple cases)
  expr = expr.replace(/(\w+)\s*\*\*\s*(\w+)/g, 'Math.pow($1, $2)');

  // Build variable scope
  let scope = '';
  for (const [k, v] of Object.entries(vars)) {
    const val = typeof v === 'string' ? JSON.stringify(v) : v;
    scope += `var ${k} = ${val};\n`;
  }
  
  try {
    // eslint-disable-next-line no-new-func
    return new Function(scope + 'return (' + expr + ');')();
  } catch {
    return undefined;
  }
}

// Parse print arguments
function parsePrint(line) {
  const match = line.match(/^print\s*\((.+)\)$/s);
  if (!match) return null;
  return match[1].trim();
}

// Parse for loop: for i in range(n) or for i in range(start, stop) or for i in range(start, stop, step)
function parseForLoop(line) {
  const rangeMatch = line.match(/^for\s+(\w+)\s+in\s+range\((.+)\)\s*:$/);
  if (rangeMatch) {
    const varName = rangeMatch[1];
    const args = rangeMatch[2].split(',').map(a => a.trim());
    return { type: 'for_range', varName, args };
  }
  const listMatch = line.match(/^for\s+(\w+)\s+in\s+\[(.+)\]\s*:$/);
  if (listMatch) {
    const varName = listMatch[1];
    const items = listMatch[2].split(',').map(a => a.trim());
    return { type: 'for_list', varName, items };
  }
  return null;
}

// Parse while: while condition:
function parseWhile(line) {
  const match = line.match(/^while\s+(.+)\s*:$/);
  if (match) return { condition: match[1] };
  return null;
}

// Parse if/elif/else
function parseConditional(line) {
  if (line.match(/^if\s+(.+)\s*:$/)) return { type: 'if', condition: line.match(/^if\s+(.+)\s*:$/)[1] };
  if (line.match(/^elif\s+(.+)\s*:$/)) return { type: 'elif', condition: line.match(/^elif\s+(.+)\s*:$/)[1] };
  if (line === 'else:') return { type: 'else' };
  return null;
}

// Parse assignment: var = expr or var op= expr
function parseAssignment(line) {
  const augMatch = line.match(/^(\w+)\s*([+\-*/%])=\s*(.+)$/);
  if (augMatch) {
    return { varName: augMatch[1], op: augMatch[2], expr: augMatch[3] };
  }
  const normalMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
  if (normalMatch && !normalMatch[1].includes('(')) {
    return { varName: normalMatch[1], op: '=', expr: normalMatch[2] };
  }
  return null;
}

/**
 * Main tracer function
 * @param {string} code - Python pseudocode
 * @returns {{ steps: Step[], error: string|null }}
 */
export function traceCode(code) {
  const steps = [];
  const vars = {};
  const output = [];
  let stepId = 0;

  function addStep(lineNum, action, data = {}, description = '') {
    steps.push({
      id: stepId++,
      line: lineNum,
      action,
      variables: { ...vars },
      output: [...output],
      description,
      ...data,
    });
  }

  const MAX_STEPS = 200;

  function executeLines(lines, baseIndent = 0, loopDepth = 0) {
    let i = 0;
    while (i < lines.length) {
      if (steps.length >= MAX_STEPS) break;
      
      const line = lines[i];
      const t = line.trimmed;

      // Skip blank / comment
      if (!t || t.startsWith('#')) { i++; continue; }

      // ─── PRINT ───────────────────────────────────────
      if (t.startsWith('print(')) {
        const arg = parsePrint(t);
        let value = '';
        if (arg) {
          // Handle multiple args separated by commas (simple)
          const parts = arg.split(',').map(p => {
            const v = evalExpr(p.trim(), vars);
            return v === undefined ? p.trim().replace(/^['"]|['"]$/g, '') : String(v);
          });
          value = parts.join(' ');
        }
        output.push(value);
        addStep(line.number, 'print', { printValue: value },
          `📢 print() outputs: "${value}"`);
        i++;
        continue;
      }

      // ─── FOR LOOP ─────────────────────────────────────
      const forParsed = parseForLoop(t);
      if (forParsed) {
        // Collect body lines (indented more than this line)
        const bodyLines = [];
        let j = i + 1;
        while (j < lines.length && lines[j].indent > line.indent) {
          bodyLines.push(lines[j]);
          j++;
        }

        let rangeValues = [];
        if (forParsed.type === 'for_range') {
          const evArgs = forParsed.args.map(a => evalExpr(a, vars));
          if (forParsed.args.length === 1) rangeValues = [...Array(Math.max(0, evArgs[0])).keys()];
          else if (forParsed.args.length === 2) {
            for (let k = evArgs[0]; k < evArgs[1]; k++) rangeValues.push(k);
          } else {
            const [start, stop, step] = evArgs;
            for (let k = start; step > 0 ? k < stop : k > stop; k += step) rangeValues.push(k);
          }
        } else {
          rangeValues = forParsed.items.map(item => evalExpr(item, vars) ?? item);
        }

        rangeValues = rangeValues.slice(0, 50); // safety cap

        addStep(line.number, 'for_start', {
          loopVar: forParsed.varName,
          loopTotal: rangeValues.length,
          loopCurrent: 0,
          loopValues: rangeValues,
        }, `🔁 Starting loop: ${forParsed.varName} will iterate ${rangeValues.length} time(s)`);

        for (let li = 0; li < rangeValues.length; li++) {
          if (steps.length >= MAX_STEPS) break;
          vars[forParsed.varName] = rangeValues[li];
          addStep(line.number, 'for_iter', {
            loopVar: forParsed.varName,
            loopCurrent: li,
            loopTotal: rangeValues.length,
            loopValues: rangeValues,
            iterValue: rangeValues[li],
          }, `🔄 Loop iteration ${li + 1}/${rangeValues.length}: ${forParsed.varName} = ${rangeValues[li]}`);
          executeLines(bodyLines, line.indent, loopDepth + 1);
        }

        addStep(line.number, 'for_end', {
          loopVar: forParsed.varName,
          loopTotal: rangeValues.length,
        }, `✅ Loop complete — ran ${rangeValues.length} iteration(s)`);

        i = j;
        continue;
      }

      // ─── WHILE LOOP ────────────────────────────────────
      const whileParsed = parseWhile(t);
      if (whileParsed) {
        const bodyLines = [];
        let j = i + 1;
        while (j < lines.length && lines[j].indent > line.indent) {
          bodyLines.push(lines[j]);
          j++;
        }
        let iterations = 0;
        const maxIter = 20;
        while (iterations < maxIter && steps.length < MAX_STEPS) {
          const cond = evalExpr(whileParsed.condition, vars);
          addStep(line.number, 'while_check', {
            condition: whileParsed.condition,
            conditionResult: !!cond,
          }, `🔁 while ${whileParsed.condition} → ${cond ? 'TRUE, continue' : 'FALSE, exit'}`);
          if (!cond) break;
          executeLines(bodyLines, line.indent, loopDepth + 1);
          iterations++;
        }
        addStep(line.number, 'while_end', {}, `✅ While loop complete after ${iterations} iteration(s)`);
        i = j;
        continue;
      }

      // ─── IF / ELIF / ELSE ─────────────────────────────
      const condParsed = parseConditional(t);
      if (condParsed) {
        // Collect the full if/elif/else block
        const blocks = []; // [{type, condition, lines}]
        let j = i;
        while (j < lines.length) {
          const bl = lines[j];
          const bt = bl.trimmed;
          let blockType = null;
          let blockCond = null;
          if (j === i) {
            blockType = condParsed.type;
            blockCond = condParsed.condition;
          } else if (bl.indent === line.indent) {
            const cp = parseConditional(bt);
            if (!cp) break;
            blockType = cp.type;
            blockCond = cp.condition;
          } else break;

          const bodyLines = [];
          let k = j + 1;
          while (k < lines.length && lines[k].indent > line.indent) {
            bodyLines.push(lines[k]);
            k++;
          }
          blocks.push({ type: blockType, condition: blockCond, lines: bodyLines, lineNum: bl.number });
          j = k;
        }

        // Evaluate which branch to take
        let branchTaken = false;
        for (const block of blocks) {
          if (block.type === 'else') {
            addStep(block.lineNum, 'else', {},
              `➡️ else: previous conditions were false, executing else block`);
            executeLines(block.lines, line.indent);
            branchTaken = true;
            break;
          }
          const result = evalExpr(block.condition, vars);
          addStep(block.lineNum, 'if_check', {
            condition: block.condition,
            conditionResult: !!result,
          }, `${block.type === 'if' ? '❓' : '🔀'} ${block.type} ${block.condition} → ${result ? '✅ TRUE' : '❌ FALSE'}`);
          if (result && !branchTaken) {
            addStep(block.lineNum, 'if_true', {
              condition: block.condition,
              conditionResult: true,
            }, `✅ Condition is TRUE — executing this block`);
            executeLines(block.lines, line.indent);
            branchTaken = true;
          } else if (!result) {
            addStep(block.lineNum, 'if_false', {
              condition: block.condition,
              conditionResult: false,
            }, `❌ Condition is FALSE — skipping this block`);
          }
        }
        i = j;
        continue;
      }

      // ─── ASSIGNMENT ───────────────────────────────────
      const assignParsed = parseAssignment(t);
      if (assignParsed) {
        const { varName, op, expr } = assignParsed;
        const prevVal = vars[varName];
        let newVal;
        if (op === '=') {
          newVal = evalExpr(expr, vars);
        } else {
          const rightVal = evalExpr(expr, vars);
          const leftVal = vars[varName] ?? 0;
          switch (op) {
            case '+': newVal = leftVal + rightVal; break;
            case '-': newVal = leftVal - rightVal; break;
            case '*': newVal = leftVal * rightVal; break;
            case '/': newVal = leftVal / rightVal; break;
            case '%': newVal = leftVal % rightVal; break;
            default: newVal = leftVal;
          }
        }
        vars[varName] = newVal;
        addStep(line.number, 'assign', {
          varName,
          varValue: newVal,
          prevValue: prevVal,
          isNew: prevVal === undefined,
        }, prevVal === undefined
          ? `📦 Created variable "${varName}" = ${JSON.stringify(newVal)}`
          : `✏️  Updated "${varName}": ${JSON.stringify(prevVal)} → ${JSON.stringify(newVal)}`);
        i++;
        continue;
      }

      // Unknown line — just note it
      addStep(line.number, 'unknown', {}, `Line: ${t}`);
      i++;
    }
  }

  try {
    const lines = tokenize(code);
    if (lines.length === 0) {
      return { steps: [], error: 'No code to execute' };
    }
    // Only process top-level lines (indent=0 based, but we handle all)
    executeLines(lines);

    // Final step
    steps.push({
      id: stepId++,
      line: -1,
      action: 'done',
      variables: { ...vars },
      output: [...output],
      description: `🎉 Program finished! ${output.length} line(s) output, ${Object.keys(vars).length} variable(s) used.`,
    });

    return { steps, error: null };
  } catch (e) {
    return { steps, error: e.message };
  }
}
