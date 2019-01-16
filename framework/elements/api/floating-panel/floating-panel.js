define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "ojs/ojanimation"
], function(oj, ko, $) {
    "use strict";

    return function(rootParams) {
        var self = this;

        ko.utils.extend(self, rootParams.rootModel);
        self.panelId = rootParams.panelId;

        if (!self.panelId) { throw new Error(); }

        var slideInOptions = $.extend(self.slideInOptions, {
                direction: "top"
            }),
            slideOutOptions = $.extend(self.slideOutOptions, {
                direction: "bottom"
            });

        self.addEvents = function() {
            $(document).on("openFloatingPanel", "#" + self.panelId, function() {
                $("#" + self.panelId + "_parent").fadeIn();
                oj.AnimationUtils.slideIn($("#" + self.panelId)[0], slideInOptions);

                if (self.rippleElement) {
                    oj.AnimationUtils.ripple($("#" + self.rippleElement)[0], self.rippleOptions);
                }
            });

            $(document).on("closeFloatingPanel", "#" + self.panelId, function() {
                $("#" + self.panelId + "_parent").fadeOut();
                oj.AnimationUtils.slideOut($("#" + self.panelId)[0], slideOutOptions);
            });

            $(document).on("click", "div[type=\"overlayParent\"]", function(event) {
                if (event.target.getAttribute("type") === "overlayParent") {
                    $("#" + self.panelId).trigger("closeFloatingPanel");
                }
            });
        };

        self.dispose = function() {
            $(document).off("closeFloatingPanel", "#" + self.panelId);
            $(document).off("click", "div[type=\"overlayParent\"]");
        };
    };
});