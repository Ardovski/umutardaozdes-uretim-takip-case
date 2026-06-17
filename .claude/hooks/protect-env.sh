#!/usr/bin/env bash
# PreToolUse hook — gerçek .env (secret) dosyalarına yazımı engeller.
# .env.example / .env.local.example serbesttir. Claude'da exit 2 işlemi durdurur.
path=$(python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
base=$(basename "$path" 2>/dev/null)
case "$base" in
  .env.example|.env.local.example) exit 0 ;;
  .env|.env.*)
    echo "Engellendi: '$path' bir secret dosyası. Bunun yerine .env.example düzenle." >&2
    exit 2 ;;
esac
exit 0
