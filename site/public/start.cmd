@echo off
setlocal EnableDelayedExpansion
color 0F
title layermark-starter - kurulum
mode con: cols=92 lines=30
cls

echo.
echo  ============================================================
echo                       layermark-starter
echo            Claude Code projesi - 1 dakika kurulum
echo  ============================================================
echo.
echo   Adimlar:
echo     1. Python kontrol
echo     2. Claude Code kontrol
echo     3. Starter indir
echo     4. Kit sec + sorulara cevap ver
echo     5. Bitti
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
    REM Yeni PATH'i okumak icin yeniden kontrol
    goto check_python
)

for /f "tokens=*" %%v in ('%PYTHON_CMD% --version 2^>^&1') do echo  [ TAMAM ] %%v

REM ---------- Claude Code kontrol ----------
:check_claude
where.exe claude >nul 2>nul
if !errorlevel! neq 0 (
    echo  [ EKSIK ] Claude Code yuklu degil.
    echo.
    echo           Sirayla:
    echo             1. Tarayicida claude.ai/code acilacak
    echo             2. 'Install Claude Code' butonuna tikla
    echo             3. Kur, Anthropic hesabinla giris yap
    echo             4. Buraya don, Enter'a bas
    echo.
    timeout /t 3 /nobreak >nul
    start "" https://claude.ai/code
    echo.
    echo  Claude Code kuruldu mu? Enter'a bas:
    pause >nul
    where.exe claude >nul 2>nul
    if !errorlevel! neq 0 (
        echo.
        echo  [ ! ] 'claude' komutu hala bulunamadi.
        echo        Bu pencereyi kapat, YENI bir CMD ac, scripti tekrar calistir.
        echo.
        pause
        exit /b 1
    )
)
echo  [ TAMAM ] Claude Code kurulu

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
echo.
echo  ============================================================
echo                          B I T T I
echo  ============================================================
echo.
echo   Projen hazir: %BASE_DIR% icinde
echo.
echo   SIRADAKI ADIM:
echo     1. %BASE_DIR% klasorunu Explorer'da ac
echo     2. Yeni proje klasorune gir (en son olusan)
echo     3. Adres cubuguna 'cmd' yaz + Enter (klasorde terminal acar)
echo     4. Cikan terminalde:  claude
echo.
echo   Veya VS Code kullaniyorsan:
echo     File ^> Open Folder ^> proje klasoru
echo     Terminal ^> New Terminal ^> claude
echo.
echo  Klasoru simdi Explorer'da acmami ister misin? (E/H)
set /p OPEN_CHOICE="Tercih [E]: "
if /i "%OPEN_CHOICE%"=="H" goto end
explorer "%BASE_DIR%"

:end
echo.
echo  Pencereyi kapatabilirsin.
pause
