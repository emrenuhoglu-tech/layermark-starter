# skill_tuner — description rewriting (Anthropic vendor)

Skill description'ları yanlış tetikliyorsa (false negative / false positive) eval-driven rewrite için tek-script vendor.

## Ne yapar

`improve_description.py`:
1. Mevcut skill'i okur (`.claude/skills/<name>.md` ya da `<name>/SKILL.md`)
2. Eval results JSON'unu okur (sen üretirsin — kullandığın query'leri + tetiklenme sayılarını yazarsın)
3. `claude -p` çağırır → Anthropic'in description-rewrite prompt'unu çalıştırır
4. Yeni description'ı stdout'a JSON olarak basar

## Ne yapmaz

- **Otomatik eval çalıştırmaz.** Eval results JSON'unu sen üretirsin. Tam eval pipeline (otomatik trigger testleri, grader subagent, HTML viewer) istiyorsan Anthropic'in resmi plugin'ini chain et: `gh extension install anthropics/claude-plugins` → `/skill-creator` (Anthropic).
- **Description'ı dosyaya yazmaz.** Çıktıyı görüp manuel olarak `.md` frontmatter'ına yapıştırırsın (audit için iyi — model bazen 100% kötü öneri sunabilir).

## Kullanım

### 1. Eval results JSON'unu doldur

`eval_results_template.json`'u kopyala, `eval_results_<skill>.json` yap. Her query için:

- `should_trigger: true` → skill bunda tetiklenmeli
- `should_trigger: false` → skill bunda **tetiklenmemeli** (yanlış alarm)
- `runs: N` → query'yi kaç kere test ettin
- `triggers: M` → skill kaç kere tetiklendi
- `pass: true` → `triggers == runs` (true positive) **veya** `triggers == 0 && should_trigger == false` (true negative)

Minimum 8-10 query yeterli (4-5 trigger + 4-5 non-trigger). 20+ olursa overfitting'e dikkat.

### 2. Çalıştır

```bash
python template/scripts/skill_tuner/improve_description.py \
  --eval-results eval_results_my_skill.json \
  --skill-path .claude/skills/my-skill.md \
  --verbose
```

Layermark single-file (`<name>.md`) ve Anthropic folder format (`<name>/SKILL.md`) ikisi de destekli.

### 3. Çıktıyı incele

```json
{
  "description": "Use when ... (improved version)",
  "history": [...]
}
```

`description`'ı al, skill'in frontmatter'ına manuel yapıştır. **Kör yapıştırma yapma** — yeni description eski'sinden anlamlı farklı mı, generic-leş­miş mi, trigger word'ler hâlâ var mı kontrol et.

### 4. Re-eval (opsiyonel)

Yeni description'ı 1 hafta canlıda dene. Hâlâ yanlış tetikliyorsa: history'i de besle ki model aynı önerileri tekrarlamasın:

```bash
python improve_description.py \
  --eval-results eval_results_v2.json \
  --skill-path .claude/skills/my-skill.md \
  --history history_v1.json \
  --verbose
```

## Ne zaman bu yetmez — Anthropic full plugin'e chain

Bu vendor tek script. Tam lifecycle (auto-eval, grader subagent, HTML viewer, packager) gerekirse:

```bash
gh extension install anthropics/claude-plugins
# sonra Claude Code'da:
/skill-creator  # Anthropic versiyonu
```

**Anthropic plugin folder format bekler** (`<name>/SKILL.md`). Layermark single-file skill'i dönüştürmek için: `.claude/skills/foo.md` → `.claude/skills/foo/SKILL.md` taşı, scripts klasörü açabilirsin. Geri dönüşü güç değil ama overlap doctrine kontrolünden geçirip karar ver — bkz `template/.claude/skills/skill-creator.md` Step 6.

## Lisans

Bu klasördeki `improve_description.py` ve `utils.py` Anthropic'in açık kaynak `claude-plugins-official` reposundan vendor'landı (Apache-2.0). Original kaynak:

- https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator/skills/skill-creator/scripts

Tam lisans metni: `LICENSE` (bu klasörde). Yapılan adaptasyonlar:
1. `from scripts.utils import` → `from utils import` (flat layout)
2. `parse_skill_md` artık hem folder hem single-file `.md` formatını kabul ediyor
3. `--model` default değeri eklendi (`claude-sonnet-4-6`)

Diğer kod davranışsal olarak değiştirilmedi.
