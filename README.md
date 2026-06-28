# opencode-skills

Reusable opencode skills maintained in `tinetti/opencode-skills`.

## Included skills

- `ideation`: turns rough ideas into contracts, specs, and execution handoff artifacts.
- `execute-spec`: executes an approved implementation spec against a codebase.

## Install

Add this repository to your opencode config:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "skills": {
    "paths": ["/absolute/path/to/opencode-skills/skills"]
  }
}
```

Or clone it into a shared location and point `skills.paths` at the `skills/` directory.

## Layout

```text
skills/
  ideation/
  execute-spec/
```

Each skill is self-contained and follows the standard `SKILL.md` plus support-files layout expected by opencode.
