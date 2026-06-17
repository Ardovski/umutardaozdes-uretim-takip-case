#!/usr/bin/env bash
# UserPromptSubmit hook — her kullanıcı prompt'unu günlük oturum log'una ekler.
# Opt-in: .claude/settings.json.example içinde tanımlı.
input=$(cat)
prompt=$(printf '%s' "$input" | python3 -c "import sys,json; print(json.load(sys.stdin).get('prompt',''))" 2>/dev/null)
[ -z "$prompt" ] && exit 0
mkdir -p ai_usage/transcripts
log="ai_usage/transcripts/session-$(date +%F).md"
{
  printf '\n### %s — Kullanıcı\n\n' "$(date +%H:%M)"
  printf '%s\n' "$prompt"
} >> "$log"
exit 0
