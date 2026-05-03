#!/bin/bash
# layermark-starter Mac/Linux bootstrap
set -uo pipefail

BLUE='\033[1;34m'
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
RED='\033[1;31m'
NC='\033[0m'

clear
cat <<'BANNER'

  ============================================================
                       layermark-starter
            Claude Code projesi - 1 dakika kurulum
  ============================================================

   Adımlar:
     1. Python kontrol
     2. Node.js kontrol  (npm için)
     3. Claude Code CLI kontrol  (terminal aracı, web değil!)
     4. Starter indir
     5. Kit seç + sorulara cevap ver
     6. Bitti

BANNER

sleep 2

# ---------- Python kontrol ----------
PYTHON_CMD=""
check_python() {
  for c in python3 python; do
    if command -v "$c" >/dev/null 2>&1; then
      ver=$("$c" --version 2>&1 | awk '{print $2}')
      major=$(echo "$ver" | cut -d. -f1)
      minor=$(echo "$ver" | cut -d. -f2)
      if [ "$major" -ge 3 ] && [ "$minor" -ge 10 ] 2>/dev/null; then
        PYTHON_CMD="$c"
        return 0
      fi
    fi
  done
  return 1
}

while ! check_python; do
  printf "${RED}  [ EKSIK ] Python 3.10+ yüklü değil.${NC}\n\n"
  printf "           Sırayla:\n"
  printf "             1. Tarayıcıda Python sayfası açılacak\n"
  printf "             2. Python 3.12+ indir, kur\n"
  printf "             3. Buraya dön, Enter'a bas\n\n"
  sleep 3
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://www.python.org/downloads/macos/"
  else
    xdg-open "https://www.python.org/downloads/" 2>/dev/null || true
  fi
  printf "  Python kuruldu mu? Enter'a bas: "
  read -r
done

printf "${GREEN}  [ TAMAM ] %s ($(${PYTHON_CMD} --version 2>&1))${NC}\n" "Python"

# ---------- Node.js + npm kontrol ----------
check_node() {
  command -v npm >/dev/null 2>&1
}

while ! check_node; do
  printf "\n${RED}  [ EKSIK ] Node.js / npm yüklü değil.${NC}\n\n"
  printf "           Claude Code'u kurmak için npm gerek. Sırayla:\n"
  printf "             1. Tarayıcıda nodejs.org açılacak\n"
  printf "             2. 'LTS' indir, kur (varsayılan ayarlar)\n"
  printf "             3. Buraya dön, Enter'a bas\n\n"
  sleep 3
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "https://nodejs.org/"
  else
    xdg-open "https://nodejs.org/" 2>/dev/null || true
  fi
  printf "  Node.js kuruldu mu? Enter'a bas: "
  read -r
done

printf "${GREEN}  [ TAMAM ] Node.js $(node --version 2>&1)${NC}\n"

# ---------- Claude Code CLI kontrol ----------
check_claude() {
  command -v claude >/dev/null 2>&1
}

if ! check_claude; then
  printf "\n${YELLOW}  [ EKSIK ] Claude Code CLI yüklü değil.${NC}\n\n"
  printf "           DİKKAT: 'Claude Code CLI' bir terminal aracı.\n"
  printf "                   claude.ai web sitesi DEĞİL.\n\n"
  printf "  Otomatik kurulum komutunu çalıştırayım mı? (E/H) [E]: "
  read -r INSTALL_CHOICE
  INSTALL_CHOICE="${INSTALL_CHOICE:-E}"
  if [[ "$INSTALL_CHOICE" =~ ^[Hh]$ ]]; then
    printf "\n  Manuel kurulum: terminalde şu komutu çalıştır:\n"
    printf "    npm install -g @anthropic-ai/claude-code\n"
    printf "  Sonra bu pencereyi kapat ve scripti tekrar çalıştır.\n"
    read -p "Enter ile çık: "
    exit 1
  fi
  echo
  echo "  Kuruluyor... (birkaç dk, 'npm install -g @anthropic-ai/claude-code')"
  if ! npm install -g @anthropic-ai/claude-code; then
    printf "\n${RED}  [ HATA ] npm kurulumu başarısız.${NC}\n"
    printf "           Internet bağlantısını ya da npm log'unu kontrol et.\n"
    printf "           Mac'te 'permission denied' aldıysan: sudo npm install -g @anthropic-ai/claude-code\n"
    read -p "Enter ile çık: "
    exit 1
  fi
  if ! check_claude; then
    printf "\n${YELLOW}  [ ! ] 'claude' komutu PATH'te bulunamadı.${NC}\n"
    printf "        Bu pencereyi kapat, YENİ Terminal aç, scripti tekrar çalıştır.\n"
    read -p "Enter ile çık: "
    exit 1
  fi
