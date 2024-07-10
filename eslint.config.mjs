import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
)), {
    plugins: {
        react: fixupPluginRules(react),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 12,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            pragma: "jsx",
            version: "detect",
            flowVersion: "0.53",
        },
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-trailing-spaces": "error",
        "eol-last": "error",
        "linebreak-style": "off",
        "react/no-unknown-property": ["error", { "ignore": ["css"] }]
    },
}, {
    files: ["**/*.test.ts*"],

    rules: {
        "react/react-in-jsx-scope": "off"
    },
}];
