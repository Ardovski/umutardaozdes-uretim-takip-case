#!/usr/bin/env bash
# PostToolUse hook — AGENTS.md değiştiğinde CLAUDE.md'yi senkronlar (tek kaynak).
path=$(python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
if [ "$(basename "$path" 2>/dev/null)" = "AGENTS.md" ]; then
  cp AGENTS.md CLAUDE.md 2>/dev/null && echo "CLAUDE.md, AGENTS.md ile senkronlandı."
fi
exit 0
