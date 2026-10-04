#!/usr/bin/env bash
# Links every framework skill in wisdom/.claude/skills into the user skills dir,
# so Claude Code sessions in any repo load them. Same command on a PC and on a VPS.
# Only real folders with a SKILL.md are linked; third-party skills (symlinks into
# .agents/skills) stay repo-scoped. An existing real folder with the same name is
# left alone; --replace moves it to <skills dir>-replaced/<timestamp>/ first (never
# deleted). A broken or stale symlink holds no data and is replaced in place.
set -euo pipefail
shopt -s nullglob

src="$(cd "$(dirname "$0")/../.claude/skills" && pwd -P)"
dst_root="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
replace=false
[ "${1:-}" = "--replace" ] && replace=true

mkdir -p "$dst_root/skills"
dst="$(cd "$dst_root/skills" && pwd -P)"
case "$dst/" in "$src/"*) echo "refusing: destination $dst is the source"; exit 1;; esac
case "$src/" in "$dst/"*) echo "refusing: source $src is inside the destination"; exit 1;; esac
backup="$dst-replaced/$(date -u +%Y%m%dT%H%M%SZ)"

for dir in "$src"/*/; do
  dir="${dir%/}"
  name="$(basename "$dir")"
  [ -L "$dir" ] && continue
  [ -f "$dir/SKILL.md" ] || continue
  target="$dst/$name"
  if [ -L "$target" ] && [ "$(readlink -f "$target")" = "$dir" ]; then
    echo "ok       $name"
  elif [ -L "$target" ] && [ ! -e "$target" ]; then
    ln -sfn -- "$dir" "$target"
    echo "relinked $name (was a broken link)"
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
