define([
    "knockout"
], function (ko) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        rootParams.baseModel.registerComponent("wallet-activity", "wallet");
        self.identifier = "unclaimedFunds";
        self.openComponent = ko.observable("wallet-activity");
        rootParams.dashboard.loadComponent(self.openComponent(), {}, self);
    };
});