define([
    "knockout",
    "jquery",

    "ojL10n!resources/nls/user-login-configuration",
    "ojs/ojknockout",
    "ojs/ojcheckboxset",
    "ojs/ojbutton"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.nls = resourceBundle;
    };
});