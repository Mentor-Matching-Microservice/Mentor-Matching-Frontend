# AI Runbook

This runbook defines how AI should operate on the frontend of Mentor Matching.

## Goal

Use AI to:

- turn product ideas into UI direction
- produce consistent UI/UX specs
- implement frontend code that follows repository rules
- review and refine the result with explicit QA steps

## Repo Anchors

Always read these first before making frontend changes:

1. `AGENTS.md`
2. `frontend/RULES.md`
3. `frontend/docs/framework/PROJECT_CONTEXT.md`
4. `frontend/docs/framework/UI_WORKFLOW.md`
5. `frontend/docs/framework/ROUTER_DATA_STRATEGY.md`
6. `frontend/docs/framework/DESIGN_RULES.md`
7. `frontend/docs/framework/DESIGN_SYSTEM.md`
8. `frontend/docs/framework/SCREEN_SPECS.md`
9. Relevant files under `frontend/docs/generated/`

## Operating Model

There are two classes of documents:

- `framework/`: stable guidance and source-of-truth context
- `generated/`: working outputs created or updated during delivery

When a generated file conflicts with framework guidance, framework wins unless `DECISIONS.md` records an intentional override.

## Expected Delivery Flow

1. Understand current product and route structure.
2. Audit existing UI, components, tokens, and screen coverage.
3. Produce or refresh implementation plan.
4. Produce UI/UX spec and wireframe notes.
5. Implement shared foundation first.
6. Implement screen by screen.
7. Run QA and record decisions or follow-up items.

## Non-Negotiables

- Follow `frontend/RULES.md` for engineering conventions.
- Use `app/components/ui` as the default low-level UI foundation for frontend work.
- Reuse existing `app/components/ui` and app components before creating new ones.
- When building or refactoring screens, prefer composing domain components from shadcn primitives already present in `app/components/ui`.
- Keep route files thin when logic belongs in hooks, services, or reusable components.
- Prefer consistency across screens over isolated visual experiments.
- Update docs when a design or architecture decision affects future work.

## When To Update Which File

- Update `PROJECT_CONTEXT.md` when product scope or route map changes.
- Update `DESIGN_RULES.md` when visual rules change.
- Update `DESIGN_SYSTEM.md` when tokens, shared patterns, or reusable components change.
- Update `SCREEN_SPECS.md` when screen behavior, sections, or states change.
- Update `DECISIONS.md` when tradeoffs are made.
- Update `QA_CHECKLIST.md` when new validation criteria become necessary.

## Definition Of Done

A frontend task is complete when:

- the UI matches the intended spec
- code follows `frontend/RULES.md`
- shared patterns are extracted when appropriate
- affected docs are updated
- `npm run format:write` is run when code changes are made
- lint, typecheck, tests, and build are considered and run when feasible
