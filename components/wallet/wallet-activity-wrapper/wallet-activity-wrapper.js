define([
    "ojs/ojcore",
    "knockout"
], function (oj, ko) {
    "use strict";
    return function viewModel(rootParams) {
        ko.utils.extend(this, rootParams.rootModel.data());
        var self = this;
        self.hashvariable = ko.observable();
        rootParams.baseModel.registerComponent("wallet-activity", "wallet");
        self.hashvariable(rootParams.rootModel.data().identifier);
        if (self.hashvariable() === "requestFunds") {
            rootParams.dashboard.loadComponent("wallet-activity", rootParams.rootModel.data(), self);
            location.hash = "reqFund";
        }
        if (self.hashvariable() === "unclaimedFunds") {
            rootParams.dashboard.loadComponent("wallet-activity", rootParams.rootModel.data(), self);
            location.hash = "clmFund";
        }
    };
});