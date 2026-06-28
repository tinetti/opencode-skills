# Execution Loop

Use this loop during implementation.

## Loop

1. Pick the smallest meaningful slice.
2. Read the affected code paths.
3. Implement the change.
4. Run the narrowest relevant check.
5. Inspect the result and continue or correct.

## Slice Heuristics

- Prefer end-to-end slices over broad mechanical churn.
- Land shared foundations only when a later slice clearly depends on them.
- Keep unrelated cleanup out of the diff.
- If a slice expands unexpectedly, stop and split it.
