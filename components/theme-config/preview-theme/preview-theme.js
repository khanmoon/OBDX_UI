define(["ojL10n!resources/nls/preview-theme"], function (locale) {
    "use strict";
    return function (params) {
        var self = this;
        self.themeData = params.themeData;
        self.modelInit = params.modelInit;
        self.sizeUnit = params.sizeUnit;
        self.resourceBundle = locale;
    };
});