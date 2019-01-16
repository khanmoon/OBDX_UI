define([
    "knockout"
], function (ko) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("pfm-dashboard", "personal-finance-management");
    };
});