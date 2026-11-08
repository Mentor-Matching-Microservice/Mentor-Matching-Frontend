# QA Review

Use this prompt near the end of a frontend implementation cycle.

## Prompt

Read:

- `AGENTS.md`
- `frontend/RULES.md`
- all files under `frontend/docs/framework/`
- all files under `frontend/docs/generated/`

Then review the implemented frontend and refresh:

- `frontend/docs/generated/QA_CHECKLIST.md`
- `frontend/docs/generated/DECISIONS.md` if issues or tradeoffs were found

Review for:

- visual consistency
- adherence to design system guidance
- missing states
- responsive issues
- accessibility issues
- duplicated components or layout patterns
- deviations from `frontend/RULES.md`

If code fixes are requested in the same task, implement them after the review findings are clear.
