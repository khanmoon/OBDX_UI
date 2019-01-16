define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/add-new-debtor",
    "ojs/ojknockout",
    "ojs/ojbutton"
], function (oj, ko, $, newDebtorModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.nls = ResourceBundle;
        self.resource = ResourceBundle.debtors;
        self.common = ResourceBundle.common;
        self.debtorDetails = ko.observable();
        self.dataLoaded = ko.observable(false);
        Params.dashboard.headerName(self.params.header);
        Params.baseModel.registerComponent("warning-message-dialog", "payee");
        newDebtorModel.readDebtor(self.params.payerId, self.params.groupId).done(function (data) {
            self.debtorDetails(data);
            self.dataLoaded(true);
        });
    };
});