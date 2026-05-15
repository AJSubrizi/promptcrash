# Replay JSON

Replay JSON captures enough context to reproduce an LLM failure without depending on production logs.

Replay JSON can include:

- Project, environment, route, provider, model, and prompt version
- System prompt and user input
- Retrieved context
- Tool call inputs and outputs
- Model output and expected behavior
- Failure type, severity, reproducibility, and metadata

The dashboard renders replay JSON on each crash detail page. You can use it as a fixture in a local eval, a bug report attachment, or a regression scaffold.
