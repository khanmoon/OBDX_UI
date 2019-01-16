define([
    "knockout"
], function (ko) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerElement("object-card");
        rootParams.baseModel.registerComponent("wallet-activity", "wallet");
    };
});