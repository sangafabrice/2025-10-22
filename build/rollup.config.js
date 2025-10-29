import "./index.js";
import terser from "@rollup/plugin-terser";
import { string } from "rollup-plugin-string";
import app from "../package.json" with { type: "json" };

const outputNoExt = `dist/${app.name}`; 

export default {
	input: app.main,
	output: [
		{
			file: `${outputNoExt}.js`,
		},
		{
			file: `${outputNoExt}.min.js`,
			plugins: [terser()]
		}
	],
	plugins: [string({ include: "src/**/assets/**/*.*" })]
};