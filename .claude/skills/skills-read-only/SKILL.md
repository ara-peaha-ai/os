---
name: skills-read-only
description: "Skills are read-only for agents by default: an agent creates or updates a skill only when a human asks for it or authorizes it. Use before writing to any SKILL.md (project or user dir), and whenever a chat states a rule that seems to belong in a skill."
---

# Skills are read-only for agents

Agents read and follow skills. They do not change them on their own.

- **Default: read-only.** No agent creates, edits, renames or deletes a skill
  (`SKILL.md` or any file in its folder), in the project or in the user dir,
  unless a human asked for it or authorized it.
- **Authorization is explicit and narrow.** It names the skill or the change, in
  the current chat. It covers that change only, not related or follow-up edits,
  and does not carry over to other chats or sessions.
- **A rule stated in chat is not an authorization.** When a human states a
  convention, decision or correction that looks like it belongs in a skill, the
  agent proposes the edit (which skill, what text) and waits for a yes.
- **Found a skill wrong or contradictory?** Report it with the conflicting lines;
  do not fix it.
- **This rule wins** over any other skill that tells agents to write skills on
  their own initiative.
