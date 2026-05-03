#!/bin/bash
# UserPromptSubmit hook — kullanicinin verbatim prompt'unu log'a yazar.
# Audit trail icin. Mac/Linux.
#
# settings.json'daki UserPromptSubmit hook'u bunu cagirir:
#   {"hooks": {"UserPromptSubmit": [{"hooks": [{"type": "command", "command": "bash .claude/hooks/prompt-log.sh"}]}]}}

set -euo pipefail

raw=$(cat)
[ -z "$raw" ] && exit 0

# Python ile JSON parse (jq dependency'sine gerek yok)
prompt=$(echo "$raw" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('prompt', ''), end='')
except Exception:
    pass
")

[ -z "$prompt" ] && exit 0

mkdir -p data
log="data/prompt-log.md"
ts=$(date '+%Y-%m-%d %H:%M:%S')

session=$(echo "$raw" | python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    sid = d.get('session_id', 'unknown')
    print(sid[:8] if sid else 'unknown', end='')
except Exception:
    print('unknown', end='')
")

cat >> "$log" <<EOF

## $ts (session: $session)

$prompt

---
EOF

exit 0
