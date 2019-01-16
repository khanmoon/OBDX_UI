define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/debtor-money-request",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojdatetimepicker",
    "ojs/ojbutton"
], function (oj, ko, $, RequestMoneyModel, BaseLogger, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.resource = ResourceBundle;
        self.dataLoaded = ko.observable(false);
        self.customDebtorName = self.customDebtorName || ko.observable();
        Params.dashboard.headerName(self.params.header);
        RequestMoneyModel.getTransferData(self.params.instructionId).done(function () {
            self.dataLoaded(true);
        });
    };
});