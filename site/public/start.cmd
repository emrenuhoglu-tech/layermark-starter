@echo off
setlocal EnableDelayedExpansion
color 0F
title layermark-starter - kurulum
mode con: cols=92 lines=32
cls

echo.
echo  ============================================================
echo                       layermark-starter
echo            Claude Code projesi - 1 dakika kurulum
echo  ============================================================
echo.
echo   Adimlar:
echo     1. Python kontrol
echo     2. Node.js kontrol  (npm icin)
echo     3. Claude Code CLI kontrol  (terminal araci, web degil!)
echo     4. Starter indir
echo     5. Kit sec + sorulara cevap ver
echo     6. Bitti
echo.
timeout /t 2 /nobreak >nul

REM ---------- Python kontrol ----------
:check_python
set "PYTHON_CMD="
for %%P in (python python3 py) do (
    %%P --version >nul 2>nul
    if !errorlevel! == 0 (
        if not defined PYTHON_CMD set "PYTHON_CMD=%%P"
    )
)

if not defined PYTHON_CMD (
    echo  [ EKSIK ] Python yuklu degil.
    echo.
    echo           Sirayla:
    echo             1. Tarayicida indirme sayfasi acilacak
    echo             2. Python 3.12 indir, kur
    echo             3. KURULUMDA: 'Add Python to PATH' kutucugu MUTLAKA isaretli olsun
    echo             4. Buraya don, Enter'a bas
    echo.
    timeout /t 3 /nobreak >nul
    start "" https://www.python.org/downloads/
    echo.
    echo  Python kuruldu mu? Enter'a bas:
    pause >nul
    goto check_python
)

for /f "tokens=*" %%v in ('%PYTHON_CMD% --version 2^>^&1') do echo  [ TAMAM ] %%v

REM ---------- Node.js + npm kontrol ----------
:check_node
where.exe npm >nul 2>nul
if !errorlevel! neq 0 (
    echo.
    echo  [ EKSIK ] Node.js / npm yuklu degil.
    echo.
    echo           Claude Code'u kurmak icin npm gerek. Sirayla:
    echo             1. Tarayicida nodejs.org acilacak
    echo             2. 'LTS' indir, kur (varsayilan ayarlar)
    echo             3. Buraya don, Enter'a bas
    echo.
    timeout /t 3 /nobreak >nul
    start "" https://nodejs.org/
    echo.
    echo  Node.js kuruldu mu? Enter'a bas:
    pause >nul
    REM PATH'i yenile
    goto check_node
)

for /f "tokens=*" %%v in ('node --version 2^>^&1') do echo  [ TAMAM ] Node.js %%v

REM ---------- Claude Code CLI kontrol ----------
:check_claude
where.exe claude >nul 2>nul
if !errorlevel! neq 0 (
    echo.
    echo  [ EKSIK ] Claude Code CLI yuklu degil.
    echo.
    echo           DIKKAT: 'Claude Code CLI' bir terminal araci.
    echo                   claude.ai web sitesi DEGIL.
    echo.
    echo           Otomatik kurulum komutunu calistirayim mi? (E/H)
    set /p INSTALL_CHOICE="Tercih [E]: "
    if /i "!INSTALL_CHOICE!"=="H" (
        echo.
        echo  Manuel kurulum: terminalde su komutu calistir
        echo    npm install -g @anthropic-ai/claude-code
        echo  Sonra bu pencereyi kapat ve scripti tekrar calistir.
        pause
        exit /b 1
    )
    echo.
    echo  Kuruluyor... ^(birkac dk, 'npm install -g @anthropic-ai/claude-code'^)
    call npm install -g @anthropic-ai/claude-code
    if !errorlevel! neq 0 (
        echo.
        echo  [ HATA ] npm kurulumu basarisiz.
        echo           Internet baglantisini ya da npm log'unu kontrol et.
        pause
        exit /b 1
    )
    where.exe claude >nul 2>nul
    if !errorlevel! neq 0 (
        echo.
        echo  [ ! ] 'claude' komutu PATH'te bulunamadi.
        echo        Bu pencereyi kapat, YENI bir CMD ac, scripti tekrar calistir.
        pause
        exit /b 1
    )
)
echo  [ TAMAM ] Claude Code CLI kurulu

echo.
echo  ============================================================
echo                  Onkosullar tamam, devam
echo  ============================================================
echo.

