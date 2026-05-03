'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Lang = 'tr' | 'en';

const translations = {
  tr: {
    'nav.how': 'Nasıl',
    'nav.what': 'Ne kuruyor',
    'nav.kits': 'Kitler',
    'nav.premium': 'Premium',
    'nav.github': 'GitHub',

    'hero.tag': 'v0.4 · TR/EN · MIT',
    'hero.title.1': 'Claude Code projeleri,',
    'hero.title.accent': '1 dakikada',
    'hero.title.2': 'opinionated iskelet.',
    'hero.subtitle':
      "Pocock + AI Engineer + Karpathy doctrine'i pre-shipped. 11 foundational skill, 1 subagent, security audit, intel pipeline, TR/EN wizard — kuruluyor değil, hazır.",
    'hero.cta.primary': '📋 Prompt\'u kopyala → Claude\'a yapıştır',
    'hero.cta.secondary': 'GitHub kullanıyorum',
    'hero.microtext': 'Tek prompt · Claude her şeyi halleder · Ücretsiz / Açık kaynak',

    'preview.caption': '↑ canlı simülasyon — gerçek output, sıfır edit',

    'what.title': 'Kutudan çıkanlar',
    'what.subtitle': "Boş repo değil — Pocock/AI Engineer'dan distile, gerçek pratik prensipler.",
    'what.card1.title': '14 doctrine kuralı',
    'what.card1.desc':
      'Grill before build, Smart zone (~100K), Memento, Surgical changes, Inner-loop test, Never /init, Hooks > prompts, Rules emerge, Task protocol — hepsi tek tek kanıtla.',
    'what.card2.title': '11 foundational skill',
    'what.card2.desc':
      "grill-me, skill-creator, agent-creator, project-advisor, yardim, suspend, resume, sync-drift — her biri inner-loop test'i geçer.",
    'what.card3.title': 'prompt-engineer subagent',
    'what.card3.desc':
      'BUILD modu (casual istek → structured prompt) + AUDIT modu + her zaman aktif security pass (secrets/injection/SSRF/path traversal).',
    'what.card4.title': 'Intel pipeline (opsiyonel)',
    'what.card4.desc':
      'YouTube + X kanal taraması, transcript indir, Whisper video transcribe, junction-shared canonical store.',
    'what.card5.title': '3 hazır kit',
    'what.card5.desc': '🤖 AI Asistan / 📊 İçerik Takip / 📝 Boş Sayfa — biri seç, gerisi otomatik.',
    'what.card6.title': 'TR/EN wizard',
    'what.card6.desc': "9 sorulu first-run. Her soruda 'Bilmiyor musun?' safety-net. Jargon yok.",

    'how.title': '3 adım',
    'how.s1.title': 'Önkoşul kontrol',
    'how.s1.desc': 'Python / git / Claude Code kurulu mu? Eksik varsa link verir.',
    'how.s2.title': 'Kit seç + bootstrap',
    'how.s2.desc': '3 kitten birini seç. Wizard 4-5 soru. <1 saniyede iskelet hazır.',
    'how.s3.title': 'Claude Code aç',
    'how.s3.desc': "İlk session'da CLAUDE.md wizard'ı tetiklenir. TR/EN sorar, 9 soru, proje hazır.",

    'kits.title': '3 hazır kit',
    'kits.k1.name': 'AI Asistan',
    'kits.k1.desc': 'Müşteri mesajlarına cevap, takvim, mail otomasyon, chatbot.',
    'kits.k1.def': 'Python · Bot/automation odaklı',
    'kits.k2.name': 'İçerik Takip',
    'kits.k2.desc': 'YouTube/X kanalları tarayıp transcript çekip otomatik özet çıkaran bot.',
    'kits.k2.def': 'Python · Intel pipeline + watchlist + KB',
    'kits.k3.name': 'Boş Sayfa',
    'kits.k3.desc': 'Ne yapacağına sen karar vereceksin. Wizard tüm soruları sorar.',
    'kits.k3.def': 'Custom · Full wizard',

    'premium.tag': '$29-49 · LIFETIME UPDATES',
    'premium.title': "Premium kit'ler — waitlist",
    'premium.subtitle1':
      "Core sonsuza dek MIT free. Üstüne niş kullanım için curated kit'ler hazırlıyoruz.",
    'premium.subtitle2': '20+ niyet kaydı olan kit yapılır.',
    'premium.cta': "Waitlist'e yaz →",
    'premium.cta.note': "Discussions'da kit adını + spesifik use-case'ini paylaş",
    'premium.k1.name': 'E-ticaret',
    'premium.k1.desc':
      'Shopify/Woo/Trendyol seller — WhatsApp autoresponder, iade akışı, stok uyarı, müşteri-temsilci subagent.',
    'premium.k1.for': 'TR e-ticaret satıcısı',
    'premium.k2.name': 'Ajans',
    'premium.k2.desc':
      'Multi-client white-label — onboarding, invoice, status update, per-client subagent. Kendi logon.',
    'premium.k2.for': 'Freelancer / 2-5 kişi ajans',
    'premium.k3.name': 'Content Creator',
    'premium.k3.desc':
      'Newsletter draft + video script + SEO pillar + cross-post (X/LinkedIn/IG) + editor subagent.',
    'premium.k3.for': 'Substack / YouTube / SEO blogger',
    'premium.k4.name': 'SaaS Founder',
    'premium.k4.desc':
      'Landing copy, onboarding drip, pricing page, changelog, PMF-grill subagent, launch playbook.',
    'premium.k4.for': 'Solo / 2-kişi pre-product',

    'antif.title': 'Bu starter SİZE göre değil eğer...',
    'antif.no1': 'Hayatınızda terminal açmamışsanız ve niyetiniz yoksa',
    'antif.no2': 'Python / git / Node.js nedir hiç duymamışsanız',
    'antif.no3': '"Sadece bana bir uygulama yaz" arıyorsanız (Lovable, v0, Bubble daha hızlı)',
    'antif.yes.title': 'SİZE göre eğer...',
    'antif.yes1': "Claude Code'u kurdunuz, açtınız, ama \"şimdi ne?\" hissi var",
    'antif.yes2': 'Birkaç defa AI ile proje açtınız, dağıldı, tekrar başladınız',
    'antif.yes3': "Aynı opinionated yapı'yı her projeye otomatik uygulamak istiyorsunuz",
    'antif.yes4': "Pocock/Karpathy disiplini'ni lego setine sahip olmak istiyorsunuz",

    'footer.copy': '© Layermark · MIT lisans · Açık kaynak',
    'footer.issues': 'Issues',

    // /start page
    'start.step': 'ADIM 1 / 1',
    'start.title': 'Bir dosya indir, çift-tıkla.',
    'start.subtitle':
      'Python ve Claude Code yoksa otomatik kontrol edip kuruluma yönlendirir. GitHub hesabı veya terminal komutu gerekmez.',
    'start.win.detected': 'Windows tespit edildi',
    'start.win.title': 'Windows için',
    'start.win.btn': 'start.cmd indir',
    'start.win.note':
      'İndikten sonra Downloads klasöründe start.cmd dosyasına çift-tıkla. SmartScreen uyarısı gelirse "More info" → "Run anyway" tıkla.',
    'start.mac.detected': 'macOS tespit edildi',
    'start.mac.title': 'Mac için en kolay',
    'start.mac.intro':
      'Spotlight aç (Cmd+Space), yaz: terminal, Enter. Açılan pencereye şunu yapıştır + Enter:',
    'start.mac.copy': '📋 Komutu kopyala',
    'start.mac.alt': 'Veya: dosyayı indir, çift-tıkla',
    'start.mac.alt.btn': 'start.command indir',
    'start.mac.alt.note':
      "İlk açılışta: İndirdikten sonra Terminal'de bir kez bu komutu çalıştırman gerek (Mac güvenliği):",
    'start.mac.alt.tip': 'Yukarıdaki tek satır yöntemi bunu atlatır — onu öneririz.',
    'start.linux.detected': 'Linux tespit edildi',
    'start.linux.title': 'Linux için',
    'start.linux.intro': "Terminal'de:",
    'start.unknown.title': 'İşletim sistemini seç',
    'start.next.title': 'Ne olacak?',
    'start.next.s1.t': 'Pencere açılır',
    'start.next.s1.d': 'Siyah ekranlı bir pencere otomatik gelir. Yazı yazmana gerek yok.',
    'start.next.s2.t': 'Otomatik kontrol',
    'start.next.s2.d': 'Python + Claude Code yüklü mü? Eksikse tarayıcı açılır, kuruluma yönlendirir.',
    'start.next.s3.t': '3 soru sorar',
    'start.next.s3.d': 'Hangi tipte proje? Hangi dilde? Hangi klasöre? Cevapla.',
    'start.alt.dev': 'Geliştiriciyim, terminal kullanıyorum →',
    'start.alt.dev.win': 'Windows PowerShell tek satır',
    'start.alt.dev.mac': 'Mac/Linux Terminal tek satır',
    'start.alt.dev.git': 'Manuel git clone',
    'start.alt.gh': 'GitHub hesabım var, Use Template istiyorum →',
    'start.alt.gh.note':
      "GitHub'da kendi repo'nu oluştur, sonra lokal'e klonla. Daha hızlı eğer GitHub'a alışkınsan.",
    'start.alt.gh.btn': "GitHub'da template kullan →",
    'start.support.intro': 'Sıkıntı çıkarsa',
    'start.support.issue': 'issue aç',
    'start.support.or': 'ya da',
    'start.support.disc': "Discussions'a yaz",

    // Lane selector
    'start.lane.easy': '🚀 Hızlı',
    'start.lane.easy.sub': 'Tek dosya çift-tıkla',
    'start.lane.manual': '👀 Görerek',
    'start.lane.manual.sub': 'Komut komut, copy-paste',
    'start.lane.dev': '⚡ Geliştirici',
    'start.lane.dev.sub': 'Tek satır / git clone',

    // Manual lane
    'start.manual.title': 'Komut komut adım-adım',
    'start.manual.intro':
      'Hiçbir dosya indirmeden, her komutu kendi gözünle görüp kopyala-yapıştır yöntemi. Terminal aç, sırayla yapıştır.',
    'start.manual.copy': 'kopyala',
    'start.manual.copied': 'kopyalandı',
    'start.manual.note':
      "İlk 3 komut hata verirse o önkoşul eksik — ilgili siteden kur (python.org / nodejs.org), sonra devam.",

    // Dev lane
    'start.dev.title': 'Geliştirici yolu',
    'start.dev.intro': 'Terminal arayüzüne aşinasan en hızlı yol bu.',
    'start.dev.win': 'Windows PowerShell tek satır',
    'start.dev.mac': 'Mac/Linux Terminal tek satır',
    'start.dev.git': 'Manuel git clone',

    // Transparency
    'start.transparency.title': 'Bu dosya ne yapıyor? (göster)',
    'start.transparency.intro': 'Script açık kaynak, GitHub\'da herkesin gözü önünde. 5 adım yapıyor:',
    'start.transparency.s1': 'Python yüklü mü kontrol eder; eksikse python.org tarayıcıda açar, sen kurana kadar bekler',
    'start.transparency.s2': 'Node.js yüklü mü kontrol eder (Claude Code\'u kurmak için npm gerek); eksikse nodejs.org açar',
    'start.transparency.s3': 'Claude Code CLI yüklü mü kontrol eder; eksikse npm ile otomatik kurar',
    'start.transparency.s4': 'GitHub\'dan zip indirir (~250 KB), bir geçici klasöre çıkarır',
    'start.transparency.s5': 'setup_starter.py\'i çalıştırır (kit seç + 4-5 soru), proje klasörünü oluşturur, geçici dosyaları siler',
    'start.transparency.source': 'Kaynak kod:',

    // Updated next steps + warning
    'start.next.s4.t': 'Klasöre git + Claude Code aç',
    'start.next.s4.d': "Yeni proje klasörünü aç, içinde terminal aç, 'claude' yaz. (claude.ai web sitesi DEĞİL — terminal aracı)",
    'start.next.s5.t': "'merhaba' yaz",
    'start.next.s5.d': "Claude Code'a herhangi bir mesaj (örn: merhaba) yaz — wizard otomatik başlar (Phase 0: TR/EN, Phase 1-4: 9 soru).",
    'start.warning.title': 'claude.ai (web) ≠ Claude Code (CLI)',
    'start.warning.desc':
      "Bizim wizard sadece terminal'de çalışan Claude Code CLI ile çalışır. claude.ai tarayıcıda açılan bir chat ürünü, CLAUDE.md okuyamaz.",

    // V2 — prompt-paste flow
    'start.v2.title': 'Claude Code\'a tek prompt yapıştır.',
    'start.v2.subtitle':
      'Claude Code zaten kuruluysa: aşağıdaki prompt\'u kopyala, yapıştır, gerisini Claude halleder. Eksik bir şey varsa Claude sana söyler.',
    'start.v2.s1.title': 'Claude Code\'u aç',
    'start.v2.s1.desc':
      'Terminalden "claude" yaz, ya da Claude Code uygulamasını aç. Boş bir konuşma başlat.',
    'start.v2.s1.hint': 'Claude Code\'un yok mu?',
    'start.v2.s2.title': 'Bu prompt\'u kopyala',
    'start.v2.s2.desc':
      'Claude\'a tüm kurulumu yapması için talimat. Her adım açık — git/python eksikse seninle konuşur, hiçbir şeyi senden habersiz yapmaz.',
    'start.v2.copy': 'Prompt\'u kopyala',
    'start.v2.copied': 'Kopyalandı',
    'start.v2.s3.title': 'Claude Code\'a yapıştır + Enter',
    'start.v2.s3.desc':
      'Claude prompt\'u okur, önce önkoşulları kontrol eder, sonra repo\'yu çeker, setup\'ı çalıştırır, sonunda CLAUDE.md wizard\'ını başlatır. 5-10 dk sürebilir, sen sadece sorulara cevap verirsin.',
    'start.v2.flow.title': 'Claude şunları yapacak:',
    'start.v2.flow.f1': 'Önkoşulları kontrol et (git, python). Eksikse sana plain-Türkçe ne yapacağını söyler.',
    'start.v2.flow.f2': 'layermark-starter repo\'sunu klonlar.',
    'start.v2.flow.f3': 'setup_starter.py\'i çalıştırır → kit seç + 4-5 soru → Masaüstü\'nde proje klasörü oluşur.',
    'start.v2.flow.f4': 'Yeni projenin CLAUDE.md\'sini okur, içindeki wizard direktifini takip eder (TR/EN seç + 9 soru).',
    'start.v2.flow.f5': 'Wizard biter; CLAUDE.md doldurulur, geçici klasör temizlenir, projen hazırdır.',
    'start.v2.alt.noclaude': 'Claude Code\'um yok →',
    'start.v2.alt.noclaude.desc':
      'Claude Code Anthropic\'in resmi terminal aracı. claude.ai/code adresinden kurulum talimatları alabilirsin. Kurduktan sonra buraya geri dön.',
    'start.v2.alt.noclaude.btn': 'claude.ai/code\'a git →',
    'start.v2.alt.manual': 'Bunlar yerine manuel kurmak istiyorum →',
    'start.v2.alt.manual.desc': '3 alternatif: git clone, indirme script\'i, GitHub Use Template.',
    'start.v2.alt.manual.script': 'İndirme script\'i (Node.js + Python kontrolü içerir)',
    'start.v2.alt.manual.gh': 'GitHub Use Template',
  },
  en: {
    'nav.how': 'How',
    'nav.what': 'What ships',
    'nav.kits': 'Kits',
    'nav.premium': 'Premium',
    'nav.github': 'GitHub',

    'hero.tag': 'v0.4 · TR/EN · MIT',
    'hero.title.1': 'Claude Code projects,',
    'hero.title.accent': 'in 1 minute',
    'hero.title.2': 'opinionated scaffold.',
    'hero.subtitle':
      'Pocock + AI Engineer + Karpathy doctrine pre-shipped. 11 foundational skills, 1 subagent, security audit, intel pipeline, TR/EN wizard — not setting up, ready.',
    'hero.cta.primary': '📋 Copy prompt → paste in Claude',
    'hero.cta.secondary': "I'm using GitHub",
    'hero.microtext': 'One prompt · Claude handles everything · Free / Open source',

    'preview.caption': '↑ live simulation — real output, zero edits',

    'what.title': "What's in the box",
    'what.subtitle': 'Not an empty repo — distilled from Pocock/AI Engineer, real practical principles.',
    'what.card1.title': '14 doctrine rules',
    'what.card1.desc':
      'Grill before build, Smart zone (~100K), Memento, Surgical changes, Inner-loop test, Never /init, Hooks > prompts, Rules emerge, Task protocol — each individually proven.',
    'what.card2.title': '11 foundational skills',
    'what.card2.desc':
      'grill-me, skill-creator, agent-creator, project-advisor, help (yardim), suspend, resume, sync-drift — each passes the inner-loop test.',
    'what.card3.title': 'prompt-engineer subagent',
    'what.card3.desc':
      'BUILD mode (casual request → structured prompt) + AUDIT mode + always-on security pass (secrets/injection/SSRF/path traversal).',
    'what.card4.title': 'Intel pipeline (optional)',
    'what.card4.desc':
      'YouTube + X channel scanning, transcript download, Whisper video transcription, junction-shared canonical store.',
    'what.card5.title': '3 ready-made kits',
    'what.card5.desc': '🤖 AI Assistant / 📊 Content Tracker / 📝 Blank Slate — pick one, rest is automatic.',
    'what.card6.title': 'TR/EN wizard',
    'what.card6.desc': "9-question first-run. Each question has a 'Don't know?' safety net. No jargon.",

    'how.title': '3 steps',
    'how.s1.title': 'Pre-flight check',
    'how.s1.desc': 'Python / git / Claude Code installed? Missing ones get a link.',
    'how.s2.title': 'Pick a kit + bootstrap',
    'how.s2.desc': 'Pick one of 3 kits. Wizard asks 4-5 questions. <1 second to scaffold.',
    'how.s3.title': 'Open Claude Code',
    'how.s3.desc': 'First session triggers the CLAUDE.md wizard. TR/EN, 9 questions, project ready.',

    'kits.title': '3 ready-made kits',
    'kits.k1.name': 'AI Assistant',
    'kits.k1.desc': 'Customer message replies, calendar, email automation, chatbot.',
    'kits.k1.def': 'Python · Bot/automation focus',
    'kits.k2.name': 'Content Tracker',
    'kits.k2.desc': 'A bot that scans YouTube/X channels, pulls transcripts, auto-summarizes.',
    'kits.k2.def': 'Python · Intel pipeline + watchlist + KB',
    'kits.k3.name': 'Blank Slate',
    'kits.k3.desc': "You decide what to build. Wizard asks every question.",
    'kits.k3.def': 'Custom · Full wizard',

    'premium.tag': '$29-49 · LIFETIME UPDATES',
    'premium.title': 'Premium kits — waitlist',
    'premium.subtitle1': 'Core stays MIT-free forever. On top, curated kits for niche use.',
    'premium.subtitle2': 'A kit only ships after 20+ intent signups.',
    'premium.cta': 'Join waitlist →',
    'premium.cta.note': "Post the kit name + your specific use-case in Discussions",
    'premium.k1.name': 'E-commerce',
    'premium.k1.desc':
      'Shopify/Woo/Trendyol seller — WhatsApp autoresponder, returns flow, stock alerts, customer-rep subagent.',
    'premium.k1.for': 'TR e-commerce seller',
    'premium.k2.name': 'Agency',
    'premium.k2.desc':
      'Multi-client white-label — onboarding, invoice, status update, per-client subagent. Your logo.',
    'premium.k2.for': 'Freelancer / 2-5 person agency',
    'premium.k3.name': 'Content Creator',
    'premium.k3.desc':
      'Newsletter draft + video script + SEO pillar + cross-post (X/LinkedIn/IG) + editor subagent.',
    'premium.k3.for': 'Substack / YouTube / SEO blogger',
    'premium.k4.name': 'SaaS Founder',
    'premium.k4.desc':
      'Landing copy, onboarding drip, pricing page, changelog, PMF-grill subagent, launch playbook.',
    'premium.k4.for': 'Solo / 2-person pre-product',

    'antif.title': "This starter is NOT for you if...",
    'antif.no1': "You've never opened a terminal and don't intend to",
    'antif.no2': "You've never heard of Python / git / Node.js",
    'antif.no3': '"Just build me an app" is what you want (Lovable, v0, Bubble are faster)',
    'antif.yes.title': 'It IS for you if...',
    'antif.yes1': "You installed Claude Code, opened it, but feel \"now what?\"",
    'antif.yes2': "You've started a few AI projects that fell apart, restarted",
    'antif.yes3': 'You want to apply the same opinionated structure to every project automatically',
    'antif.yes4': 'You want a Lego set of Pocock/Karpathy discipline',

    'footer.copy': '© Layermark · MIT license · Open source',
    'footer.issues': 'Issues',

    // /start page
    'start.step': 'STEP 1 / 1',
    'start.title': 'Download a file, double-click.',
    'start.subtitle':
      "If Python or Claude Code is missing it auto-detects and walks you through install. No GitHub account or terminal commands needed.",
    'start.win.detected': 'Windows detected',
    'start.win.title': 'For Windows',
    'start.win.btn': 'Download start.cmd',
    'start.win.note':
      'After download, double-click start.cmd in your Downloads folder. If SmartScreen warns, click "More info" → "Run anyway".',
    'start.mac.detected': 'macOS detected',
    'start.mac.title': 'Easiest on Mac',
    'start.mac.intro': 'Open Spotlight (Cmd+Space), type: terminal, Enter. Paste this + Enter:',
    'start.mac.copy': '📋 Copy command',
    'start.mac.alt': 'Or: download the file, double-click',
    'start.mac.alt.btn': 'Download start.command',
    'start.mac.alt.note':
      'First run: after downloading, run this once in Terminal (Mac security):',
    'start.mac.alt.tip': 'The one-line method above skips this — we recommend it.',
    'start.linux.detected': 'Linux detected',
    'start.linux.title': 'For Linux',
    'start.linux.intro': 'In a terminal:',
    'start.unknown.title': 'Choose your OS',
    'start.next.title': 'What happens next?',
    'start.next.s1.t': 'A window opens',
    'start.next.s1.d': "A black-screen window appears automatically. No typing needed.",
    'start.next.s2.t': 'Auto-check',
    'start.next.s2.d': "Python + Claude Code installed? If not, the browser opens to install pages.",
    'start.next.s3.t': '3 questions',
    'start.next.s3.d': 'What kind of project? What language? Which folder? Just answer.',
    'start.alt.dev': "I'm a developer, I use terminals →",
    'start.alt.dev.win': 'Windows PowerShell one-liner',
    'start.alt.dev.mac': 'Mac/Linux Terminal one-liner',
    'start.alt.dev.git': 'Manual git clone',
    'start.alt.gh': 'I have GitHub, I want Use Template →',
    'start.alt.gh.note':
      'Create your own repo on GitHub, then clone locally. Faster if you know GitHub.',
    'start.alt.gh.btn': 'Use template on GitHub →',
    'start.support.intro': 'Hit a snag?',
    'start.support.issue': 'open an issue',
    'start.support.or': 'or',
    'start.support.disc': 'post in Discussions',

    // Lane selector
    'start.lane.easy': '🚀 Quick',
    'start.lane.easy.sub': 'One file, double-click',
    'start.lane.manual': '👀 See each step',
    'start.lane.manual.sub': 'Command-by-command, copy-paste',
    'start.lane.dev': '⚡ Developer',
    'start.lane.dev.sub': 'One-liner / git clone',

    // Manual lane
    'start.manual.title': 'Step-by-step commands',
    'start.manual.intro':
      "No file download. Open a terminal, paste each command in order. You see exactly what's happening.",
    'start.manual.copy': 'copy',
    'start.manual.copied': 'copied',
    'start.manual.note':
      'If first 3 commands error out, that prereq is missing — install from the relevant site (python.org / nodejs.org), then continue.',

    // Dev lane
    'start.dev.title': 'Developer path',
    'start.dev.intro': "If you're comfortable in a terminal, this is the fastest route.",
    'start.dev.win': 'Windows PowerShell one-liner',
    'start.dev.mac': 'Mac/Linux Terminal one-liner',
    'start.dev.git': 'Manual git clone',

    // Transparency
    'start.transparency.title': 'What does this file do? (show me)',
    'start.transparency.intro': "Script is open-source, public on GitHub. It does 5 things:",
    'start.transparency.s1':
      'Checks if Python is installed; if missing, opens python.org in your browser, waits for you to install',
    'start.transparency.s2':
      "Checks if Node.js is installed (npm needed for Claude Code); opens nodejs.org if missing",
    'start.transparency.s3':
      'Checks if Claude Code CLI is installed; if missing, runs npm install automatically',
    'start.transparency.s4': 'Downloads the starter zip from GitHub (~250 KB), extracts to a temp folder',
    'start.transparency.s5':
      'Runs setup_starter.py (kit picker + 4-5 questions), creates your project folder, cleans up temp files',
    'start.transparency.source': 'Source code:',

    // Updated next steps + warning
    'start.next.s4.t': 'Open project + start Claude Code',
    'start.next.s4.d':
      "Open the new project folder, open a terminal there, type 'claude'. (NOT claude.ai web — terminal tool.)",
    'start.next.s5.t': "Type 'hello'",
    'start.next.s5.d':
      "In Claude Code, send any message (like 'merhaba' or 'hi') — wizard auto-starts (Phase 0: TR/EN, Phase 1-4: 9 questions).",
    'start.warning.title': 'claude.ai (web) ≠ Claude Code (CLI)',
    'start.warning.desc':
      "Our wizard only works with Claude Code CLI in the terminal. claude.ai is a browser chat product, it can't read CLAUDE.md files.",

    // V2 — prompt-paste flow
    'start.v2.title': 'Paste a single prompt into Claude Code.',
    'start.v2.subtitle':
      "If Claude Code is already installed: copy the prompt below, paste it, Claude handles the rest. Missing anything? Claude tells you.",
    'start.v2.s1.title': 'Open Claude Code',
    'start.v2.s1.desc': 'Type "claude" in your terminal or open the Claude Code app. Start a fresh conversation.',
    'start.v2.s1.hint': "Don't have Claude Code?",
    'start.v2.s2.title': 'Copy this prompt',
    'start.v2.s2.desc':
      'Instructions for Claude to do the entire setup. Each step is explicit — if git/python is missing, Claude asks you, never installs without confirming.',
    'start.v2.copy': 'Copy prompt',
    'start.v2.copied': 'Copied',
    'start.v2.s3.title': 'Paste into Claude Code + hit Enter',
    'start.v2.s3.desc':
      "Claude reads the prompt, checks prerequisites, clones the repo, runs setup, and finally triggers the CLAUDE.md wizard. 5-10 min total — you just answer the questions.",
    'start.v2.flow.title': 'What Claude will do:',
    'start.v2.flow.f1': 'Check prerequisites (git, python). If missing, plain-English tells you what to do.',
    'start.v2.flow.f2': 'Clone the layermark-starter repo.',
    'start.v2.flow.f3': "Run setup_starter.py → pick a kit + 4-5 questions → project folder created on Desktop.",
    'start.v2.flow.f4': "Read the new project's CLAUDE.md, follow the wizard directive (TR/EN pick + 9 questions).",
    'start.v2.flow.f5': "Wizard completes; CLAUDE.md filled in, temp folder cleaned, your project is ready.",
    'start.v2.alt.noclaude': "I don't have Claude Code →",
    'start.v2.alt.noclaude.desc':
      "Claude Code is Anthropic's official terminal tool. Install instructions at claude.ai/code. Come back here after installing.",
    'start.v2.alt.noclaude.btn': 'Go to claude.ai/code →',
    'start.v2.alt.manual': 'I want to install manually instead →',
    'start.v2.alt.manual.desc': '3 alternatives: git clone, download script, or GitHub Use Template.',
    'start.v2.alt.manual.script': 'Download script (includes Node.js + Python check)',
    'start.v2.alt.manual.gh': 'GitHub Use Template',
  },
} as const;

type Key = keyof typeof translations.tr;

const I18nContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: 'tr',
  setLang: () => {},
  t: (k: Key) => translations.tr[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('tr');

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && localStorage.getItem('layermark-lang')) as Lang | null;
    if (saved === 'tr' || saved === 'en') {
      setLangState(saved);
      return;
    }
    if (typeof navigator !== 'undefined' && navigator.language && !navigator.language.startsWith('tr')) {
      setLangState('en');
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== 'undefined') localStorage.setItem('layermark-lang', l);
  };

  const t = (k: Key) => translations[lang][k] ?? translations.tr[k];

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext);
}

export function LangToggle() {
  const { lang, setLang } = useT();
  return (
    <div className="flex items-center gap-1 text-xs font-mono">
      <button
        onClick={() => setLang('tr')}
        className={`px-2 py-1 rounded transition ${lang === 'tr' ? 'bg-accent text-bg' : 'text-muted hover:text-text'}`}
        aria-label="Türkçe"
      >
        TR
      </button>
      <span className="text-muted">|</span>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded transition ${lang === 'en' ? 'bg-accent text-bg' : 'text-muted hover:text-text'}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
