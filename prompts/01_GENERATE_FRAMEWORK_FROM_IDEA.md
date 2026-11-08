# Generate Framework From Idea

Use this prompt when the product idea is still rough and the frontend design system needs direction.

## Prompt

Read:

- `AGENTS.md`
- `frontend/RULES.md`
- `frontend/docs/AI_RUNBOOK.md`

Then create or refresh these files:

- `frontend/docs/framework/PROJECT_CONTEXT.md`
- `frontend/docs/framework/DESIGN_RULES.md`
- `frontend/docs/framework/DESIGN_SYSTEM.md`
- `frontend/docs/framework/SCREEN_SPECS.md`

Task:

- convert the product idea into actionable frontend context
- define a coherent visual direction suitable for Mentor Matching
- document reusable layout and component patterns
- document initial screen expectations
- keep guidance specific enough to implement from, but concise enough to maintain

Constraints:

- align with the existing React Router and component structure in the repo
- do not invent backend capabilities not present in the product
- prefer reusable dashboard and marketplace patterns over one-off visuals
