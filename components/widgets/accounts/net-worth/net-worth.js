define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/recent-account-activity"
], function (oj, ko, $, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        ko.utils.extend(this, rootParams.rootModel);
        var self = this;
        self.resource = ResourceBundle;
    };
});