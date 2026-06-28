---
name: ideation
description: "Use when a user has a feature request, project idea, brain dump, migration, or system design that needs interview-driven planning before code. Triggers on phrases like help me plan, spec this out, think through this, interview me, I want to build, let's design, or any unstructured idea that needs structure. Skip only for well-defined implementation work already covered by a spec."
---

# Ideation

Transform unstructured ideas into implementation artifacts through a conversational interview that builds shared understanding before writing anything.

## Workflow

INTAKE -> INTERVIEW LOOP -> CONTRACT.HTML -> PHASING -> SPEC.MD GENERATION -> HANDOFF

## Phase 1-2: Interview

Read `references/interview-engine.md` and `references/confidence-rubric.md` first. Follow them before generating any artifacts.

- Accept the mess: scattered thoughts, contradictions, bullet points, voice transcripts.
- Take a position upfront: state what looks strong and what looks weak.
- Ask one focused question at a time by default. Batch only independent questions.
- Provide a recommended answer with every question.
- Explore the codebase instead of asking when the answer is discoverable.
- Keep interviewing until all 5 evidence gates are ready, or the user ends the interview early.
- Challenge vague demand, undefined terms, hypothetical users, and contradictions.

The 5 gates are:

1. Problem Clarity
2. Goal Definition
3. Success Criteria
4. Scope Boundaries
5. Consistency

When unsure, mark a gate `not-ready`.

## Phase 3: Contract

When all 5 gates are ready, generate the Mission Brief contract.

1. Confirm the project name if needed and kebab-case it into a slug.
2. Create `./docs/ideation/{slug}/`.
3. Write `contract-data.json` there using the contract schema and the evidence-gate model.
4. Run the three plan critics in parallel: `scope-creep`, `hidden-dependency`, and `success-criteria`.
5. Apply blocker findings to `contract-data.json` before rendering.
6. Read `references/contract-template.md` and generate `contract.md` from it.
7. Read `references/html-guide.md`, then generate `contract.html` from `scripts/contract-gen.js`, not by hand. Run: `node /absolute/path/to/skills/ideation/scripts/contract-gen.js <contract-data.json> <contract.html>`.
8. Open the HTML and ask for approval.

Contract rules:

- Status is `Draft` until approved.
- The contract shows the 5 gates as ready/not-ready with evidence citations.
- The contract includes scope tiers: MVP, Full, Stretch, plus out-of-scope and future items.
- Approved contracts include the execution plan and copyable command blocks.
- Preserve revision lineage via `Supersedes`.

## Phase 4: Phasing & Specs

After approval, determine whether to go straight to specs or produce PRDs first.

- Read `references/prd-template.md` if PRDs are needed.
- Read `references/spec-template.md` before generating specs.
- Use `references/feedback-loop-guide.md` for feedback-loop design.
- Generate specs lazily, one phase at a time.
- Small projects can use a single `spec.md` instead of phase-split specs.
- Repeatable phases should use a shared template plus per-phase deltas.
- Specs must include technical approach, feedback strategy, file changes, implementation details, testing requirements, failure modes, and validation commands when applicable.

## Phase 5: Execution Handoff

After specs are approved:

- Update the contract with the final execution plan.
- Set `status` to `Approved`.
- Populate the phase track and command blocks.
- Include an agent-team prompt only when 2+ phases can run in parallel.
- Generate `contract.md` to match `contract.html` for lineage and autopilot.
- Present one recommended next step, not a menu dump.

Recommended routing:

- Single phase: recommend `/ideation:execute-spec <spec>`.
- Multiple phases: recommend `/ideation:autopilot <contract.md>` if the user wants to watch, or `/ideation:get-goal-prompt <contract.md>` if they want it unattended.

## Important Notes

- HTML is for interactive artifacts only; specs and PRDs are Markdown.
- Use `AskUserQuestion` for all questions and approvals, one at a time.
- Judge gates conservatively.
- Create files lazily, only when decisions are locked.
- Specs must stand alone.
