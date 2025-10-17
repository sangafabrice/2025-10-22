import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";
import { globSync } from "fs";
import { resolve } from "path";

process.chdir(resolve(import.meta.dirname + "/.."));

export default globSync("src/*.js").map(
	function (input) {
		const file = "dist/" + input.slice("src/".length);
		return {
			input,
			output: [
				{ file },
				{
					file: file.slice(0, -".js".length) + ".min.js",
					plugins: [terser()]
				}
			],
			plugins: [string({ include: "src/**/assets/**/*.*" })]
		};
	}
);