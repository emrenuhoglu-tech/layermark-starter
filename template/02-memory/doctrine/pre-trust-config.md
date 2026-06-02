# Pre-trust config execution gap

> **Harness configuration doctrine.** Hooks, sandboxes, classifier'lar — agent harness'ı **kullanıcı "trust this folder?" prompt'unu cevaplamadan ÖNCE** çalışan tüm config yüzeyleri için **şart**.
>
> **Kaynak:** Anthropic Engineering "Containment: Defense-in-depth for Claude Code" (2026-06-01) + Claude Code CVE pattern (hooks execute before trust gate).

## Niye gerek?

Claude Code'da `.claude/settings.json` içindeki hook'lar — özellikle `SessionStart` — kullanıcı **"Do you trust the files in this folder?"** promptunu cevaplamadan ÖNCE çalışıyor. Pattern:

1. Saldırgan `.claude/settings.json` + zararlı `hooks/foo.sh` commit eder
2. Kullanıcı repo'yu `git clone` + `claude` çalıştırır
3. Hook **trust gate'i geçmeden** execute olur → arbitrary code execution
4. Trust prompt geldiğinde iş zaten bitmiş

Aynı pattern `~/.claude/hooks/auto-push.sh` gibi global hook'larda da geçerli: hook her `Stop` event'inde çalışır, **cwd'nin gerçekten kullanıcının kendi projesi olduğunu doğrulamadan**.

## Trust marker pattern

Her hook execution'ı, **explicit trust marker** kontrolü ile gate'li olmalı. Marker dosyası repo root'ta:

```
.claude/.trusted
```

Boş dosya yeterli — varlığı = "bu cwd kullanıcı tarafından trust edilmiş" signal'i. Marker dosyası **manuel** yaratılır (script tarafından değil), `git`'e commit edilmez (`.gitignore`'a girer).

```gitignore
# .gitignore
.claude/.trusted
```

## Hook gate template

Tüm hook'lar (global veya proje-local) bu 3-aşamalı kapıdan geçmeli:

```bash
#!/usr/bin/env bash
# Hook gate template

set -uo pipefail
cat >/dev/null 2>&1 || true  # consume stdin

# Gate 1: must be in a git repo
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Gate 2: must have explicit trust marker
git_root=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
[ -n "$git_root" ] && [ -f "$git_root/.claude/.trusted" ] || exit 0

# Gate 3: hook-specific safety checks (clean tree, branch policy, etc.)
# ... actual hook logic here
```

`auto-push.sh` zaten Gate 1 + Gate 3 (branch policy + clean tree) uyguluyor — Gate 2 (trust marker) eksik. **Tüm** layermark-distributed hook'lar üç gate'i de uygulamak zorunda.

## `SessionStart` özel kuralı

`SessionStart` hook'ları en yüksek risk — kullanıcı henüz prompt görmeden çalışır. Bu event'e bağlı hook'lar layermark template'lerinde **default disabled**:

```jsonc
// template/.claude/settings.json.tmpl
{
  "hooks": {
    "SessionStart": [],  // explicit empty — disabled by default
    "Stop": [
      { "command": "$HOME/.claude/hooks/auto-push.sh" }
    ]
  }
}
```

Bir layermark template `SessionStart` hook'u önerdiğinde:
- README'de explicit "manual enable required" warning
- `setup_starter.py` install sırasında prompt göstermek zorunda
- Default value boş array

## `settings.local.json` öncelik kuralı

`.claude/settings.json` (committed) vs `.claude/settings.local.json` (gitignored) — saldırgan **committed** dosyaya zararlı hook ekler. Defense:

- Hook command path'leri sadece **absolute** veya `$HOME` prefix'li olabilir (`./` veya relative path = reject)
- Hook command'lar repo içinden çalıştırılamaz (örn. `./scripts/foo.sh` blocked)
- Kullanıcı-spesifik komutlar `settings.local.json`'a (gitignored), team-wide komutlar `settings.json`'a

## Verifying existing hooks

Yeni bir layermark project setup edildiğinde `setup_starter.py` shouldcheck:

```python
def audit_hooks(project_root: Path) -> list[str]:
    findings = []
    settings = project_root / ".claude" / "settings.json"
    if not settings.exists():
        return findings
    cfg = json.loads(settings.read_text())
    for event, hooks in cfg.get("hooks", {}).items():
        for h in hooks:
            cmd = h.get("command", "")
            if cmd.startswith("./") or "../" in cmd:
                findings.append(f"{event}: relative path hook — reject ({cmd})")
            if event == "SessionStart" and hooks:
                findings.append(f"SessionStart hook present — manual review required")
    return findings
```

Findings boş değilse setup abort + manuel review.

## Ne zaman silebilirsin?

Layermark template kullanmayan, hook config'i olmayan, tek-shot prototype için N/A. **Hook config'i olan her proje için şart** — auto-push hook'u zaten global olarak aktif olduğundan bu doctrine layermark'ın tüm distribution'ında uygulanmalı.
