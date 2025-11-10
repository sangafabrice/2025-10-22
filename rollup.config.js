import minifyTemplate from "rollup-plugin-minify-template";
import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";
import { globSync } from "fs";

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
			plugins: [
				minifyTemplate(),
				string({ include: "src/**/assets/**/*.*" })
			]
		};
	}
);