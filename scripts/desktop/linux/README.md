# Linux desktop: keep a private folder out of GNOME Recent

`recent-hidden` moves every GNOME "Recent" entry under a given folder out of
`~/.local/share/recently-used.xbel` and mirrors it as a symlink in
`<folder>/.recent-hidden`, so private files stay one click away without
showing up in Files, file pickers or other apps' recent lists.

- Link name: `<parent folder> · <file name>`; ` (2)`, ` (3)`... only when both repeat.
- Link mtime = last visit: sort `.recent-hidden` by date to get a private Recent.
- Clicks inside `.recent-hidden` are mapped back to the real file: no loop, no link to a link.
- Links whose file was renamed or moved are pruned on every run. Recent never
  reports renames, so a renamed file comes back only when it is opened again.
- Folders opened from file pickers are dropped from Recent, not linked.

## Install

Run from this folder; `DIR` is the absolute path of the folder to hide.

```sh
DIR="$HOME/path/to/private"
ln -s "$PWD/recent-hidden" ~/.local/bin/recent-hidden
mkdir -p ~/.config/systemd/user
cp recent-hidden@.service recent-hidden@.path ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now "recent-hidden@$(systemd-escape --path "$DIR").path"
```

Optional: bookmark `"$DIR/.recent-hidden"` in the Files sidebar (it starts
with a dot, so it is hidden in Files until Ctrl+H).

Env overrides: `RECENT_XBEL` (list to edit), `RECENT_HIDDEN_DIR` (link folder).
