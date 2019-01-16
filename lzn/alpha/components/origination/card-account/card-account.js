define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/alpha/resources/nls/card-account",
    "ojs/ojbutton",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext"
], function (oj, ko, $, CardAccountModel, ResourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        var getNewKoModel = function () {
            var KoModel = CardAccountModel.getNewModel();
            KoModel.cardDelMode = ko.observable(ko.utils.unwrapObservable(KoModel.cardDelMode));
            KoModel.cardDelBranch = ko.observable(ko.utils.unwrapObservable(KoModel.cardDelBranch));
            KoModel.pinDelMode = ko.observable(ko.utils.unwrapObservable(KoModel.pinDelMode));
            KoModel.pinDelBranch = ko.observable(ko.utils.unwrapObservable(KoModel.pinDelBranch));
            KoModel.stmtDelMode = ko.observable(ko.utils.unwrapObservable(KoModel.stmtDelMode));
            return KoModel;
        };
        self.accountExists = ko.observable(false);
        self.validationTracker = ko.observable();
        self.cardDeliveryModes = ko.observableArray([
            {
                key: "HOME",
                description: "homeAddress"
            },
            {
                key: "BRANCH",
                description: "branch"
            }
        ]);
        self.pinDeliveryModes = ko.observableArray([
            {
                key: "HOME",
                description: "homeAddress"
            },
            {
                key: "BRANCH",
                description: "branch"
            }
        ]);
        self.stmtDeliveryModes = ko.observableArray([
            {
                key: "ONLINE",
                description: "statementDeliveryPrefOnline"
            },
            {
                key: "POST",
                description: "statementDelPrefCourier"
            },
            {
                key: "BOTH",
                description: "statementDelPrefBoth"
            }
        ]);
        self.branches = ko.observableArray();
        self.resource = ResourceBundle;
        self.cardAccountModel = ko.observable(getNewKoModel());
        self.cardDelMode = ko.observable();
        self.pinDelMode = ko.observable();
        self.stmtDelMode = ko.observable();
        self.simulationId = ko.observable("");
        self.getAccountDetailsSuccessHandler = function (data) {
            if (data.simulationId) {
                self.accountExists(true);
                self.accountCreated(true);
                switch (data.cardDeliveryMode) {
                case "HOME":
                    self.cardDelMode("HOME");
                    self.cardAccountModel().cardDelMode("HOME");
                    break;
                case "BRANCH":
                    self.cardDelMode("BRANCH");
                    self.cardAccountModel().cardDelMode("BRANCH");
                    self.cardAccountModel().cardDelBranch(data.cardDeliveryBranch);
                    break;
                default:
                    self.cardDelMode("HOME");
                    self.cardAccountModel().cardDelMode("HOME");
                }
                switch (data.pinDeliveryMode) {
                case "HOME":
                    self.pinDelMode("HOME");
                    self.cardAccountModel().pinDelMode("HOME");
                    break;
                case "BRANCH":
                    self.pinDelMode("BRANCH");
                    self.cardAccountModel().pinDelMode("BRANCH");
                    self.cardAccountModel().pinDelBranch(data.pinDeliveryBranch);
                    break;
                default:
                    self.pinDelMode("HOME");
                    self.cardAccountModel().pinDelMode("HOME");
                }
                switch (data.statementDeliveryMode) {
                case "ONLINE":
                    self.stmtDelMode("ONLINE");
                    self.cardAccountModel().stmtDelMode("ONLINE");
                    break;
                case "POST":
                    self.stmtDelMode("POST");
                    self.cardAccountModel().stmtDelMode("POST");
                    break;
                case "BOTH":
                    self.stmtDelMode("BOTH");
                    self.cardAccountModel().stmtDelMode("BOTH");
                    break;
                default:
                    self.stmtDelMode("ONLINE");
                    self.cardAccountModel().stmtDelMode("ONLINE");
                }
                if (!self.productDetails().structureSolutionModel.cardAccountModel) {
                    self.productDetails().structureSolutionModel.cardAccountModel = self.cardAccountModel();
                    self.productDetails().structureSolutionModel.cardAccountModel.simulationId = data.simulationId;
                    self.simulationId(data.simulationId);
                }
            } else {
                self.cardDelMode("HOME");
                self.pinDelMode("HOME");
                self.stmtDelMode("ONLINE");
                self.cardAccountModel().cardDelMode("HOME");
                self.cardAccountModel().pinDelMode("HOME");
                self.cardAccountModel().stmtDelMode("ONLINE");
                self.simulationId("");
            }
        };
        self.fetchAddressSuccessHandler = function (data) {
            for (var i = 0; i < data.partyAddressDTO.length; i++) {
                if (data.partyAddressDTO[i].type === "RES") {
                    self.cardAccountModel().address.country = data.partyAddressDTO[i].postalAddress.country;
                    self.cardAccountModel().address.state = data.partyAddressDTO[i].postalAddress.state;
                    self.cardAccountModel().address.city = data.partyAddressDTO[i].postalAddress.city;
                    self.cardAccountModel().address.postalCode = data.partyAddressDTO[i].postalAddress.postalCode;
                    self.cardAccountModel().address.line1 = data.partyAddressDTO[i].postalAddress.line1;
                    self.cardAccountModel().address.line2 = data.partyAddressDTO[i].postalAddress.line2;
                }
            }
        };
        self.fetchBranchesSuccessHandler = function (data) {
            for (var i = 0; i < data.addressDTO.length; i++) {
                self.branches().push({
                    code: data.branchDTOs[i].branchCode,
                    description: data.branchDTOs[i].branchName
                });
            }
        };
        CardAccountModel.fetchBranches(self.fetchBranchesSuccessHandler, self.productDetails().submissionId.value);
        CardAccountModel.getAccountDetails(self.getAccountDetailsSuccessHandler, self.productDetails().submissionId.value, self.productDetails().facilityId);
        CardAccountModel.getAddress(self.fetchAddressSuccessHandler, self.productDetails().submissionId.value, self.applicantDetails()[0].applicantId().value);
        self.saveFunction = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.cardAccountModel().selectedValues.cardDelBranch = rootParams.baseModel.getDescriptionFromCode(self.branches(),self.cardAccountModel().cardDelBranch());
            self.cardAccountModel().selectedValues.pinDelBranch = rootParams.baseModel.getDescriptionFromCode(self.branches(), self.cardAccountModel().pinDelBranch());
            self.cardAccountModel().stmtDelMode(self.stmtDelMode());
            self.cardAccountModel().pinDelMode(self.pinDelMode());
            self.cardAccountModel().cardDelMode(self.cardDelMode());
            var sendDataForAccountCreation = {
                "cardDeliveryMode": self.cardAccountModel().cardDelMode(),
                "pinDeliveryMode": self.cardAccountModel().pinDelMode(),
                "facilityId": self.productDetails().facilityId,
                "statementDeliveryMode": self.cardAccountModel().stmtDelMode(),
                "accountTitle": "Credit_Card_Application",
                "offerId": self.productDetails().offerId,
                "cardDeliveryAddress": self.cardAccountModel().address,
                "pinDeliveryAddress": self.cardAccountModel().address,
                "cardDeliveryBranch": self.cardAccountModel().cardDelBranch(),
                "pinDeliveryBranch": self.cardAccountModel().pinDelBranch(),
                "currency": self.productDetails().baseCurrency,
                "simulationId": self.simulationId()
            };
            CardAccountModel.createCardAccount(self.createCardAccountSuccessHandler, self.productDetails().submissionId.value, sendDataForAccountCreation);
        };
        self.createCardAccountSuccessHandler = function (data) {
            self.dataLoaded(true);
            if (!self.productDetails().structureSolutionModel.cardAccountModel) {
                self.productDetails().structureSolutionModel.cardAccountModel = self.cardAccountModel();
                self.simulationId(data.simulationID);
            }
            self.productDetails().structureSolutionModel.cardAccountModel.simulationId = data.simulationID;
            self.accountCreated(true);
            self.components()[0].isComplete(true);
            self.showNextComponent(self.indexCardAccount);
        };
        self.skipFunction = function () {
            self.skipComponent(self.indexCardAccount);
        };
    };
});
