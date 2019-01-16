define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("locator", "atm-branch-locator");
        rootParams.baseModel.registerComponent("map", "inputs");
    };
});