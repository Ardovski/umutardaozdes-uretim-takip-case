#!/usr/bin/env bash
# AI sohbet geçmişini → ai_usage/transcripts/<kaynak>/ altına topla (text dump).
# Bu §8'in "Chat geçmişlerinizi paylaşacaksınız" gereksinimi için çalışan araçtır.
#
# Kaynaklar (her satır → kendi alt klasörüne):
#   • claude/   → ~/.claude/projects/<proje>/*.jsonl  (Claude Code oturumları)
#   • minimax/  → ~/.local/share/opencode/opencode.db (MiniMax-M3 / opencode SQLite)
#                 ~/.minimax/sessions/*.jsonl           (eski JSONL, varsa)
#   • opencode/ → ~/.local/state/opencode/prompt-history.jsonl (opencode CLI history)
#
# Davranış:
#   • Her oturum kendi dosyasına yazılır: <kaynak>-<YYYY-MM-DD>-<id>.md
#   • ÜZERİNE YAZAR (idempotent) — "tekrar çalıştır" güvenli
#   • Proje eşleşmesi: AI_PROJECT_MATCH env (varsayılan: repo kök adı)
#
# Kullanım:
#   scripts/backup-sessions.sh                # tüm Magna session'ları
#   AI_PROJECT_MATCH=Other scripts/backup-sessions.sh
set -euo pipefail

cd "$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

out_root="ai_usage/transcripts"
mkdir -p "$out_root/claude" "$out_root/minimax" "$out_root/opencode"

match="${AI_PROJECT_MATCH:-$(basename "$PWD")}"

python3 - "$out_root" "$match" "$HOME" <<'PY'
import json, os, re, sys, sqlite3, glob
from datetime import datetime

out_root, match, home = sys.argv[1], sys.argv[2], sys.argv[3]
match_low = match.lower()
exported, skipped = 0, 0

def slug_id(raw):
    return (re.sub(r'[^a-zA-Z0-9]', '', raw) or "session")[:8]

def day_from_ts(ts):
    if not ts:
        return datetime.now().strftime("%Y-%m-%d")
    try:
        return datetime.fromtimestamp(int(ts) / 1000).strftime("%Y-%m-%d")
    except Exception:
        try:
            return datetime.fromtimestamp(int(ts)).strftime("%Y-%m-%d")
        except Exception:
            return datetime.now().strftime("%Y-%m-%d")

def extract_text(part_data):
    """part.data içinden metin çıkar (type='text' veya direkt text alanı)."""
    if isinstance(part_data, str):
        try:
            part_data = json.loads(part_data)
        except Exception:
            return ""
    if not isinstance(part_data, dict):
        return ""
    if part_data.get("type") == "text":
        return part_data.get("text", "") or ""
    if "text" in part_data and isinstance(part_data["text"], str):
        return part_data["text"]
    if "content" in part_data and isinstance(part_data["content"], str):
        return part_data["content"]
    return ""

def write_md(out_path, source, raw_path, lines):
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(f"# AI Transcript ({source})\n\n")
        f.write(f"> Kaynak: `{raw_path}`\n\n")
        n = 0
        for role, content in lines:
            text = get_text(content)
            if not text.strip():
                continue
            who = {"user": "Kullanıcı", "human": "Kullanıcı",
                   "assistant": "Asistan", "ai": "Asistan"}.get(
                       str(role).lower(), str(role) or "—")
            f.write(f"\n## {who}\n\n{text.strip()}\n")
            n += 1
        return n

