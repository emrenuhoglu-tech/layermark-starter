@echo off
REM Pre-flight check — Python, git, Claude Code kurulu mu?
REM Calistirma:  check.cmd  (Windows: cift tikla)

setlocal enabledelayedexpansion
set OK=1

echo.
echo ============================================================
echo   layermark-starter — Pre-flight check
echo ============================================================
echo.

REM Python
where python >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo   [OK]    Python: %%v
) else (
    echo   [EKSIK] Python kurulu degil. Indir: https://www.python.org/downloads/
    set OK=0
)

REM Git
where git >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%v in ('git --version 2^>^&1') do echo   [OK]    Git: %%v
) else (
    echo   [EKSIK] Git kurulu degil. Indir: https://git-scm.com/download/win
    set OK=0
)

REM Node (opsiyonel)
where node >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo   [OK]    Node.js: %%v ^(opsiyonel^)
) else (
    echo   [BILGI] Node.js kurulu degil ^(opsiyonel — sadece JS/TS projelerde lazim^).
)

REM Claude Code
where claude >nul 2>nul
if !errorlevel! equ 0 (
    for /f "tokens=*" %%v in ('claude --version 2^>^&1') do echo   [OK]    Claude Code: %%v
) else (
    echo   [EKSIK] Claude Code kurulu degil. Kurulum: https://claude.ai/code
    set OK=0
)

echo.
if !OK! equ 1 (
    echo   ✓ Hepsi tamam — devam edebilirsin:
    echo.
    echo     python setup_starter.py
    echo.
) else (
    echo   ! Eksik olanlari kur, sonra check.cmd tekrar calistir.
    echo.
)

pause
