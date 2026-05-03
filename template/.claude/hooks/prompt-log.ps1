# UserPromptSubmit hook — kullanicinin verbatim prompt'unu log'a yazar.
# Audit trail icin. PowerShell, Windows native.
#
# settings.json'daki UserPromptSubmit hook'u bunu cagirir:
#   {"hooks": {"UserPromptSubmit": [{"hooks": [{"type": "command", "command": "powershell -ExecutionPolicy Bypass -File .claude/hooks/prompt-log.ps1"}]}]}}
#
# Hook stdin'inden JSON okur: {"prompt": "...", "session_id": "..."}

$ErrorActionPreference = "Stop"

# stdin'den JSON oku
$raw = [Console]::In.ReadToEnd()
if (-not $raw) { exit 0 }

try {
    $data = $raw | ConvertFrom-Json
} catch {
    exit 0  # JSON parse hatasi sessizce gec
}

$prompt = $data.prompt
if (-not $prompt) { exit 0 }

# data/prompt-log.md'ya append (gitignore'da olmali)
$dir = Join-Path (Get-Location) "data"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

$logFile = Join-Path $dir "prompt-log.md"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$session = if ($data.session_id) { $data.session_id.Substring(0, [Math]::Min(8, $data.session_id.Length)) } else { "unknown" }

$entry = @"

## $timestamp (session: $session)

$prompt

---
"@

Add-Content -Path $logFile -Value $entry -Encoding UTF8

# Sessiz cikis (hook'tan output dondurursen Claude'a gosterilir)
exit 0
