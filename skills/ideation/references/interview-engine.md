# Interview Engine

Shared interview process for the ideation skill.

## Phase 1: Intake

- Accept messy input without judgment.
- State what looks strong and what looks weak.
- If the work touches an existing codebase, do a quick exploration sweep before the first question.
- If there are existing learnings in `docs/ideation/learnings.md`, read them and apply relevant patterns.

## Phase 2: Interview Loop

- Ask one focused question per turn by default.
- Batch only independent questions, and never more than 4 in one call.
- Provide a recommended answer with every question.
- Explore the codebase instead of asking when the answer can be discovered.
- Use `AskUserQuestion` for every question.

## Gate Tracking

Track these 5 evidence gates:

1. Problem Clarity
2. Goal Definition
3. Success Criteria
4. Scope Boundaries
5. Consistency

When unsure, mark the gate `not-ready`.

## Stop Conditions

- Stop when all 5 gates are ready.
- Stop early if the user says stop, wrap up, or that's enough.
- Do not generate artifacts in this file; return to the calling skill for contract generation.
