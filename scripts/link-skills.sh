#!/usr/bin/env bash
# Links every framework skill in wisdom/.claude/skills into the user skills dir,
# so Claude Code sessions in any repo load them. Same command on a PC and on a VPS.
# Third-party skills (symlinks into .agents/skills) stay repo-scoped and are skipped.
# An existing real folder with the same name is left alone; --replace moves it to
# <skills dir>-replaced/<timestamp>/ first (never deleted).
set -euo pipefail

src="$(cd "$(dirname "$0")/../.claude/skills" && pwd)"
dst="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills"
replace=false
[ "${1:-}" = "--replace" ] && replace=true
backup="$dst-replaced/$(date -u +%Y%m%dT%H%M%SZ)"

mkdir -p "$dst"
for dir in "$src"/*/; do
  dir="${dir%/}"
  name="$(basename "$dir")"
  [ -L "$dir" ] && continue
  target="$dst/$name"
  if [ -L "$target" ] && [ "$(readlink "$target")" = "$dir" ]; then
    echo "ok       $name"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    if $replace; then
      mkdir -p "$backup"
      mv -- "$target" "$backup/$name"
      ln -s -- "$dir" "$target"
      echo "replaced $name (old copy in $backup/$name)"
    else
      echo "skipped  $name: $target exists, rerun with --replace to move it aside"
    fi
  else
    ln -s -- "$dir" "$target"
    echo "linked   $name"
  fi
done
