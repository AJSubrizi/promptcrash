export type RedactionPattern = {
  name: string;
  replacement: string;
  pattern: RegExp;
};

export type RedactOptions = {
  maxDepth?: number;
};

const sensitiveKeyPattern =
  /^(?:api[_-]?key|authorization|bearer|cookie|password|private[_-]?key|secret|set-cookie|token)$/i;

const builtInPatterns: RedactionPattern[] = [
  {
    name: "email",
    replacement: "[REDACTED_EMAIL]",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  },
  {
    name: "phone",
    replacement: "[REDACTED_PHONE]",
    pattern: /(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}\b/g
  },
  {
    name: "secret",
    replacement: "[REDACTED_SECRET]",
    pattern: /\b(?:(?:sk|pk|xai|anthropic)(?:[-_][a-z0-9]+)+|(?:api|key|token|secret)(?:[-_][a-z0-9]+){2,})\b/gi
  },
  {
    name: "bearer",
    replacement: "[REDACTED_SECRET]",
    pattern: /\bbearer\s+[a-z0-9._~+/=-]{16,}\b/gi
  },
  {
    name: "jwt",
    replacement: "[REDACTED_SECRET]",
    pattern: /\beyJ[a-z0-9_-]+\.[a-z0-9_-]+\.[a-z0-9_-]+\b/gi
  },
  {
    name: "github_token",
    replacement: "[REDACTED_SECRET]",
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[a-z0-9_]{20,}\b|github_pat_[a-z0-9_]{20,}/gi
  },
  {
    name: "aws_access_key",
    replacement: "[REDACTED_SECRET]",
    pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g
  },
  {
    name: "private_key",
    replacement: "[REDACTED_SECRET]",
    pattern: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g
  },
  {
    name: "credit_card",
    replacement: "[REDACTED_CARD]",
    pattern: /\b(?:\d[ -]*?){13,19}\b/g
  }
];

export function buildPatterns(
  custom: Array<{ name: string; pattern: RegExp | string }> = []
): RedactionPattern[] {
  return [
    ...builtInPatterns,
    ...custom.map((entry) => ({
      name: entry.name,
      replacement: `[REDACTED_${entry.name.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}]`,
      pattern: typeof entry.pattern === "string" ? new RegExp(entry.pattern, "gi") : entry.pattern
    }))
  ];
}

export function redactString(value: string, patterns = builtInPatterns): string {
  return patterns.reduce(
    (current, pattern) => current.replace(pattern.pattern, pattern.replacement),
    value
  );
}

export function redactValue<T>(
  value: T,
  patterns = builtInPatterns,
  options: RedactOptions = {}
): T {
  const seen = new WeakSet<object>();
  return redactValueInternal(value, patterns, options, seen, 0) as T;
}

function redactValueInternal(
  value: unknown,
  patterns: RedactionPattern[],
  options: RedactOptions,
  seen: WeakSet<object>,
  depth: number
): unknown {
  const maxDepth = options.maxDepth ?? 25;

  if (depth > maxDepth) {
    return "[REDACTED_MAX_DEPTH]";
  }

  if (typeof value === "string") {
    return redactString(value, patterns);
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValueInternal(item, patterns, options, seen, depth + 1));
  }

  if (value && typeof value === "object") {
    if (value instanceof Date) {
      return value;
    }

    if (seen.has(value)) {
      return "[REDACTED_CIRCULAR]";
    }
    seen.add(value);

    if (value instanceof Map) {
      return Object.fromEntries(
        [...value.entries()].map(([key, item]) => [
          String(key),
          sensitiveKeyPattern.test(String(key))
            ? "[REDACTED_SECRET]"
            : redactValueInternal(item, patterns, options, seen, depth + 1)
        ])
      );
    }

    if (value instanceof Set) {
      return [...value.values()].map((item) =>
        redactValueInternal(item, patterns, options, seen, depth + 1)
      );
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        sensitiveKeyPattern.test(key)
          ? "[REDACTED_SECRET]"
          : redactValueInternal(item, patterns, options, seen, depth + 1)
      ])
    );
  }

  return value;
}
