define([
    "knockout",
    "jquery",

    "ojL10n!lzn/alpha/resources/nls/page-banner"
], function (ko, $, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        rootParams.baseModel.registerComponent("login-form", "login");
        self.loginClick = function () {
            rootParams.dashboard.loadComponent("login-form", {});
        };
    };
});