---
name: standby
description: "Owner's pause order. Trigger: \"standby\" (also \"metti in standby\", \"in pausa\", \"pause\"). Prints a short bullet list of the chat's state and stops: no actions, no fixes, no questions."
---

# Standby

Trigger: the owner puts the chat on hold. Print the state as a list and **do nothing else**: no tool calls, no fixes, no file writes, no follow-up questions, no proposals.

The list is short, one line per item, in the language of the chat:
- **Topic:** what the chat is about, in one line
- **Done:** what was answered or produced
- **Open:** what is still unresolved, and the blocker if there is one
- **Constraints:** rules the owner set during the chat that must hold on resume
- **On resume:** the first step when work picks up again

Skip a heading if there is nothing for it. The last line is the single action that resumes the work.