REM ---------- Klasor sec ----------
echo  Yeni projeni nereye kuralim?
echo.
echo    1) Masaustu                 (varsayilan)
echo    2) Belgeler
echo    3) Ev klasorum (%USERPROFILE%)
echo.
set /p TARGET_CHOICE="Tercih (1/2/3) [1]: "
if "%TARGET_CHOICE%"=="" set "TARGET_CHOICE=1"

set "BASE_DIR="
if "%TARGET_CHOICE%"=="1" set "BASE_DIR=%USERPROFILE%\Desktop"
if "%TARGET_CHOICE%"=="2" set "BASE_DIR=%USERPROFILE%\Documents"
if "%TARGET_CHOICE%"=="3" set "BASE_DIR=%USERPROFILE%"

if not defined BASE_DIR (
    echo  Gecersiz secim. Iptal.
    pause
    exit /b 1
)

if not exist "%BASE_DIR%" (
    echo  Klasor yok: %BASE_DIR%
    pause
    exit /b 1
)

REM ---------- Indir + extract ----------
set "TMP_DIR=%TEMP%\layermark-bootstrap-%RANDOM%%RANDOM%"
mkdir "%TMP_DIR%" >nul 2>nul

echo.
echo  Starter indiriliyor (~250 KB)...
powershell -NoProfile -Command "$ProgressPreference='SilentlyContinue'; try { Invoke-WebRequest -Uri 'https://github.com/emrenuhoglu-tech/layermark-starter/archive/refs/heads/main.zip' -OutFile '%TMP_DIR%\starter.zip' -UseBasicParsing } catch { exit 1 }"
if !errorlevel! neq 0 (
    echo  [ HATA ] Indirme basarisiz. Internet baglantini kontrol et.
    pause
    rmdir /s /q "%TMP_DIR%" 2>nul
    exit /b 1
)
echo  [ TAMAM ] Indirildi

echo  Aciliyor...
powershell -NoProfile -Command "Expand-Archive -Path '%TMP_DIR%\starter.zip' -DestinationPath '%TMP_DIR%' -Force"
if !errorlevel! neq 0 (
    echo  [ HATA ] Acma basarisiz.
    pause
    rmdir /s /q "%TMP_DIR%" 2>nul
    exit /b 1
)

set "STARTER_DIR=%TMP_DIR%\layermark-starter-main"
if not exist "%STARTER_DIR%\setup_starter.py" (
    echo  [ HATA ] Beklenmeyen icerik. Tekrar dene.
    pause
    rmdir /s /q "%TMP_DIR%" 2>nul
    exit /b 1
)
echo  [ TAMAM ] Acildi

echo.
echo  ============================================================
echo               Sirada kit secimi + 4-5 soru
echo  ============================================================
echo.
timeout /t 1 /nobreak >nul

cd /d "%STARTER_DIR%"
%PYTHON_CMD% setup_starter.py --target="%BASE_DIR%"
set SETUP_RC=!errorlevel!

cd /d "%~dp0"
rmdir /s /q "%TMP_DIR%" 2>nul

if !SETUP_RC! neq 0 (
    echo.
    echo  [ HATA ] Setup tamamlanmadi. Yukaridaki mesaja bak.
    pause
    exit /b 1
)

REM ---------- Bitis ----------
cls
echo.
echo  ============================================================
echo                          B I T T I
echo  ============================================================
echo.
echo   Projen hazir: %BASE_DIR% icinde
echo.
echo   ===== ONEMLI - SON 2 ADIM =====
echo.
echo   1. Yeni proje klasorunu Explorer'da ac
echo   2. Adres cubuguna 'cmd' yaz + Enter (klasorde terminal acar)
echo   3. Cikan TERMINALDE su komutu yaz:
echo.
echo         claude
echo.
echo   4. Claude Code CLI acilir (TERMINALDE, browser DEGIL)
echo   5. Sonra terminalde su mesaji yaz:
echo.
echo         merhaba
echo.
echo      Wizard otomatik baslar (TR/EN sec, 10 soru kategori dahil, hazir).
echo.
echo   UYARI: claude.ai web sitesi DEGIL - o farkli urun.
echo          'claude' komutu terminalde, CLI olarak calisir.
echo.
echo  Klasoru simdi Explorer'da acmami ister misin? (E/H)
set /p OPEN_CHOICE="Tercih [E]: "
if /i "%OPEN_CHOICE%"=="H" goto end
explorer "%BASE_DIR%"

:end
echo.
echo  Pencereyi kapatabilirsin.
pause
