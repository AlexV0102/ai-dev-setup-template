---
name: compact-instructions
description: "Make an agent instruction file (AGENTS.md, CLAUDE.md, a rule or a SKILL.md) shorter without losing any rule or fact. Use when an instruction file has grown long, repeats itself, or the user asks to tighten it."
---

# compact-instructions

Instruction files are read in every session, so every sentence costs context and dilutes the rules that matter. Shorter is better only if nothing is lost.

1. **Inventory first.** Before editing, list every rule, fact, command, path and exception in the file as one numbered line each. This list is the contract.
2. **Rewrite.**
   - Remove filler, repetition, motivation paragraphs and restated headings.
   - Merge rules that say the same thing in different places; keep the one in the most specific location.
   - Replace prose procedures with short ordered steps.
   - Move long, rarely-needed procedures to a skill or a doc and leave a one-line pointer; move rules that only apply to some paths into a path-scoped `.claude/rules/` file.
   - Keep every rule's one-line *why*; that is what stops someone from deleting it later.
   - Do not change meaning, strength ("must" stays "must") or scope.
3. **Check against the inventory.** Tick off every numbered item in the new text. Anything missing goes back in, or you state that it moved and where.
4. **Report** the size before and after (lines or words) and anything you moved or found contradictory. Contradictions are for the user to settle; do not pick a winner silently.
