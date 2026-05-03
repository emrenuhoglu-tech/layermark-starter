import Link from 'next/link';
import TerminalPreview from './TerminalPreview';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';
const USE_TEMPLATE = `${REPO}/generate`;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="font-mono text-sm">
            <span className="text-accent">▸</span> layermark-starter
          </div>
          <nav className="flex gap-6 text-sm text-muted">
            <a href="#how" className="hover:text-text">Nasıl</a>
            <a href="#what" className="hover:text-text">Ne kuruyor</a>
            <a href="#kits" className="hover:text-text">Kitler</a>
            <a href={REPO} className="hover:text-text" target="_blank">GitHub</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16">
        <div className="text-xs font-mono text-muted mb-6">
          v0.4 · TR/EN · MIT
        </div>
        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Claude Code projeleri,{' '}
          <span className="gradient-text">1 dakikada</span>
          <br />opinionated iskelet.
        </h1>
        <p className="text-xl text-muted leading-relaxed mb-10 max-w-2xl">
          Pocock + AI Engineer + Karpathy doctrine'i pre-shipped.
          11 foundational skill, 1 subagent, security audit, intel pipeline,
          TR/EN wizard — kuruluyor değil, hazır.
        </p>

        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="/start"
            className="bg-accent hover:bg-orange-500 text-bg font-semibold px-8 py-4 rounded-lg transition"
          >
            Başla → 30 saniye
          </Link>
          <a
            href={USE_TEMPLATE}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-border hover:border-text text-text font-medium px-8 py-4 rounded-lg transition"
          >
            GitHub'da template kullan
          </a>
        </div>

        <div className="mt-8 text-sm text-muted">
          Ücretsiz · Açık kaynak · Anthropic affiliate değil
        </div>

        <div className="mt-12">
          <TerminalPreview />
          <div className="text-xs text-muted text-center mt-3 font-mono">
            ↑ canlı simülasyon — gerçek output, sıfır edit
          </div>
        </div>
      </section>

      {/* What it ships */}
      <section id="what" className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-3">Kutudan çıkanlar</h2>
          <p className="text-muted mb-12">
            Boş repo değil — Pocock/AI Engineer'dan distile, gerçek pratik prensipler.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <Card title="14 doctrine kuralı" desc="Grill before build, Smart zone (~100K), Memento, Surgical changes, Inner-loop test, Never /init, Hooks > prompts, Rules emerge, Task protocol — hepsi tek tek kanıtla." />
            <Card title="11 foundational skill" desc="grill-me, skill-creator, agent-creator, project-advisor, yardim, suspend, resume, sync-drift — her biri inner-loop test'i geçer." />
            <Card title="prompt-engineer subagent" desc="BUILD modu (casual istek → structured prompt) + AUDIT modu + her zaman aktif security pass (secrets/injection/SSRF/path traversal)." />
            <Card title="Intel pipeline (opsiyonel)" desc="YouTube + X kanal taraması, transcript indir, Whisper video transcribe, junction-shared canonical store." />
            <Card title="3 hazır kit" desc="🤖 AI Asistan / 📊 İçerik Takip / 📝 Boş Sayfa — biri seç, gerisi otomatik." />
            <Card title="TR/EN wizard" desc="9 sorulu first-run. Her soruda 'Bilmiyor musun?' safety-net. Jargon yok." />
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12">3 adım</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Step
              n="1"
              title="Önkoşul kontrol"
              code="check.cmd  # Win\nbash check.sh  # Mac"
              desc="Python / git / Claude Code kurulu mu? Eksik varsa link verir."
            />
            <Step
              n="2"
              title="Kit seç + bootstrap"
              code="python setup_starter.py"
              desc="3 kitten birini seç. Wizard 4-5 soru. <1 saniyede iskelet hazır."
            />
            <Step
              n="3"
              title="Claude Code aç"
              code="cd <yeni-proje>\nclaude"
              desc="İlk session'da CLAUDE.md wizard'ı tetiklenir. TR/EN sorar, 9 soru, proje hazır."
            />
          </div>
        </div>
      </section>

      {/* Kits */}
      <section id="kits" className="border-t border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-12">3 hazır kit</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Kit
              emoji="🤖"
              name="AI Asistan"
              desc="Müşteri mesajlarına cevap, takvim, mail otomasyon, chatbot."
              defaults="Python · Bot/automation odaklı"
            />
            <Kit
              emoji="📊"
              name="İçerik Takip"
              desc="YouTube/X kanalları tarayıp transcript çekip otomatik özet çıkaran bot."
              defaults="Python · Intel pipeline + watchlist + KB"
            />
            <Kit
              emoji="📝"
              name="Boş Sayfa"
              desc="Ne yapacağına sen karar vereceksin. Wizard tüm soruları sorar."
              defaults="Custom · Full wizard"
            />
          </div>
        </div>
      </section>

      {/* Anti-friction */}
      <section className="border-t border-border">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold mb-3">Bu starter SİZE göre değil eğer...</h2>
          <ul className="text-muted space-y-2 mb-10">
            <li>• Hayatınızda <strong className="text-text">terminal</strong> açmamışsanız ve niyetiniz yoksa</li>
            <li>• <strong className="text-text">Python / git / Node.js</strong> nedir hiç duymamışsanız</li>
            <li>• <em>"Sadece bana bir uygulama yaz"</em> arıyorsanız (Lovable, v0, Bubble daha hızlı)</li>
          </ul>

          <h3 className="text-2xl font-bold mb-3">SİZE göre eğer...</h3>
          <ul className="text-muted space-y-2">
            <li>✓ Claude Code'u kurdunuz, açtınız, ama "şimdi ne?" hissi var</li>
            <li>✓ Birkaç defa AI ile proje açtınız, dağıldı, tekrar başladınız</li>
            <li>✓ Aynı opinionated yapı'yı her projeye otomatik uygulamak istiyorsunuz</li>
            <li>✓ Pocock/Karpathy disiplini'ni lego setine sahip olmak istiyorsunuz</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
          <div>
            © Layermark · MIT lisans · Açık kaynak
          </div>
          <div className="flex gap-6">
            <a href={REPO} target="_blank" className="hover:text-text">GitHub</a>
            <a href={`${REPO}/issues`} target="_blank" className="hover:text-text">Issues</a>
            <a href="https://claude.ai/code" target="_blank" className="hover:text-text">Claude Code</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-bg">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ n, title, code, desc }: { n: string; title: string; code: string; desc: string }) {
  return (
    <div>
      <div className="font-mono text-accent text-sm mb-3">step {n}</div>
      <h3 className="font-semibold text-lg mb-3">{title}</h3>
      <pre className="bg-surface border border-border rounded p-3 text-xs font-mono mb-3 whitespace-pre-wrap">{code}</pre>
      <p className="text-muted text-sm">{desc}</p>
    </div>
  );
}

function Kit({ emoji, name, desc, defaults }: { emoji: string; name: string; desc: string; defaults: string }) {
  return (
    <div className="border border-border rounded-lg p-6 bg-bg">
      <div className="text-3xl mb-3">{emoji}</div>
      <h3 className="font-semibold text-lg mb-2">{name}</h3>
      <p className="text-muted text-sm mb-4 leading-relaxed">{desc}</p>
      <div className="text-xs font-mono text-muted">{defaults}</div>
    </div>
  );
}
