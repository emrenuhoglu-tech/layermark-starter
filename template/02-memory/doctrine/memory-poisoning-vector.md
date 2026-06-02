# Memory poisoning vector

> **Persistence / template-distribution doctrine.** `CLAUDE.md`, `MEMORY.md`, `.claude/skills/*`, `.claude/agents/*`, `02-memory/doctrine/*` — her session başında reload edilen tüm dosyalar için **şart**. Layermark gibi template-as-doctrine distributor için ekstra kritik.
>
> **Kaynak:** Anthropic Engineering "Containment: Defense-in-depth for Claude Code" (2026-06-01).

## Niye gerek?

Claude Code session başlatırken **otomatik** olarak şu dosyaları context'e yükler:

- `<project_root>/CLAUDE.md` (proje memory)
- `<project_root>/.claude/skills/*.md` (skill tanımları)
- `<project_root>/.claude/agents/*.md` (sub-agent prompt'ları)
- `~/.claude/CLAUDE.md` (global user memory)
- `~/.claude/projects/<project>/memory/MEMORY.md` (auto-memory)
- Layermark'ta: `02-memory/doctrine/*.md` (transitively referenced from CLAUDE.md)

Bu dosyalar **trust** kategorisinde — model bunları "kendi instruction'larım" olarak işler, tool output gibi sanitize **etmez**. Saldırgan herhangi birine prompt injection enjekte ederse:

1. **Persistent** — restart, /clear, yeni session — hepsinde reload
2. **Silent** — kullanıcı her session başında bu dosyaları okumaz
3. **Privilege** — user-instruction seviyesinde, tool output sanitization'a tabi değil

Layermark için **double risk**: template-as-doctrine distributor. Upstream `template/02-memory/doctrine/*` poisoned commit'i merge edersek, `setup_starter.py` ile kurulan **tüm downstream proje** poisoned. Tek bir commit = N proje compromise.

## 3 katmanlı savunma

### Katman 1: Code review gate (zorunlu)

Memory dosyalarına değişiklik = **mandatory PR review**. Layermark repo'sunda `.github/CODEOWNERS`:

```
template/02-memory/**         @owner-handle
template/.claude/skills/**    @owner-handle
template/.claude/agents/**    @owner-handle
template/CLAUDE.md.tmpl       @owner-handle
```

Auto-merge bots, dependabot, untrusted contributor PR'lar — bu path'lere dokunamaz approval olmadan.

### Katman 2: Weekly heuristic scan

Otomatik scanner haftada bir tüm memory dosyalarını tarar. Kullanım:

```bash
python template/scripts/check-memory-poisoning.py \
  --target . \
  --output reports/memory-scan-$(date +%Y%m%d).jsonl
```

Şüpheli pattern'lar (script implementation detayı için `template/scripts/check-memory-poisoning.py` header'ına bak):

- **Code execution**: `subprocess.`, `os.system(`, `eval(`, `exec(`, `__import__`
- **Encoded payload**: base64 block > 100 chars (gizli payload sinyali)
- **External fetch**: `curl`, `wget`, `requests.get(` non-trusted domain'lere
- **Role-hijack phrases**: *"ignore previous instructions"*, *"you are now"*, *"system: override"*, *"new role:"*, *"forget your"*
- **Hidden steering**: zero-width chars, RTL override, comment-hidden directives

Exit code 1 → CI gate, manuel review.

### Katman 3: Session startup hash comparison

Session başlamadan önce reference hash ile karşılaştır:

```bash
# .claude/memory-hashes.json (committed)
{
  "CLAUDE.md": "sha256:abc...",
  "02-memory/doctrine/auto-mode-classifier.md": "sha256:def...",
  ...
}

# Hook: SessionStart (trust marker gated — bkz: pre-trust-config doctrine)
python template/scripts/check-memory-poisoning.py --verify-hashes
```

Hash uyuşmazsa: agent başlatma abort, kullanıcı manuel onay verene kadar diff prompt'u göster. Local edit normaldir — kullanıcı "yes, my change" der, hash güncellenir. Saldırgan upstream commit'i için **bilinmeyen diff** = stop.

## Layermark distribution kuralı

`setup_starter.py` yeni proje kurarken:

1. Template'i kopyalar
2. **Aynı anda** `template/scripts/check-memory-poisoning.py --target <new-project>` çalıştırır
3. Clean değilse setup abort + finding'leri kullanıcıya göster
4. `memory-hashes.json` yeni proje root'una yazılır

Böylece layermark template'i kendi kendini "doğum öncesi" tarar — distribution pipeline'ında poisoning yakalanır.

## Self-poisoning anti-pattern

Anti-pattern: Claude'a *"my memory'sini güncelle"* dedirtmek. Eğer Claude `~/.claude/CLAUDE.md` veya `02-memory/doctrine/*` dosyasını yazabiliyorsa, kötü niyetli bir prompt veya hallucinated bir "improvement" memory'yi kalıcı olarak kirletir. Kural:

- Memory file edit = **insan-driven only**, prompt-driven değil
- Agent self-modify memory **disallowed by default** (settings.json `permissions.deny`: `Write(CLAUDE.md)`, `Write(02-memory/doctrine/**)`, `Write(.claude/skills/**)`)
- Override için CLI flag (`--allow-memory-edit`) + manuel diff confirmation

## Trigger telling

Memory poisoning genelde sessiz; ama davranışsal sinyaller var:

- Agent doctrine'a uymayan ama "doctrine dedi" diye iddialı action alıyor → memory diff'i kontrol et
- Yeni komut/tool referansı belirdi (kullanıcı eklemedi) → memory injection olası
- Agent bilinmeyen domain'e fetch öneriyor → role-hijack phrasing geldi mi?

## Ne zaman silebilirsin?

Hiç `CLAUDE.md` veya skill/agent file kullanmayan, tamamen ephemeral prompt-only setup için N/A. Layermark template kullanan veya commit'lenmiş memory file'ı olan herkes için **şart**.

## Referans

- Scanner script: `template/scripts/check-memory-poisoning.py`
- Pre-trust gate (hooks tarafı): `template/02-memory/doctrine/pre-trust-config.md`
- Sub-agent free-text trust: `template/02-memory/doctrine/sub-agent-trust-escalation.md`
