---
name: live
description: "Real-time loop between the owner's notes file and this terminal: opens ~/.peaha/notepool/live.md in gedit (Text Editor) and watches it; on every save, read the file and answer in the terminal. Trigger: /live."
---

# /live

1. If `~/.peaha/notepool/live.md` does not exist, create it with a `# live` heading.
2. Open it in the running Text Editor: `gedit "$HOME/.peaha/notepool/live.md" >/dev/null 2>&1 &`. Never open VS Code for this.
3. Start a Monitor (timeout 1800000, description `saves of live.md`) that polls the file mtime every second and prints one line per save:
   `f="$HOME/.peaha/notepool/live.md"; last=$(stat -c %Y "$f"); while true; do cur=$(stat -c %Y "$f" 2>/dev/null || echo gone); if [ "$cur" != "$last" ]; then echo "live.md saved $(date +%T)"; last=$cur; fi; sleep 1; done`
   (`inotifywait` is not installed.)
4. On each save event: read the file, answer the new text in the terminal. Do not write into the file unless the owner asks.
5. On expiry, re-arm the Monitor silently while the owner is still using it.
