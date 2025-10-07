/** @type {import("jquery")} */
(function ($) {
    $.fn.loadComponent = function () {
        const deferred = $.Deferred();
        const url = arguments[0] ?? this.attr("data-src");
        this.load(url, function (_, success) {
            if (success == "success") {
                $(this.firstElementChild).unwrap()
                return deferred.resolve();
            };
            return deferred.reject();
        })
        return deferred.promise();
    }
})(jQuery);