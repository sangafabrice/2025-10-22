import "./jquery.fallback.js";
import "./jquery.load_component.js";
import getRects from "./rects.getter.js";
import animateRects from "./hero.animate.js";
import renderCurrentTimeOnTick from "./render.time.js";

document.fonts.ready.then(() => $("time").removeAttr("hidden"));
$('[is="background"]').loadComponent();
$('[is="hero"]').loadComponent().then(getRects).done(animateRects);
renderCurrentTimeOnTick();