#!/bin/bash
# Pre-flight check — Python, git, Claude Code kurulu mu? (Mac/Linux)
# Çalıştırma:  bash check.sh

OK=1

echo ""
echo "============================================================"
echo "  layermark-starter — Pre-flight check"
echo "============================================================"
echo ""

# Python
if command -v python3 &> /dev/null; then
    echo "  [OK]    Python: $(python3 --version)"
elif command -v python &> /dev/null; then
    echo "  [OK]    Python: $(python --version)"
else
    echo "  [EKSİK] Python kurulu değil. İndir: https://www.python.org/downloads/"
    OK=0
fi

# Git
if command -v git &> /dev/null; then
    echo "  [OK]    Git: $(git --version)"
else
    echo "  [EKSİK] Git kurulu değil. Mac: 'xcode-select --install' / Linux: 'apt install git'"
    OK=0
fi

# Node (opsiyonel)
if command -v node &> /dev/null; then
    echo "  [OK]    Node.js: $(node --version)  (opsiyonel)"
else
    echo "  [BILGI] Node.js kurulu değil (opsiyonel — sadece JS/TS projelerde lazım)."
fi

# Claude Code
if command -v claude &> /dev/null; then
    echo "  [OK]    Claude Code: $(claude --version)"
else
    echo "  [EKSİK] Claude Code kurulu değil. Kurulum: https://claude.ai/code"
    OK=0
fi

echo ""
if [ $OK -eq 1 ]; then
    echo "  ✓ Hepsi tamam — devam edebilirsin:"
    echo ""
    echo "    python3 setup_starter.py"
    echo ""
else
    echo "  ! Eksik olanları kur, sonra 'bash check.sh' tekrar çalıştır."
    echo ""
fi
