define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/payee-details",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, payeeModel, BaseLogger, ResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(payeeModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.stageOne = ko.observable(false);
        self.stageTwo = ko.observable(false);
        self.validationTracker = ko.observable();
        self.stageThree = ko.observable(false);
        self.stageFour = ko.observable(false);
        self.isEdit = ko.observable(false);
        self.isVerify = ko.observable(false);
        self.payments = ResourceBundle.payments;
        self.common = ResourceBundle.payments.common;
        self.payeeName = ko.observable();
        self.payeeAccountType = ko.observable();
        self.payeeRelationType = ko.observable();
        self.isPayeeRelationTypeLoaded = ko.observable(false);
        self.payeeData = ko.toJS(self.params);
        self.payeeType = ko.observable();
        self.payeeName(self.payeeData.name);
        self.icon = ko.observable(self.payeeData.image);
        self.groupId = ko.observable(ko.utils.unwrapObservable(self.payeeData.groupId));
        self.branchName = ko.observable();
        self.payeeData.payeeType = ko.utils.unwrapObservable(self.payeeData.payeeType);
        self.addressDetails = ko.toJS(getNewKoModel().addressDetails);
        self.editPayeeModel = getNewKoModel().editPayeeModel;
        self.payeeLimitModel = getNewKoModel().payeeLimitModel;
        self.tempcurrency = ko.observable("GBP");
        self.dailyLimit = ko.observable(self.payments.payee.notset);
        payeeModel.init(self.payeeData.id, self.groupId());
        Params.baseModel.registerComponent("payments-money-transfer", "payments");
        Params.baseModel.registerComponent("issue-demand-draft", "payments");
        Params.baseModel.registerElement([
            "confirm-screen",
            "amount-input"
        ]);
        Params.dashboard.headerName(self.payments.payee.payees);
        self.transferObject = ko.observable({
            payeeId: "",
            isStandingInstruction: false,
            transferType: "",
            paymentType: ""
        });
        self.limitPackage = ko.observable({
            exists: false,
            data: null,
            fetch: true
        });
        payeeModel.fetchBankConfiguration().done(function (data) {
            self.tempcurrency(data.bankConfigurationDTO.localCurrency);
        });
        self.limitFetched = ko.observable(false);
        self.limitsEffectiveTomorrowFlag = ko.observable(false);
        self.limitsEffectiveTomorrowDetailsFlag = ko.observable(false);
        self.limitsEffectiveTomorrow = ko.observable();
        payeeModel.getPayeeLimit().done(function (data) {
            self.limitFetched(true);
            if (data.limitPackageDTO && data.limitPackageDTO.targetLimitLinkages.length > 0) {
                for (var i = 0; i < data.limitPackageDTO.targetLimitLinkages.length; i++) {
                    if (data.limitPackageDTO.targetLimitLinkages[i].target.type.id === "PAYEE" && data.limitPackageDTO.targetLimitLinkages[i].target.value === self.payeeData.id && Params.baseModel.formatDate(data.limitPackageDTO.targetLimitLinkages[i].effectiveDate) <= Params.baseModel.getDate()) {
                        if (data.limitPackageDTO.targetLimitLinkages[i].expiryDate) {
                            if (Params.baseModel.formatDate(data.limitPackageDTO.targetLimitLinkages[i].expiryDate) > Params.baseModel.getDate()) {
                                self.dailyLimit(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                                break;
                            }
                        } else {
                            self.dailyLimit(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                            break;
                        }
                    } else if (data.limitPackageDTO.targetLimitLinkages[i].target.type.id === "PAYEE" && data.limitPackageDTO.targetLimitLinkages[i].target.value === self.payeeData.id && Params.baseModel.formatDate(data.limitPackageDTO.targetLimitLinkages[i].effectiveDate) > Params.baseModel.getDate()) {
                        self.limitsEffectiveTomorrowFlag(true);
                        self.limitsEffectiveTomorrow(data.limitPackageDTO.targetLimitLinkages[i].limits[0].maxAmount.amount);
                    }
                }
                self.limitPackage().exists = true;
                self.limitPackage().data = data;
            }
        });
        self.viewEffectiveTomorrow = function () {
            self.limitsEffectiveTomorrowDetailsFlag(true);
        };
        if (self.payeeData.payeeType === "DEMANDDRAFT") {
            self.payeeRelationType("demanddraft");
            self.payeeType("demandDraft");
        } else if (self.payeeData.payeeType === "INTERNAL") {
            self.payeeRelationType("bankaccount");
            self.payeeType("internal");
        } else if (self.payeeData.payeeType === "DOMESTIC") {
            self.payeeRelationType("bankaccount");
            self.payeeType("domestic");
        } else if (self.payeeData.payeeType === "INTERNATIONAL") {
            self.payeeRelationType("bankaccount");
            self.payeeType("international");
        } else if (self.payeeData.payeeType === "PEERTOPEER") {
            self.payeeRelationType("accpeertopeer");
            self.payeeType("peerToPeer");
        }
        self.payeeData.isStandingInstruction = false;
        self.transferObject({
            payeeId: self.payeeData.id,
            isStandingInstruction: false,
            payeeType: self.payeeType(),
            groupId: self.groupId()
        });
        self.isPayeeRelationTypeLoaded(true);
        self.getBranchAddress = function () {
            payeeModel.getBranchAddress(self.payeeData.branchCode).done(function (data) {
                self.branchName(data.addressDTO[0] ? data.addressDTO[0].branchName : "");
                self.addressDetails.postalAddress = data.addressDTO[0] ? data.addressDTO[0].branchAddress.postalAddress : "";
                if (data.addressDTO[0]) {
                    self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                    self.addressDetails.postalAddress.branchCode = data.addressDTO[0].id;
                }
                self.stageOne(true);
            });
        };
        self.getMyAddress = function () {
            payeeModel.fetchCourierAddress(self.payeeData.addressType).done(function (data) {
                if (data.party) {
                    for (var i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === self.payeeData.addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress;
                            self.stageOne(true);
                            break;
                        }
                    }
                }
            });
        };
        if (self.payeeData.deliveryMode === "BRN") {
            self.getBranchAddress();
        } else if (self.payeeData.deliveryMode === "MAI") {
            self.getMyAddress();
        } else {
            self.stageOne(true);
        }
        self.cancelConfirmation = function () {
            self.stageOne(true);
            self.stageTwo(false);
        };
        self.deletePayee = function () {
            $("#delete-payee").trigger("openModal");
        };
        self.cancelDeletion = function () {
            self.stageOne(true);
            self.stageTwo(false);
            self.stageThree(false);
            self.stageFour(false);
            Params.dashboard.hideDetails();
        };
        self.closeModal = function () {
            $("#delete-payee").trigger("closeModal");
        };
        self.accessType = ko.observable("PUBLIC");
        self.accessTypes = [
            {
                id: "PRIVATE",
                label: self.payments.payee.NONSHARED
            },
            {
                id: "PUBLIC",
                label: self.payments.payee.SHARED
            }
        ];
        function getConfirmScreenDetailsArray() {
            var confirmScreenDetailsArray;
            if (self.payeeData.payeeType === "INTERNAL") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeData.accountNumber
                        }
                    ],
                    [{
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        }]
                ];
            } else if (self.payeeData.payeeType === "DOMESTIC") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountnumber,
                            value: self.payeeData.accountNumber
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        },
                        {
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeData.branchCode,
                                self.payeeData.bankName,
                                self.payeeData.bankCity,
                                self.payeeData.bankCountry
                            ]
                        }
                    ]
                ];
            } else if (self.payeeData.payeeType === "INTERNATIONAL") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.accounttype,
                            value: self.payments.payee.type[self.payeeData.payeeType]
                        },
                        {
                            label: self.payments.payee.accountname,
                            value: self.payeeData.accountName
                        }
                    ],
                    [{
                            label: self.payments.payee.bankdetails,
                            value: [
                                self.payeeData.branchCode,
                                self.payeeData.bankName,
                                self.payeeData.bankCity,
                                self.payeeData.bankCountry
                            ]
                        }]
                ];
            } else if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "DOM") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.drafttype,
                            value: self.payments.payee.type[self.payeeData.demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.draftfavouring,
                            value: self.payeeData.nickName
                        }
                    ],
                    [{
                            label: self.payments.payee.payAtCity,
                            value: self.payeeData.payAtCity
                        }]
                ];
            } else if (self.payeeData.payeeType === "DEMANDDRAFT" && self.payeeData.demandDraftPayeeType === "INT") {
                confirmScreenDetailsArray = [
                    [
                        {
                            label: self.payments.payee.drafttype,
                            value: self.payments.payee.type[self.payeeData.demandDraftPayeeType]
                        },
                        {
                            label: self.payments.payee.draftfavouring,
                            value: self.payeeData.nickName
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.payAtCountry,
                            value: self.payeeData.payAtCountry
                        },
                        {
                            label: self.payments.payee.payAtCity,
                            value: self.payeeData.payAtCity
                        }
                    ]
                ];
            }
            return confirmScreenDetailsArray;
        }
        self.confirmDeletePayee = function () {
            payeeModel.deletePayee(self.payeeType()).done(function (data, status, jqXHR) {
                self.httpStatus = jqXHR.status;
                var deleteSuccessMessage, deleteStatusMessage;
                if (self.httpStatus && self.httpStatus !== 202) {
                    deleteSuccessMessage = self.payments.payee.confirmScreen.successMessage;
                    deleteStatusMessage = self.payments.common.completed;
                } else {
                    deleteSuccessMessage = self.payments.payee.confirmScreen.corpMaker;
                    deleteStatusMessage = self.payments.payee.confirmScreen.pendingApproval;
                }
                var deletePayee = "";
                if (self.payeeData.totalPayeeCount > 1) {
                    deletePayee = self.payments.payeeDeleteWithGroup;
                } else {
                    deletePayee = self.payments.payeeDelete;
                }
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: deletePayee,
                    confirmScreenExtensions: {
                        successMessage: deleteSuccessMessage,
                        statusMessages: deleteStatusMessage,
                        isSet: true,
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
                self.stageThree(false);
            });
        };
        self.cancel = function () {
            self.stageOne(false);
            self.stageTwo(false);
            self.stageThree(false);
            self.stageFour(false);
            Params.dashboard.hideDetails();
        };
        var originalAccessType = self.payeeData.payeeAccessType;
        self.cancelEdit = function () {
            self.stageOne(false);
            self.accessType(self.payeeData.payeeAccessType);
            self.isEdit(true);
            self.isVerify(false);
            self.stageTwo(true);
        };
        self.editPayeeDetails = function () {
            Params.dashboard.headerName(self.payments.editPayee);
            self.stageOne(false);
            self.accessType(self.payeeData.payeeAccessType);
            self.isEdit(true);
            self.isVerify(false);
            self.stageTwo(true);
        };
        self.cancelEditPayeeDetails = function () {
            Params.dashboard.headerName(self.payments.payee.payees);
            self.isEdit(false);
            self.isVerify(false);
            self.stageOne(true);
            self.stageTwo(false);
            self.payeeData.payeeAccessType = originalAccessType;
        };
        self.verifyEditPayeeDetails = function () {
            if (!Params.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.stageOne(true);
            self.isEdit(false);
            self.payeeData.payeeAccessType = self.accessType();
            self.isVerify(true);
            self.stageTwo(false);
        };
        self.confirmEditPayeeDetails = function () {
            var payload;
            var successMessage, statusMessages;
            if (self.accessType() === "PUBLIC")
                self.editPayeeModel.isShared(true);
            else if (self.accessType() === "PRIVATE")
                self.editPayeeModel.isShared(false);
            payload = ko.toJSON(self.editPayeeModel);
            payeeModel.editPayee(payload).done(function (data, status, jqXHR) {
                self.httpStatus = jqXHR.status;
                if (self.httpStatus && self.httpStatus !== 202) {
                    successMessage = self.payments.payee.confirmScreen.updateSuccessMessage;
                    statusMessages = self.payments.common.completed;
                } else {
                    successMessage = self.payments.payee.confirmScreen.corpMaker;
                    statusMessages = self.payments.payee.confirmScreen.pendingApproval;
                }
                self.stageOne(false);
                Params.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXHR,
                    hostReferenceNumber: data.externalReferenceId,
                    transactionName: self.payments.editPayee,
                    confirmScreenExtensions: {
                        successMessage: successMessage,
                        statusMessages: statusMessages,
                        isSet: true,
                        confirmScreenDetails: getConfirmScreenDetailsArray(),
                        template: "confirm-screen/payments-template"
                    }
                }, self);
            });
        };
    };
});