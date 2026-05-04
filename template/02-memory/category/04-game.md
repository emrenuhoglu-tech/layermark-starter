# Kategori: Oyun geliştirme

## Tipik kullanım
Game prototype, mechanic exploration, level design, narrative branch, balancing iteration.

## Risk profili
**Low-Medium.** Oyun çıktısı eğlence; gerçek hayat zararı yok. Asset versioning + playtest discipline tedbir.

## Doctrine emphasis
1. **Verification (D6)** — her mechanic değişikliği = playtest oturumu (verify-agent-output)
2. **Simplicity first (D5)** — over-engineering en büyük tuzak; "fun" baseline'ı her zaman
3. **Memento (D3)** — design iteration uzun, fresh window'da prototype'a temiz bak
4. **Rules emerge (D9)** — mechanic kuralları playtest'te doğal oluşur
5. **Surgical changes (D4)** — game balance ayarı çok-değişken, surgical değişiklik kritik

## 7 spesifik pattern

### 1. Design diary
`02-memory/design-diary.md` — her playtest oturumu sonrası kısa not (ne çalıştı, ne çalışmadı, yeni hipotez). Memento operationalize.

### 2. Asset versioning
Sprite/audio/model dosyaları → git LFS veya separate `assets/` repo. Source-of-truth + version trail.

### 3. Playtest log
`data/playtests/<date>.jsonl` — her oturum: kim, kaç dk, fun-rating, blocker, AHA moment. 5+ playtest sonrası pattern emerge.

### 4. Mechanic isolation
Yeni mechanic = ayrı branch + standalone test scene. Main game'e merge etme öncesi solo playtest.

### 5. Balance spreadsheet (data-driven)
Sayısal değerler (HP, damage, cooldown) hard-code değil — `config/balance.yaml`. Iteration hızı 10x.

### 6. Anti-feature creep
Yeni idea geldiğinde: "Core fun loop'u zedeler mi?" sor. "Daha sonra" listesine yaz, hemen yapma.

### 7. Reference card
`02-memory/genre-reference.md` — bu oyunun yapmaya çalıştığı genre'ın 3 örneği + ne aldık ne reddettik. Originality + öğrenme dengesi.

## Önerilen skill'ler
- `grill-me` — yeni mechanic spec öncesi
- `suspend` + `resume` — uzun design iteration session'ları
- `failing-test-as-prompt` — mechanic için test = "fun-rubric" (Claude as judge)
- `project-advisor` — milestone audit (alpha/beta/release)
- `ne-yapayim` — stuck'ken 4-option menü (özellikle game design block için)

## Sample first-task prompt
> *"İlk mechanic: 'gravity-flip puzzle'. Önce paper prototype + 1-paragraf design intent (`02-memory/design-diary.md`'a yaz). Sonra solo playtest scene, 3 puzzle. Balance değerleri `config/balance.yaml`. Asset placeholder OK."*

## Anti-patterns
- ❌ "Önce engine yazalım" — engine'siz geçmek mümkün, premature platform optimization
- ❌ "Tek-shot full game design" — iterasyon yok, fun emerge etmez
- ❌ Playtest yapmadan mechanic'i refactor — verification yok, drift garantili

## Bu kategori için zorunlu doctrine docs

**Singleplayer / local oyun**: Yok — low-medium risk, production doctrine atlanır.

**Multiplayer / online oyun** (state shared, networked, player input adversarial):
- `02-memory/orchestrator-safety.md` — server otoritesi olarak mutable state'i tek noktadan yaz; client → server payload pydantic-validated; player'lar arası race condition için saga `execute()`/`compensate()`.
- `02-memory/doctrine/auto-mode-classifier.md` — player input untrusted (input prompt-injection probe + output sanitize); cheat keyword block list ("god mode", admin command); allow exceptions oyun komutları.
- `02-memory/doctrine/red-team-primitive.md` — cheat detection adversarial test (10-prompt: speed hack, item dupe, currency overflow, identity hallucination). Pre-launch + continuous canary.

Co-op (peer-to-peer, no server arbitration) sadece arkadaş grubu ise multiplayer doctrine'ı opt-in tut. Public matchmaking → zorunlu.
