import terser from "@rollup/plugin-terser";
import { chdir } from "process";
import app from "./package.json" with { type: "json" };

chdir("src");

export const MAIN_MIN_JS = "js/bin/main.min.js";

export default {
	input: app.main,
	output: [
		{
			file: MAIN_MIN_JS,
			format: "umd",
			plugins: [terser()]
		}
	]
};