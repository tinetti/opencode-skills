# Feedback Loop Design Guide

Use this when generating implementation specs.

## Map component type to feedback mechanism

- Data/logic layers: test file
- UI components: dev server or storybook
- API endpoints: curl/httpie script or test harness
- CLI tools: the tool itself
- Config/types/constants: skip, typecheck covers it

## Three questions for each component

1. What's the playground?
2. What's the experiment?
3. What's the fastest check command?

## Rules

- The check command should run in seconds.
- Use a tight, scoped loop.
- Skip trivial components like config, types, constants, and simple re-exports.
- Prefer discovered project infrastructure over inventing new tooling.
