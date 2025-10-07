/** @type {import("jquery")} */
(function ($) {
    function getRandomWidth (min, max) {
        return (Math.random() * (max - min + 1)) + min;
    }

    $.fn.randomWidth = function (min, max) {
        this.attr("width", () => getRandomWidth(min, max));
        return this;
    }
})(jQuery);