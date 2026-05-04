'use client';

import { useEffect, useState } from 'react';

type Line = { kind: 'cmd' | 'out' | 'pause'; text?: string; delay?: number };

const SCRIPT: Line[] = [
  { kind: 'cmd', text: 'git clone https://github.com/emrenuhoglu-tech/layermark-starter' },
  { kind: 'out', text: 'Cloning into \'layermark-starter\'... done.' },
  { kind: 'pause', delay: 400 },
  { kind: 'cmd', text: 'cd layermark-starter && python setup_starter.py' },
  { kind: 'out', text: 'Hangi kit?  1) AI Asistan  2) İçerik Takip  3) Boş Sayfa' },
  { kind: 'cmd', text: '> 1' },
  { kind: 'out', text: 'Proje adı: my-bot' },
  { kind: 'out', text: 'Hangi dilde / Which language? [tr/en]: tr' },
  { kind: 'pause', delay: 300 },
  { kind: 'out', text: '✓ CLAUDE.md (20 doctrine + 10-soru wizard)' },
  { kind: 'out', text: '✓ .claude/skills/ (14 foundational skill)' },
  { kind: 'out', text: '✓ .claude/agents/prompt-engineer.md' },
  { kind: 'out', text: '✓ .gitignore + .env.example' },
  { kind: 'out', text: '→ ../my-bot hazır (1.2 sn)' },
  { kind: 'pause', delay: 500 },
  { kind: 'cmd', text: 'cd ../my-bot && claude' },
  { kind: 'out', text: '' },
  { kind: 'out', text: '╭─ Claude Code ────────────────────────────╮' },
  { kind: 'out', text: '│ Wizard: Hangi dilde? / Which language?    │' },
  { kind: 'out', text: '│ [TR seçildi]                              │' },
  { kind: 'out', text: '│                                           │' },
  { kind: 'out', text: '│ Soru 1/9: Bu proje ne yapacak?            │' },
  { kind: 'out', text: '╰───────────────────────────────────────────╯' },
  { kind: 'pause', delay: 2000 },
];

const CMD_CHAR_DELAY = 22;
const OUT_CHAR_DELAY = 4;
const LINE_GAP = 90;

export default function TerminalPreview() {
  const [rendered, setRendered] = useState<{ kind: string; text: string }[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let lineIdx = 0;

    async function play() {
      while (!cancelled) {
        const line = SCRIPT[lineIdx % SCRIPT.length];
        if (line.kind === 'pause') {
          await sleep(line.delay ?? 300);
        } else {
          const charDelay = line.kind === 'cmd' ? CMD_CHAR_DELAY : OUT_CHAR_DELAY;
          const target = line.text ?? '';
          for (let i = 0; i <= target.length; i++) {
            if (cancelled) return;
            setRendered((prev) => {
              const head = prev.slice(0, lineIdx);
              return [...head, { kind: line.kind, text: target.slice(0, i) }];
            });
            await sleep(charDelay);
          }
          await sleep(LINE_GAP);
        }
        lineIdx++;
        if (lineIdx >= SCRIPT.length) {
          await sleep(500);
          setRendered([]);
          lineIdx = 0;
        }
      }
    }

    play();
    const cursorInt = setInterval(() => setTick((t) => t + 1), 530);
    return () => {
      cancelled = true;
      clearInterval(cursorInt);
    };
  }, []);

  const cursor = tick % 2 === 0 ? '▋' : ' ';

  return (
    <div className="rounded-lg border border-border bg-[#0a0a0a] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-border">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <div className="ml-3 text-xs font-mono text-muted">~/projects — bash</div>
      </div>
      <div className="px-5 py-4 font-mono text-[13px] leading-6 min-h-[340px] max-h-[340px] overflow-hidden">
        {rendered.map((line, i) => {
          const isLast = i === rendered.length - 1;
          if (line.kind === 'cmd') {
            return (
              <div key={i} className="text-text">
                <span className="text-accent mr-2">$</span>
                <span>{line.text}{isLast ? cursor : ''}</span>
              </div>
            );
          }
          return (
            <div key={i} className="text-muted">
              {line.text}
              {isLast ? <span className="text-accent">{cursor}</span> : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
