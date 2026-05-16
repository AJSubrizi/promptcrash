# Security

PromptCrash handles potentially sensitive LLM traces. Please report security issues privately.

## Reporting

Open a private security advisory on GitHub or contact the maintainer directly through the repository owner profile.

Please include:

- A clear description of the issue.
- Steps to reproduce.
- The expected impact.
- Any suggested mitigation.

## Redaction Scope

PromptCrash redaction is best effort. It catches common sensitive patterns and supports custom SDK regex patterns, but no regex-based redactor can guarantee removal of every secret or proprietary value.

Keep captures local by default, avoid sending unnecessary sensitive context, and add domain-specific redaction patterns for your application.
