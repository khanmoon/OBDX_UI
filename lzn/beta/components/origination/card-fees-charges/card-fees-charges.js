define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "baseLogger",
    "ojL10n!lzn/beta/resources/nls/card-fees-charges",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (oj, ko, $, BaseLogger, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.closeFees = function () {
            self.components()[self.components().length - 1].isComplete(true);
            self.skipComponent(self.components().length);
        };
    };
});