---
name: execute-spec
description: "Use when the user provides a spec, phase doc, PRD, or implementation markdown and wants it executed. Triggers on `/execute-spec`, 'implement this spec', 'build phase 2', 'carry out this plan', or 'make the changes in docs/.../spec.md'. Skip when the work still needs ideation, contracting, or spec writing."
---

# Execute Spec

Turn an approved implementation spec into validated code changes with minimal drift from the written plan.

## Workflow

SPEC INTAKE -> CODEBASE RECON -> BLOCKER CHECK -> EXECUTION SLICES -> VALIDATION -> HANDOFF

## Phase 1: Spec Intake

Read `references/spec-intake.md` first.

- Read the whole spec before editing.
- Treat the spec as the source of truth for scope, but verify assumptions against the codebase.
- Read files explicitly named by the spec before changing them.
- Separate true blockers from low-risk gaps you can cover with an explicit assumption.
- If the spec conflicts with the codebase, trust the codebase for current state and surface the mismatch instead of silently widening scope.

## Phase 2: Recon And Execution Plan

- Explore the relevant code paths before editing.
- Convert the spec into the smallest sensible execution slices.
- Prefer direct edits over introducing new abstractions the spec does not require.
- Keep one active slice at a time unless the spec clearly breaks into independent tracks.
- If multiple tracks can run in parallel, read `references/agent-team-handoff.md` before delegating.

## Phase 3: Implement

Read `references/execution-loop.md` and `references/feedback-loop-guide.md` before major edits.

- Implement the smallest end-to-end slice that proves progress.
- After each non-trivial slice, run the narrowest validation loop available.
- Preserve user changes and existing local modifications.
- Do not rewrite the spec unless the user asks; execute it.
- Only deviate from the spec when code reality forces it, and document the deviation in the handoff.
- If you hit a blocker, read `references/blocker-triage.md` and either resolve it from evidence or ask one focused question.

## Phase 4: Validate

- Run validation commands required by the spec first.
- Then run the smallest project-native checks that cover the touched surface area.
- Fix failures caused by your changes before handing off.
- If a full validation pass is too expensive or unavailable, say exactly what was and was not run.

## Phase 5: Handoff

Read `references/handoff-template.md` before the final response.

- Summarize implemented scope, validations, and any deviations from the spec.
- Call out incomplete items separately from completed work.
- Include concrete file references when reporting tradeoffs, blockers, or follow-up work.
- Recommend one obvious next step when there is one.

## Important Notes

- Do not generate contracts, PRDs, or HTML artifacts here.
- Do not re-plan the whole project unless the spec is missing execution-critical detail.
- Do not widen scope to clean up adjacent code unless the spec explicitly calls for it.
- Prefer updating existing files and tests over creating parallel systems.
- If the spec is wrong, incomplete, or stale, surface that with file references and the smallest blocking question possible.
- Finish with code, validation, and a clear handoff whenever feasible.
