define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "ojL10n!resources/nls/account-type-dialog",
    "framework/js/constants/constants",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payments = ResourceBundle.payments;
        $("#choiseDialog").trigger("openModal");
        Params.baseModel.registerComponent("demand-draft-payee", "payee");
        Params.baseModel.registerComponent("bank-account-payee", "payee");
        self.accountType = ko.observable("bank-account-payee");
        self.modalCloseHandler = Params.modalCloseHandler;
        self.createPayee = function () {
            $("#choiseDialog").trigger("closeModal");
            self.selectedTab = "";
            Params.dashboard.loadComponent("manage-accounts", {
                applicationType: "payee",
                defaultTab: self.accountType()
            }, self);
        };
    };
});