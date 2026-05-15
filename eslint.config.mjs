import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "**/.next/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/coverage/**",
      "**/*.config.cjs",
      "pnpm-lock.yaml"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  },
  {
    files: ["apps/web/**/*.{ts,tsx}", "examples/nextjs-support-agent/**/*.{ts,tsx}"],
    ...nextPlugin.flatConfig.recommended,
    settings: {
      next: {
        rootDir: ["apps/web/", "examples/nextjs-support-agent/"]
      }
    },
    rules: {
      ...nextPlugin.flatConfig.recommended.rules,
      ...nextPlugin.flatConfig.coreWebVitals.rules,
      "@next/next/no-html-link-for-pages": "off"
    }
  },
  {
    files: ["**/*.config.{js,mjs,ts}", "**/next-env.d.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off"
    }
  }
);
