import presetEnv from "postcss-preset-env";
import cssnano from "cssnano";
import atImport from "postcss-import";
import mixins from "postcss-mixins";

export default {
    plugins: [
        atImport(),
        mixins(),
        presetEnv(),
        cssnano()
    ]
}