fi
printf "${GREEN}  [ TAMAM ] Claude Code CLI kurulu${NC}\n\n"

printf "${BLUE}  ============================================================${NC}\n"
printf "${BLUE}                  Önkoşullar tamam, devam${NC}\n"
printf "${BLUE}  ============================================================${NC}\n\n"

# ---------- Klasör seç ----------
echo "  Yeni projeni nereye kuralım?"
echo
echo "    1) Masaüstü                  (varsayılan)"
echo "    2) Belgeler"
echo "    3) Ev klasörüm (\$HOME)"
echo
read -p "  Tercih (1/2/3) [1]: " TARGET_CHOICE
TARGET_CHOICE="${TARGET_CHOICE:-1}"

case "$TARGET_CHOICE" in
  1) BASE_DIR="$HOME/Desktop" ;;
  2) BASE_DIR="$HOME/Documents" ;;
  3) BASE_DIR="$HOME" ;;
  *) printf "${RED}  Geçersiz seçim.${NC}\n"; exit 1 ;;
esac

if [ ! -d "$BASE_DIR" ]; then
  mkdir -p "$BASE_DIR" || { printf "${RED}  Klasör oluşturulamadı.${NC}\n"; exit 1; }
fi

# ---------- İndir + extract ----------
TMP_DIR="$(mktemp -d -t layermark-bootstrap-XXXXXX)"
trap "rm -rf '$TMP_DIR'" EXIT

echo
echo "  Starter indiriliyor (~250 KB)..."
if ! curl -fsSL "https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.zip" -o "$TMP_DIR/starter.zip"; then
  printf "${RED}  [ HATA ] İndirme başarısız. İnternet bağlantını kontrol et.${NC}\n"
  read -p "Enter ile çık: "
  exit 1
fi
printf "${GREEN}  [ TAMAM ] İndirildi${NC}\n"

echo "  Açılıyor..."
if ! unzip -q "$TMP_DIR/starter.zip" -d "$TMP_DIR"; then
  printf "${RED}  [ HATA ] Açma başarısız.${NC}\n"
  read -p "Enter ile çık: "
  exit 1
fi

STARTER_DIR="$TMP_DIR/layermark-starter-main"
if [ ! -f "$STARTER_DIR/setup_starter.py" ]; then
  printf "${RED}  [ HATA ] Beklenmeyen içerik.${NC}\n"
  read -p "Enter ile çık: "
  exit 1
fi
printf "${GREEN}  [ TAMAM ] Açıldı${NC}\n\n"

printf "${BLUE}  ============================================================${NC}\n"
printf "${BLUE}               Sırada kit seçimi + 4-5 soru${NC}\n"
printf "${BLUE}  ============================================================${NC}\n\n"
sleep 1

cd "$STARTER_DIR"
"$PYTHON_CMD" setup_starter.py --target="$BASE_DIR"
SETUP_RC=$?

if [ $SETUP_RC -ne 0 ]; then
  printf "\n${RED}  [ HATA ] Setup tamamlanmadı.${NC}\n"
  read -p "Enter ile çık: "
  exit 1
fi

# ---------- Bitiş ----------
clear
printf "\n${GREEN}  ============================================================${NC}\n"
printf "${GREEN}                          B İ T T İ${NC}\n"
printf "${GREEN}  ============================================================${NC}\n\n"

echo "   Projen hazır: $BASE_DIR içinde"
echo
echo "   ===== ÖNEMLİ - SON 2 ADIM ====="
echo
echo "   1. Yeni proje klasörünü Finder'da aç"
echo "   2. Sağ-tık → 'New Terminal at Folder' (ya da Terminal aç + cd)"
echo "   3. Çıkan TERMİNALDE şu komutu yaz:"
echo
echo "         claude"
echo
echo "   4. Claude Code CLI açılır (TERMİNALDE, browser DEĞİL)"
echo "   5. Sonra terminalde şu mesajı yaz:"
echo
echo "         merhaba"
echo
echo "      Wizard otomatik başlar (TR/EN seç, 9 soru, hazır)."
echo
echo "   UYARI: claude.ai web sitesi DEĞİL — o farklı ürün."
echo "          'claude' komutu terminalde, CLI olarak çalışır."
echo
read -p "  Klasörü şimdi Finder'da açayım mı? (E/H) [E]: " OPEN_CHOICE
OPEN_CHOICE="${OPEN_CHOICE:-E}"
if [[ ! "$OPEN_CHOICE" =~ ^[Hh]$ ]]; then
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open "$BASE_DIR"
  else
    xdg-open "$BASE_DIR" 2>/dev/null || true
  fi
fi

echo
echo "  Pencereyi kapatabilirsin."
read -p "Enter ile çık: "
