#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function usage() {
  console.error('Usage: node scripts/contract-gen.js <contract-data.json> <contract.html>');
  process.exit(1);
}

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  usage();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statusTone(status) {
  return String(status).toLowerCase() === 'approved' ? 'go' : 'caution';
}

function gateTone(status) {
  return String(status).toLowerCase() === 'ready' ? 'go' : 'caution';
}

function renderList(items, renderItem) {
  return items.map(renderItem).join('\n');
}

function renderCommand(command, id) {
  return `
    <div class="cmd-field">
      <code class="cmd-text" id="${id}">${escapeHtml(command)}</code>
      <button type="button" class="copy-btn" data-copy="${id}">copy</button>
    </div>`;
}

function phaseCommand(phase) {
  if (!phase?.specPath) return null;
  return `/ideation:execute-spec ${phase.specPath}`;
}

function renderScopeItems(items, emptyLabel, emphasizeReason) {
  if (!items || items.length === 0) {
    return `<li class="muted-item">${escapeHtml(emptyLabel)}</li>`;
  }

  return renderList(items, (entry) => {
    if (typeof entry === 'string') {
      return `<li>${escapeHtml(entry)}</li>`;
    }

    const item = escapeHtml(entry.item || '');
    const reason = entry.reason ? escapeHtml(entry.reason) : '';
    if (!reason) {
      return `<li><strong>${item}</strong></li>`;
    }

    const reasonMarkup = emphasizeReason
      ? `<span class="scope-reason">${reason}</span>`
      : reason;

    return `<li><strong>${item}</strong>${reasonMarkup ? ` <span class="muted-dash">-</span> ${reasonMarkup}` : ''}</li>`;
  });
}

