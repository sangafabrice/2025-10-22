import "./jquery.random_width.js";

export default function animateRects({ cardRects, pageRects }) {
    cardRects.randomWidth(43, 72);
    pageRects.randomWidth(75, 100);
    setTimeout(animateRects, 1000, ...arguments);
}
