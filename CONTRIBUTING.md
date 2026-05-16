# Contributing

Thanks for helping improve PromptCrash.

PromptCrash is a local-first developer tool for debugging failed LLM interactions. Contributions should keep the project focused on one workflow:

```text
failed LLM output -> redacted crash -> replay JSON -> regression scaffold
```

## Development Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm db:init
pnpm db:seed
pnpm dev
```

The dashboard runs at `http://localhost:3000`.

## Checks

Run these before opening a PR:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Pull Requests

- Keep changes scoped and explain the debugging workflow they improve.
- Add or update tests for redaction, capture, replay JSON, classification, or SDK behavior when relevant.
- Do not add hosted services or paid-provider requirements to core capture behavior.
- Keep docs honest about redaction being best effort.

## Good First Issues

- Improve redaction fixtures.
- Add replay JSON examples.
- Add provider-specific crash examples.
- Improve dashboard accessibility and keyboard navigation.