def get_text(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for c in content:
            if isinstance(c, dict):
                if c.get("type") == "text" or "text" in c:
                    parts.append(c.get("text", "") or "")
                elif isinstance(c.get("content"), str):
                    parts.append(c["content"])
            elif isinstance(c, str):
                parts.append(c)
        return "".join(parts)
    if isinstance(content, dict):
        return content.get("text", "") or ""
    return ""

def export_jsonl(path, source, subdir):
    """Claude Code / eski JSONL formatı."""
    global exported, skipped
    base = os.path.basename(path)
    sid = slug_id(base.replace(".jsonl", ""))
    try:
        ts = os.path.getmtime(path)
        day = day_from_ts(int(ts * 1000))
    except OSError:
        day = day_from_ts(None)
    out = os.path.join(out_root, subdir, f"{source}-{day}-{sid}.md")

    lines = []
    for raw in open(path, encoding="utf-8"):
        raw = raw.strip()
        if not raw:
            continue
        try:
            o = json.loads(raw)
        except Exception:
            continue
        msg = o.get("message") if isinstance(o.get("message"), dict) else o
        role = (msg.get("role") if isinstance(msg, dict) else None) \
               or o.get("role") or o.get("type") or o.get("sender") or ""
        content = (msg.get("content") if isinstance(msg, dict) else None) \
                  or o.get("content") or o.get("text")
        if isinstance(content, str) and not content.strip():
            continue
        lines.append((role, content))

    n = write_md(out, source, path, lines)
    if n == 0:
        skipped += 1
    else:
        exported += 1
        print(f"  ✓ {subdir}/{os.path.basename(out)}  ({n} mesaj)")

def export_opencode_db(db_path):
    """opencode.db (yeni şema: session + message + part) → minimax/."""
    global exported, skipped
    if not os.path.exists(db_path):
        return
    con = sqlite3.connect(db_path)
    con.row_factory = sqlite3.Row
    try:
        sessions = con.execute(
            "SELECT id, directory, title, time_created, model, agent "
            "FROM session ORDER BY time_created"
        ).fetchall()
    except sqlite3.OperationalError:
        con.close()
        return

    for s in sessions:
        directory = (s["directory"] or "").lower()
        if match_low and match_low not in directory:
            continue
        sid = slug_id(s["id"])
        day = day_from_ts(s["time_created"])
        out = os.path.join(out_root, "minimax",
                           f"minimax-{day}-{sid}.md")

        # Her mesaj için: role + part'lardan biriken text
        msgs = con.execute(
            "SELECT id, data FROM message WHERE session_id = ? "
            "ORDER BY time_created", (s["id"],)
        ).fetchall()
        lines = []
        for m in msgs:
            try:
                mdata = json.loads(m["data"]) if m["data"] else {}
            except Exception:
                mdata = {}
            role = mdata.get("role", "")
            parts = con.execute(
                "SELECT data FROM part WHERE message_id = ? "
                "ORDER BY time_created", (m["id"],)
            ).fetchall()
            text = "".join(extract_text(p["data"]) for p in parts)
            if not text.strip():
                continue
            lines.append((role, text))

        # Header meta
        meta_lines = [
            f"**Oturum ID:** `{s['id']}`",
            f"**Dizin:** `{s['directory']}`",
            f"**Başlık:** {s['title'] or '—'}",
        ]
        if s["model"]:
            try:
                m = json.loads(s["model"])
                meta_lines.append(
                    f"**Model:** {m.get('id') or m.get('modelID', '?')} "
                    f"(provider: {m.get('providerID', '?')})")
            except Exception:
                pass
        if s["agent"]:
            meta_lines.append(f"**Agent:** {s['agent']}")

        with open(out, "w", encoding="utf-8") as f:
            f.write(f"# AI Transcript (minimax)\n\n")
            f.write(f"> Kaynak: `{db_path}#session/{s['id']}`\n\n")
            for ml in meta_lines:
                f.write(ml + "\n")
            f.write("\n---\n")
            n = 0
            for role, content in lines:
                who = {"user": "Kullanıcı", "human": "Kullanıcı",
                       "assistant": "Asistan", "ai": "Asistan"}.get(
                           str(role).lower(), str(role) or "—")
                f.write(f"\n## {who}\n\n{content.strip()}\n")
                n += 1

        if n == 0:
            skipped += 1
        else:
            exported += 1
            print(f"  ✓ minimax/{os.path.basename(out)}  ({n} mesaj)")
    con.close()

# 1) Claude Code — bu proje eşleşmesi
claude_root = os.path.join(home, ".claude", "projects")
if os.path.isdir(claude_root):
    for proj_dir in glob.glob(os.path.join(claude_root, "*")):
        if match_low and match_low not in os.path.basename(proj_dir).lower():
            continue
        for path in sorted(glob.glob(os.path.join(proj_dir, "*.jsonl"))):
            export_jsonl(path, "claude", "claude")

# 2) opencode.db (MiniMax-M3 dahil) — bu proje eşleşmesi
export_opencode_db(os.path.join(home, ".local", "share", "opencode",
                                "opencode.db"))

# 3) Eski MiniMax JSONL (yedek)
old = os.path.join(home, ".minimax", "sessions")
if os.path.isdir(old):
    for path in sorted(glob.glob(os.path.join(old, "*.jsonl"))):
        export_jsonl(path, "minimax", "minimax")

# 4) opencode — prompt history (her girdi bir satır)
oc_hist = os.path.join(home, ".local", "state", "opencode",
                       "prompt-history.jsonl")
if os.path.exists(oc_hist):
    export_jsonl(oc_hist, "opencode", "opencode")

print(f"\n✓ toplam: {exported} oturum yazıldı, {skipped} boş oturum atlandı")
PY