function renderHtml(contract) {
  const gates = contract.gates?.dimensions || [];
  const allGatesReady = gates.every((gate) => String(gate.status).toLowerCase() === 'ready');
  const tone = statusTone(contract.status);
  const phases = contract.execution?.phases || [];
  const firstPhase = phases[0];
  const firstCommand = phaseCommand(firstPhase);
  const mechanicalChecks = (contract.successCriteria || []).filter((item) => item.check).length;
  const approvedLine = contract.approvedOn
    ? `<span class="meta-line">approved ${escapeHtml(contract.approvedOn)}${contract.approvedBy ? ` · ${escapeHtml(contract.approvedBy)}` : ''}</span>`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(contract.projectName)} - Mission Brief</title>
    <script>
      try {
        const saved = localStorage.getItem('ideation-contract-theme');
        if (saved === 'light' || saved === 'dark') {
          document.documentElement.dataset.theme = saved;
        }
      } catch {}
    </script>
    <style>
      :root {
        color-scheme: light dark;
        --bg: light-dark(#eef2f6, #0b1118);
        --panel: light-dark(#ffffff, #121b25);
        --panel-2: light-dark(#f7f9fb, #182330);
        --line: light-dark(#d5dee6, #263545);
        --line-strong: light-dark(#b5c4d0, #3a4c60);
        --ink: light-dark(#182430, #e7eef5);
        --muted: light-dark(#4b5a67, #9aafc3);
        --faint: light-dark(#617180, #7f96ab);
        --accent: light-dark(#0b6f8a, #58c5e6);
        --accent-soft: light-dark(#dceef4, #123241);
        --go: light-dark(#156f55, #47d29b);
        --go-soft: light-dark(#def4ea, #0f2d23);
        --caution: light-dark(#8a5e05, #f0ba57);
        --caution-soft: light-dark(#f6ecd3, #33280f);
        --danger: light-dark(#b12a4f, #f28aa1);
        --danger-soft: light-dark(#fae3e9, #341620);
        --shadow: 0 18px 44px rgba(8, 15, 23, 0.12);
        --radius: 12px;
        --radius-sm: 8px;
        --space-1: 4px;
        --space-2: 8px;
        --space-3: 12px;
        --space-4: 16px;
        --space-5: 24px;
        --space-6: 32px;
        --space-7: 48px;
        --mono: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, monospace;
        --sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      :root[data-theme='light'] { color-scheme: light; }
      :root[data-theme='dark'] { color-scheme: dark; }

      * { box-sizing: border-box; }
      html, body { margin: 0; padding: 0; }
      body {
        background: var(--bg);
        color: var(--ink);
        font-family: var(--sans);
        line-height: 1.6;
      }
      .shell {
        max-width: 1160px;
        margin: 0 auto;
        padding: var(--space-6);
      }
      .doc-header {
        background: linear-gradient(180deg, var(--panel), var(--panel-2));
        border: 1px solid var(--line);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
        padding: var(--space-6);
        margin-bottom: var(--space-6);
      }
      .header-top {
        display: flex;
        justify-content: space-between;
        gap: var(--space-5);
        align-items: flex-start;
      }
      .eyebrow,
      .label {
        font-family: var(--mono);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--faint);
      }
      h1 {
        margin: var(--space-2) 0 0;
        font-size: clamp(2rem, 4vw, 3rem);
        line-height: 1.05;
      }
      .meta {
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
        align-items: flex-end;
      }
      .meta-line {
        color: var(--muted);
        font-family: var(--mono);
        font-size: 0.8rem;
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: var(--space-2);
        border: 1px solid currentColor;
        border-radius: 999px;
        padding: 6px 12px;
        font-family: var(--mono);
        font-size: 0.8rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
      .status-pill::before {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: currentColor;
      }
      .status-go { color: var(--go); }
      .status-caution { color: var(--caution); }
      .theme-toggle,
      .copy-btn {
        border: 1px solid var(--line-strong);
        background: transparent;
        color: var(--ink);
        border-radius: 999px;
        padding: 8px 12px;
        font: 600 0.75rem var(--mono);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        cursor: pointer;
      }
      .theme-toggle:hover,
      .copy-btn:hover { border-color: var(--accent); color: var(--accent); }
      .gate-summary {
        margin-top: var(--space-5);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-4);
      }
      .gate-grid {
        margin-top: var(--space-4);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
        gap: var(--space-3);
      }
      .gate-card,
      .panel,
      .run-bar {
        background: var(--panel);
        border: 1px solid var(--line);
        border-radius: var(--radius);
      }
      .gate-card {
        padding: var(--space-4);
      }
      .gate-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--space-3);
        margin-bottom: var(--space-2);
      }
      .gate-mark {
        display: inline-flex;
        width: 28px;
        height: 28px;
        align-items: center;
        justify-content: center;
        border-radius: 999px;
        font-weight: 700;
        font-family: var(--mono);
      }
      .gate-mark.go { background: var(--go-soft); color: var(--go); }
      .gate-mark.caution { background: var(--caution-soft); color: var(--caution); }
      .gate-name {
        font-weight: 700;
      }
      .gate-evidence {
        color: var(--muted);
        font-size: 0.95rem;
      }
      .doc-content {
        display: grid;
        gap: var(--space-6);
      }
      .run-bar {
        padding: var(--space-5);
        display: flex;
        justify-content: space-between;
        gap: var(--space-4);
        align-items: center;
      }
      .run-title {
        margin: var(--space-1) 0;
        font-size: 1.25rem;
        font-weight: 700;
      }
      .run-copy {
        color: var(--muted);
      }
      .cmd-field {
        display: flex;
        align-items: center;
        gap: var(--space-2);
        min-width: min(100%, 480px);
      }
      .cmd-text {
        flex: 1;
        display: block;
        overflow-x: auto;
        white-space: nowrap;
        border: 1px solid var(--line);
        background: var(--panel-2);
        border-radius: var(--radius-sm);
        padding: 12px 14px;
        font: 0.85rem var(--mono);
      }
      .grid.two-up {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-6);
      }
      .panel {
        padding: var(--space-5);
      }
      .section-title {
        display: flex;
        align-items: center;
        gap: var(--space-3);
        margin-bottom: var(--space-4);
      }
      .section-title h2,
      .section-title h3 {
        margin: 0;
        font-size: 1rem;
      }
      .rule {
        height: 1px;
        flex: 1;
        background: var(--line);
      }
      .prose p,
      .plain-list li,
      .criteria-list li,
      .phase-list li,
      .scope-list li {
        margin: 0 0 var(--space-3);
      }
      .goal-list,
      .criteria-list,
      .scope-columns,
      .phase-list,
      .plain-list,
      .scope-list { padding: 0; margin: 0; list-style: none; }
      .goal-row,
      .criteria-row,
      .phase-row {
        display: grid;
        grid-template-columns: 42px minmax(0, 1fr);
        gap: var(--space-3);
        padding: var(--space-3) 0;
        border-top: 1px solid var(--line);
      }
      .goal-row:first-child,
      .criteria-row:first-child,
      .phase-row:first-child { border-top: 0; padding-top: 0; }
      .num {
        font: 700 0.8rem var(--mono);
        color: var(--faint);
      }
      .criteria-check,
      .phase-note,
      .muted-text,
      .muted-item,
      .scope-reason {
        color: var(--muted);
      }
      .criteria-check,
      .phase-command code {
        display: block;
        margin-top: var(--space-2);
        white-space: pre-wrap;
        word-break: break-word;
        font: 0.82rem var(--mono);
        background: var(--panel-2);
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        padding: 10px 12px;
      }
      .scope-columns {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: var(--space-4);
      }
      .scope-card {
        border: 1px solid var(--line);
        border-radius: var(--radius-sm);
        background: var(--panel-2);
        padding: var(--space-4);
      }
      .scope-card h3,
      .scope-side h3 {
        margin: 0 0 var(--space-3);
        font-size: 0.95rem;
      }
      .scope-side-wrap {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--space-4);
        margin-top: var(--space-4);
      }
      .scope-side {
        border-radius: var(--radius-sm);
        padding: var(--space-4);
      }
      .scope-side.out { background: var(--danger-soft); }
      .scope-side.future { background: var(--accent-soft); }
      .muted-dash { color: var(--faint); }
      .phase-row { align-items: start; }
      .phase-meta {
        display: flex;
        flex-wrap: wrap;
        gap: var(--space-2);
        margin: var(--space-2) 0;
      }
      .tag {
        border: 1px solid var(--line);
        border-radius: 999px;
        padding: 4px 8px;
        font: 0.74rem var(--mono);
        color: var(--muted);
      }
      .footer-note {
        color: var(--muted);
        font-size: 0.95rem;
      }
      @media (max-width: 900px) {
        .grid.two-up,
        .scope-columns,
        .scope-side-wrap {
          grid-template-columns: 1fr;
        }
        .header-top,
        .run-bar {
          flex-direction: column;
          align-items: stretch;
        }
        .meta {
          align-items: flex-start;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        * { scroll-behavior: auto; }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header class="doc-header">
        <div class="header-top">
          <div>
            <div class="eyebrow">Mission Brief · ${escapeHtml(contract.slug)}</div>
            <h1>${escapeHtml(contract.projectName)}</h1>
          </div>
          <div class="meta">
            <span class="status-pill status-${tone}">${escapeHtml(contract.status || 'Draft')}</span>
            <span class="meta-line">created ${escapeHtml(contract.date || '')}</span>
            ${approvedLine}
            <span class="meta-line">supersedes ${escapeHtml(contract.supersedes || 'none')}</span>
            <button type="button" class="theme-toggle" id="theme-toggle">theme · auto</button>
          </div>
        </div>

        <div class="gate-summary">
          <span class="label">Readiness gates</span>
          <span class="status-pill status-${allGatesReady ? 'go' : 'caution'}">${allGatesReady ? 'All gates ready' : 'Some gates not ready'}</span>
        </div>

        <div class="gate-grid">
          ${renderList(gates, (gate) => `
            <article class="gate-card">
              <div class="gate-top">
                <span class="gate-name">${escapeHtml(gate.label)}</span>
                <span class="gate-mark ${gateTone(gate.status)}">${gateTone(gate.status) === 'go' ? '✓' : '!'}</span>
              </div>
              <div class="gate-evidence">${escapeHtml(gate.evidence || '')}</div>
            </article>`)}
        </div>
      </header>

      <main class="doc-content">
        <section class="run-bar">
          <div>
            <div class="label">${contract.status === 'Approved' ? 'First move' : 'Approval state'}</div>
            <div class="run-title">${contract.status === 'Approved' && firstPhase ? escapeHtml(firstPhase.title) : 'Draft awaiting approval'}</div>
            <div class="run-copy">${contract.status === 'Approved' && firstCommand ? 'Start with the first approved implementation phase.' : 'Review this mission brief, then approve it before moving to spec generation.'}</div>
          </div>
          ${contract.status === 'Approved' && firstCommand ? renderCommand(firstCommand, 'cmd-first') : '<div class="muted-text">No execution command until approval.</div>'}
        </section>

        <div class="grid two-up">
          <section class="panel">
            <div class="section-title"><span class="label">Problem</span><span class="rule"></span></div>
            <div class="prose">
              ${renderList(contract.problem || [], (paragraph) => `<p>${escapeHtml(paragraph)}</p>`)}
            </div>
          </section>

          <section class="panel">
            <div class="section-title"><span class="label">Goals</span><span class="rule"></span></div>
            <ol class="goal-list">
              ${renderList(contract.goals || [], (goal, index) => `
                <li class="goal-row">
                  <span class="num">${String(index + 1).padStart(2, '0')}</span>
                  <div>${escapeHtml(goal)}</div>
                </li>`)}
            </ol>
          </section>
        </div>

        <section class="panel">
          <div class="section-title"><span class="label">Done when</span><span class="rule"></span><span class="muted-text">${(contract.successCriteria || []).length} signals · ${mechanicalChecks} mechanically checked</span></div>
          <ol class="criteria-list">
            ${renderList(contract.successCriteria || [], (item, index) => `
              <li class="criteria-row">
                <span class="num">${String(index + 1).padStart(2, '0')}</span>
                <div>
                  <div>${escapeHtml(item.criterion)}</div>
                  ${item.check ? `<code class="criteria-check">${escapeHtml(item.check)}</code>` : '<div class="criteria-check">Human judgment call</div>'}
                </div>
              </li>`)}
          </ol>
        </section>

        <section class="panel">
          <div class="section-title"><span class="label">Scope</span><span class="rule"></span></div>
          <div class="scope-columns">
            <section class="scope-card">
              <h3>MVP</h3>
              <ul class="scope-list">${renderScopeItems(contract.scope?.mvp || [], 'No MVP items listed.', true)}</ul>
            </section>
            <section class="scope-card">
              <h3>Full</h3>
              <ul class="scope-list">${renderScopeItems(contract.scope?.full || [], 'No full-scope items listed.', true)}</ul>
            </section>
            <section class="scope-card">
              <h3>Stretch</h3>
              <ul class="scope-list">${renderScopeItems(contract.scope?.stretch || [], 'No stretch items listed.', false)}</ul>
            </section>
          </div>
          <div class="scope-side-wrap">
            <section class="scope-side out">
              <h3>Out of scope</h3>
              <ul class="scope-list">${renderScopeItems(contract.scope?.outOfScope || [], 'No explicit out-of-scope items listed.', true)}</ul>
            </section>
            <section class="scope-side future">
              <h3>Future</h3>
              <ul class="scope-list">${renderScopeItems(contract.scope?.future || [], 'No future items listed.', false)}</ul>
            </section>
          </div>
        </section>

        <section class="panel">
          <div class="section-title"><span class="label">Execution plan</span><span class="rule"></span></div>
          <p class="footer-note">${escapeHtml(contract.execution?.strategy || 'No execution strategy recorded.')}</p>
          ${contract.execution?.selectedCommerceStack ? `<p class="footer-note">Stack/context: ${escapeHtml(contract.execution.selectedCommerceStack)}</p>` : ''}
          <ol class="phase-list">
            ${renderList(phases, (phase, index) => {
              const command = phaseCommand(phase);
              return `
                <li class="phase-row">
                  <span class="num">${String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <div><strong>${escapeHtml(phase.title || `Phase ${index + 1}`)}</strong></div>
                    <div class="phase-meta">
                      <span class="tag">risk ${escapeHtml(phase.risk || 'unknown')}</span>
                      <span class="tag">${phase.blocking ? 'blocking' : 'non-blocking'}</span>
                      ${phase.specPath ? `<span class="tag">spec ${escapeHtml(phase.specPath)}</span>` : ''}
                    </div>
                    ${phase.notes ? `<div class="phase-note">${escapeHtml(phase.notes)}</div>` : ''}
                    ${command ? `<div class="phase-command"><code>${escapeHtml(command)}</code></div>` : ''}
                  </div>
                </li>`;
            })}
          </ol>
        </section>
      </main>
    </div>

    <script>
      (() => {
        const root = document.documentElement;
        const key = 'ideation-contract-theme';
        const toggle = document.getElementById('theme-toggle');
        const order = ['auto', 'light', 'dark'];

        function setLabel(mode) {
          if (toggle) toggle.textContent = 'theme · ' + mode;
        }

        function apply(mode) {
          if (mode === 'auto') {
            delete root.dataset.theme;
            try { localStorage.removeItem(key); } catch {}
          } else {
            root.dataset.theme = mode;
            try { localStorage.setItem(key, mode); } catch {}
          }
          setLabel(mode);
        }

        const saved = (() => {
          try { return localStorage.getItem(key); } catch { return null; }
        })();
        apply(saved === 'light' || saved === 'dark' ? saved : 'auto');

        toggle?.addEventListener('click', async () => {
          const current = root.dataset.theme === 'light' || root.dataset.theme === 'dark' ? root.dataset.theme : 'auto';
          const next = order[(order.indexOf(current) + 1) % order.length];
          apply(next);
        });

        document.querySelectorAll('[data-copy]').forEach((button) => {
          button.addEventListener('click', async () => {
            const id = button.getAttribute('data-copy');
            const target = id ? document.getElementById(id) : null;
            if (!target) return;
            const text = target.textContent || '';
            try {
              await navigator.clipboard.writeText(text);
              const previous = button.textContent;
              button.textContent = 'copied';
              setTimeout(() => {
                button.textContent = previous || 'copy';
              }, 1200);
            } catch {}
          });
        });
      })();
    </script>
  </body>
</html>`;
}

const contract = readJson(path.resolve(inputPath));
const html = renderHtml(contract);

fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
fs.writeFileSync(path.resolve(outputPath), html, 'utf8');
