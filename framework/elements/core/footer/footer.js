define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/footer"
], function (oj, ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams);
        self.resourceBundle = resourceBundle;
    };
});