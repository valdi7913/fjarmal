import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{
		languageOptions: { globals: globals.browser },
		code: 120,
	},
	pluginJs.configs.recommended,
];
