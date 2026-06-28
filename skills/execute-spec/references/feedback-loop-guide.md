# Feedback Loop Guide

Use this during execution to keep validation tight and fast.

## Choose The Smallest Useful Loop

- Data or business logic: targeted unit or integration test.
- UI components: storybook, dev server, screenshot harness, or focused UI test.
- API endpoints: request-level test, curl script, or existing API harness.
- CLI tools: run the command directly against a scoped input.
- Config, types, constants, and trivial re-exports: typecheck or existing project validation is usually enough.

## For Each Slice Ask

1. What changed?
2. What is the fastest proof it works?
3. What broader check still needs to run before handoff?

## Rules

- Prefer spec-defined checks first.
- Keep the loop scoped to the slice you just changed.
- Run broader validation after the local loop passes.
- Reuse project-native tooling instead of inventing new harnesses unless the spec explicitly asks for one.
