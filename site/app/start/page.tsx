import Link from 'next/link';

const USE_TEMPLATE = 'https://github.com/emrenuhoglu-tech/layermark-starter/generate';
const REPO_ZIP = 'https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.zip';

export default function Start() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link href="/" className="font-mono text-sm hover:text-accent">
            ◂ layermark-starter
          </Link>
          <a href={USE_TEMPLATE} target="_blank" className="text-sm text-muted hover:text-text">
            GitHub
          </a>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-4">2 yol var, hangisi sen?</h1>
        <p className="text-muted mb-12">
          GitHub hesabın varsa <strong className="text-text">A</strong> daha hızlı. Yoksa{' '}
          <strong className="text-text">B</strong> ile zip indirip lokalde başlarsın.
        </p>

        <div className="space-y-6">
          {/* Yol A */}
          <div className="border border-border rounded-lg p-8 bg-surface">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-accent text-bg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                A
              </span>
              <h2 className="text-2xl font-bold">GitHub Use Template (önerilen)</h2>
            </div>
            <p className="text-muted mb-6 leading-relaxed">
              Tek tık → kendi GitHub'ında yeni repo. Sonra <code className="font-mono text-accent">git clone</code> + Claude Code aç.
            </p>
            <ol className="text-sm text-muted space-y-2 mb-6 list-decimal list-inside">
              <li>Aşağıdaki butona tıkla</li>
              <li>Repo adı seç (örn: <code className="text-text">my-ai-project</code>)</li>
              <li>"Create repository" tıkla</li>
              <li>Lokal'de: <code className="text-text">git clone &lt;repo-url&gt; && cd ... && claude</code></li>
              <li>İlk Claude session'da CLAUDE.md wizard'ı kendiliğinden tetiklenir</li>
            </ol>
            <a
              href={USE_TEMPLATE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition"
            >
              GitHub'da template kullan →
            </a>
          </div>

          {/* Yol B */}
          <div className="border border-border rounded-lg p-8 bg-surface">
            <div className="flex items-center gap-3 mb-4">
              <span className="border border-border text-text font-bold w-8 h-8 rounded-full flex items-center justify-center">
                B
              </span>
              <h2 className="text-2xl font-bold">Zip indir + lokalde başla</h2>
            </div>
            <p className="text-muted mb-6 leading-relaxed">
              GitHub hesabın yok ya da hızlı denemek istiyorsan: zip indir, çıkar, Python script çalıştır.
            </p>
            <ol className="text-sm text-muted space-y-2 mb-6 list-decimal list-inside">
              <li>Zip'i indir (aşağıdaki buton)</li>
              <li>Çıkar bir klasöre</li>
              <li>Önkoşul kontrol: <code className="text-text">check.cmd</code> (Win) veya <code className="text-text">bash check.sh</code> (Mac)</li>
              <li>Çalıştır: <code className="text-text">python setup_starter.py</code></li>
              <li>Kit seç, sorulara cevap ver, hazır</li>
            </ol>
            <a
              href={REPO_ZIP}
              className="inline-block border border-border hover:border-text text-text font-medium px-6 py-3 rounded-lg transition"
            >
              Zip indir (main branch)
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-8">
          <h3 className="text-lg font-semibold mb-3">Yakında</h3>
          <p className="text-muted text-sm leading-relaxed">
            Browser-içi tam-otomatik wizard (TR/EN, kit seç, isim ver, projen hazır indir) Level 2'de gelecek.
            Şu anki 2 yöntem yeterli — A %95 kullanıcı için bir tıkta çalışır.
          </p>
        </div>
      </section>
    </main>
  );
}
