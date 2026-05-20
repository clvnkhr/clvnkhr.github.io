import js from "@eslint/js"
import tsPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

export default [
  js.configs.recommended,
  {
    ignores: ["dist/", "node_modules/", "lib/", "src/assets/", "*.md"]
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx", "test/**/*.ts", "test/**/*.tsx"],
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true
      }
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "no-restricted-syntax": [
        "error",
        {
          selector: 'TSAsExpression[typeAnnotation.type="TSAnyKeyword"]',
          message: "Using 'as any' disables type checking. Use a proper type instead."
        },
        {
          selector: 'TSAsExpression[typeAnnotation.type="TSNeverKeyword"]',
          message: "Using 'as never' is unsafe. Use a proper type instead."
        }
      ],
      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
]
