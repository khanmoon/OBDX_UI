define([
    "knockout",
    "ojL10n!resources/nls/error"
], function (ko, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.locale = locale;
    };
});
