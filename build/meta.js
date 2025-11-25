import { join } from "path";
import { pathToFileURL } from "url";
const meta = {};
meta.dirname = import.meta.dirname;
meta.filename = join(import.meta.dirname, "index.js");
meta.url = pathToFileURL(meta.filename).href;
meta.resolve = import.meta.resolve.bind(meta);
export default meta