import js from "@eslint/js";
import globals from "globals";
import prettierConfig from "eslint-config-prettier";
import reactX from "eslint-plugin-react-x";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default tseslint.config(
  { ignores: ["dist", "postcss.config.cjs", "src/gen"] },
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
  },
  js.configs.recommended,
  tseslint.configs.recommended,
  reactX.configs.recommended,
  reactRefresh.configs.vite,
  eslintPluginUnicorn.configs.recommended,
  prettierConfig,
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "react/prop-types": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-null": "off",
      "unicorn/prefer-optional-catch-binding": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/text-encoding-identifier-case": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          ignoreRestSiblings: false,
          vars: "all",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
);
