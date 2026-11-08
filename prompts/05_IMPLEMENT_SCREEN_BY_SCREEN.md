# Implement Screen By Screen

Use this prompt when implementing a specific route or a small group of related screens.

## Prompt

Read:

- `AGENTS.md`
- `frontend/RULES.md`
- all files under `frontend/docs/framework/`
- the current implementation artifacts under `frontend/docs/generated/`

Then:

1. choose the next highest-priority screen from the plan
2. inspect existing route, layout, hooks, services, and shared components
3. implement the screen with minimal duplication
4. extract shared pieces when they are clearly reusable
5. update `SCREEN_SPECS.md` or `DECISIONS.md` if the implementation reveals a better stable pattern

For the chosen screen, explicitly cover:

- layout
- primary actions
- empty/loading/error states
- responsive behavior
- accessibility basics
