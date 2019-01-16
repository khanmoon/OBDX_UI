define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojs/ojknockout"
], function (oj, ko, $) {
    "use strict";
    return function (Params) {
        var self = this, getImageUrl = function (dir, img, sizeSuffix, highRes, rtl, highContrast) {
                sizeSuffix = sizeSuffix || "";
                rtl = rtl || false;
                highRes = highRes || false;
                highContrast = highContrast || false;
                var sourceRoot = dir + "/";
                if (highContrast === true) {
                    sourceRoot = sourceRoot + "hc/" + img;
                } else {
                    sourceRoot = sourceRoot + sizeSuffix;
                    if (highRes === true) {
                        sourceRoot = sourceRoot + "@2x/";
                    }
                }
                if (rtl) {
                    sourceRoot = sourceRoot + "rtl/";
                }
                return sourceRoot + img;
            };
        self.customClasses = ko.observable();
        if (Params.data.customClass) {
            self.customClasses(Params.data.customClass);
        }
        self.errorImage = Params.data.errorImage;
        self.highResolutionQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.HIGH_RESOLUTION);
        self.highResolution = window.matchMedia(self.highResolutionQuery).matches;
        self.rtl = $("html").attr("dir") === "rtl";
        self.highContrast = $("body").hasClass("oj-hicontrast");
        self.source = ko.pureComputed(function () {
            var sizeDir = "";
            if (Params.baseModel.medium()) {
                sizeDir = "md/";
            } else {
                sizeDir = "sm/";
            }
            return getImageUrl(Params.data.dir, Params.data.image, sizeDir, self.highResolution, self.rtl, self.highContrast);
        });
    };
});