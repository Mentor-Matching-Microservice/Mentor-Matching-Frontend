# Audit And Implementation Plan

Use this prompt before broad UI changes or when taking over a partially built frontend.

## Prompt

Read:

- `AGENTS.md`
- `frontend/RULES.md`
- all files under `frontend/docs/framework/`

Then inspect the relevant frontend routes, layouts, and reusable components.

Produce or refresh:

- `frontend/docs/generated/00_AUDIT.md`
- `frontend/docs/generated/IMPLEMENTATION_PLAN.md`
- `frontend/docs/generated/TASK_BREAKDOWN.md`
- `frontend/docs/generated/COMPONENT_INVENTORY.md`

Focus on:

- current strengths and inconsistencies
- reusable assets already in the codebase
- missing shared patterns
- recommended implementation order
- clear task slices that can be coded safely
