# Implement Foundation

Use this prompt when the next step is shared UI groundwork rather than one screen only.

## Prompt

Read:

- `AGENTS.md`
- `frontend/RULES.md`
- all files under `frontend/docs/framework/`
- the current files under `frontend/docs/generated/`

Then implement the shared foundation required by the plan.

Possible foundation scope:

- app-wide visual tokens
- shared page shells
- reusable cards and section headers
- form patterns
- loading, empty, and error states
- shared dashboard layout improvements

Requirements:

- reuse existing `app/components/ui` primitives first
- document any meaningful reusable additions in `DESIGN_SYSTEM.md`
- avoid implementing page-specific hacks in foundation work
- run frontend validation commands when feasible
