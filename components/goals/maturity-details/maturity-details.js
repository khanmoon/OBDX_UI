define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/goal-maturity-details",
    "ojs/ojknockout-validation",
    "ojs/ojvalidationgroup"
], function (oj, ko, $, maturityDetailsModel, ResourceBundle) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.accountTypeList = ko.observableArray();
        self.currentTask = ko.observable("GL_N_UGLA");
        self.defaultRegion = "INDIA";
        self.networkTypes = ko.observableArray();
        self.branches = ko.observableArray();
        self.resource = ResourceBundle;
        self.details = self.maturityDetails();
        self.additionalDetailsMaturity = ko.observable();
        self.bankCodeValidationTracker = ko.observable();
        Params.dashboard.headerName();
        Params.baseModel.registerElement("bank-look-up");
        self.accountTypeList = [
            {
                value: "Self",
                label: self.resource.maturityDetails.self
            },
            {
                value: "Domestic",
                label: self.resource.maturityDetails.domestic
            },
            {
                value: "Internal",
                label: self.resource.maturityDetails.internal
            }
        ];
        if (!self.details.accountType()) {
            self.details.accountType(self.accountTypeList[0].value);
        }
        self.networkTypeChanged = function (event) {
            if (event.detail.value) {
                self.details.networkType(event.detail.value);
                self.network(event.detail.value);
            }
        };
        maturityDetailsModel.getNetworkTypes(self.defaultRegion).done(function (data) {
            for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                self.networkTypes.push({
                    lable: data.enumRepresentations[0].data[i].description,
                    value: data.enumRepresentations[0].data[i].code
                });
            }
            self.details.networkType(data.enumRepresentations[0].data[0].code);
        });
        self.verifyCode = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.bankCodeValidationTracker())) {
                return;
            }
            maturityDetailsModel.getBankDetailsDCC(self.details.bankCode(), self.network()).done(function (data) {
                var codeMatched = false;
                for (var i = 0; i < data.listFinancialInstitution.length; i++) {
                    if (data.listFinancialInstitution[i].code.toLowerCase() === self.details.bankCode().toLowerCase()) {
                        self.details.bankDetails(data.listFinancialInstitution[i]);
                        codeMatched = true;
                        break;
                    }
                }
                if (!codeMatched) {
                    self.details.bankCode("");
                    Params.baseModel.showMessages(null, [self.resource.maturityDetails.invalidCode], "INFO");

                }
            }).fail(function () {
                self.details.bankCode("");
            });
        };
        self.accountTypeChangeHandler = function (event) {
            if (event.detail.value) {
                self.details.accountType(self.details.accountType());
            }
        };
        self.branchChangeHandler = function (event) {
            if (event.detail.value) {
                self.details.branch(self.details.branch());
            }
        };
        self.openLookup = function () {
            $("#menuButtonDialog").trigger("openModal");
        };
        self.resetCode = function () {
            self.details.bankCode("");
            self.details.bankDetails("");
        };
    };
});