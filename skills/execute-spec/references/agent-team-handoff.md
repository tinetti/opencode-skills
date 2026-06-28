# Agent Team Handoff

Use this only when a spec cleanly decomposes into independent execution tracks.

## Rules

- Keep one lead session responsible for the full spec.
- Split by file ownership or vertical slice, not by arbitrary task lists.
- Do not parallelize work that touches the same files or same test surfaces.
- Give every teammate a concrete slice, target files, and validation command.
- Require each teammate to report changed files, checks run, and open issues.

## Lead Responsibilities

- Read the entire spec before delegating.
- Reserve shared setup and final integration for the lead.
- Reconcile teammate outputs back against the original spec.
- Run the final validation sweep after merging slices.
