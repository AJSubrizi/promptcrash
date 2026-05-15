export type RedactionPattern = {
  name: string;
  replacement: string;
  pattern: RegExp;
};

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
    pattern: /\b(?:sk|pk|xai|anthropic|api|key|token|secret)[_-]?[a-z0-9]*[_-]?[a-z0-9]{16,}\b/gi
  },
  {
    name: "credit_card",
    replacement: "[REDACTED_CARD]",
    pattern: /\b(?:\d[ -]*?){13,19}\b/g
  }
];

export function buildPatterns(custom: Array<{ name: string; pattern: RegExp | string }> = []): RedactionPattern[] {
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
  return patterns.reduce((current, pattern) => current.replace(pattern.pattern, pattern.replacement), value);
}

export function redactValue<T>(value: T, patterns = builtInPatterns): T {
  if (typeof value === "string") {
    return redactString(value, patterns) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, patterns)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, redactValue(item, patterns)])
    ) as T;
  }

  return value;
}
