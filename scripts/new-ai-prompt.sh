#!/usr/bin/env bash
# Yeni numaralı AI prompt log dosyası oluştur (şablondan).
# Kullanım: make ai-prompt name=database_schema   |   scripts/new-ai-prompt.sh database_schema
set -euo pipefail

name="${1:-${name:-}}"
if [ -z "$name" ]; then
  echo "Kullanım: make ai-prompt name=<konu>" >&2
  exit 1
fi

dir="ai_usage/prompts"
tpl="$dir/_TEMPLATE.md"
[ -f "$tpl" ] || { echo "Şablon yok: $tpl" >&2; exit 1; }

# snake_case (case study §8 formatı: 01_database_schema.md)
slug=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | tr ' -' '__' | tr -cd 'a-z0-9_')
last=$(ls "$dir" 2>/dev/null | grep -E '^[0-9]+_' | sed -E 's/^0*([0-9]+)_.*/\1/' | sort -n | tail -1 || true)
next=$(printf '%02d' $(( ${last:-0} + 1 )))
out="$dir/${next}_${slug}.md"

sed -e "s/<YYYY-MM-DD>/$(date +%F)/" -e "s/^# NN —/# ${next} —/" "$tpl" > "$out"
echo "✓ oluşturuldu: $out"
