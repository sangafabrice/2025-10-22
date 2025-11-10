import ShadowCSS from "../../utils/shadowCSS.util.js";
import shadowCssText from "./assets/shadow.css";

export const PLAYER_LOADING_CSS_CLASS = "loading";

const { style } = ShadowCSS.create(shadowCssText);

export default style;