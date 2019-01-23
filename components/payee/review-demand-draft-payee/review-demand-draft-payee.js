define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/demand-draft-payee",
    "ojL10n!resources/nls/domestic-demand-draft-payee",
    "ojL10n!resources/nls/international-demand-draft-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojbutton"
], function (oj, ko, $, DDPayeeModel, BaseLogger, CommonPayee, DomesticResourceBundle, InternationalResourceBundle, Constants) {
    "use strict";
    return function (Params) {
        var self = this, getNewKoModel = function () {
                var KoModel = ko.mapping.fromJS(DDPayeeModel.getNewModel());
                return KoModel;
            };
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.payeeType = ko.observable();
        self.selectedCountry = ko.observable();
        self.dataLoaded = ko.observable(false);
        self.name = ko.observable();
        self.nickName = ko.observable();
        self.payAtCity = ko.observable();
        self.deliveryMode = ko.observable();
        self.addressDetails = getNewKoModel().addressDetails;
        self.payments = CommonPayee.payments;
        self.common = CommonPayee.payments.common;
        self.payments.payee.international = InternationalResourceBundle.payments.payee.international;
        self.payments.payee.domestic = DomesticResourceBundle.payments.payee.domestic;
        void(self.params.reviewMode && Params.dashboard.headerName(self.params.header));
        self.domesticpayments = {};
        self.domestic = {};
        self.international = {};
        self.getConfirmScreenMsg = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec"){
                var errors = jqXHR.responseJSON.transactionAction.transactionDTO.errors;
                return errors && errors[0] && errors[0].errorMessage?errors[0].errorMessage:self.payments.common.confirmScreen.approvalMessages.FAILED.successmsg;
            }else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].successmsg;
        };
        self.getConfirmScreenStatus = function (jqXHR) {
            if (jqXHR.responseJSON.transactionAction && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.status === "F" && jqXHR.responseJSON.transactionAction.transactionDTO.processingDetails.currentStep === "exec")
                return self.payments.common.confirmScreen.approvalMessages.FAILED.statusmsg;
            else if (jqXHR.responseJSON.transactionAction)
                return self.payments.common.confirmScreen.approvalMessages[jqXHR.responseJSON.transactionAction.transactionDTO.approvalDetails.status].statusmsg;
        };
        DDPayeeModel.getPayeeDetails(self.params.data ? self.params.data.groupId() : self.params.payeeGroupId(), self.params.data ? self.params.data.payeeId() : self.params.payeeId()).done(function (data) {
            self.payeeType(data.demandDraftPayeeDTO.demandDraftPayeeType);
            if (self.payeeType() === "DOM") {
                self.domestic = data.demandDraftPayeeDTO;
                self.deliveryMode(self.domestic.demandDraftDeliveryDTO.deliveryMode);
                self.domestic.name = ko.observable(self.domestic.name);
                self.domestic.nickName = ko.observable(self.domestic.nickName);
                self.domestic.payAtCity = ko.observable(self.domestic.payAtCity);
                self.domestic.demandDraftDeliveryDTO.deliveryMode = self.deliveryMode();
                self.payeeAccessType = ko.utils.unwrapObservable(data.demandDraftPayeeDTO.payeeAccessType);
                if(self.domestic.demandDraftDeliveryDTO.deliveryMode === "BRN")
                    self.getBranchDetails(self.domestic.demandDraftDeliveryDTO.branch);
                else if(self.domestic.demandDraftDeliveryDTO.deliveryMode === "MAI")
                    self.getPartyAddress(self.domestic.demandDraftDeliveryDTO.addressType);
                else
                    self.dataLoaded(true);
                if (self.payeeData) {
                    self.payeeData.nickName = self.domestic.nickName;
                    self.payeeData.name = self.domestic.name;
                    self.payeeData.id = self.domestic.id;
                    self.payeeData.payeeType = "DEMANDDRAFT";
                    self.payeeData.demandDraftPayeeType = "DOM";
                    self.payeeData.payAtCity = self.domestic.payAtCity;
                    self.payeeData.demandDraftDeliveryDTO = self.domestic.demandDraftDeliveryDTO;
                    self.payeeData.demandDraftDeliveryDTO.deliveryMode = self.domestic.demandDraftDeliveryDTO.deliveryMode;
                    if(self.payeeData.demandDraftDeliveryDTO.deliveryMode === "BRN")
                        self.getBranchDetails(self.domestic.demandDraftDeliveryDTO.branch);
                    else if(self.payeeData.demandDraftDeliveryDTO.deliveryMode === "MAI")
                        self.getPartyAddress(self.domestic.demandDraftDeliveryDTO.addressType);
                    else
                        self.dataLoaded(true);
                    self.setLimitClicked = ko.observable(false);
                    self.confirmPage = ko.observable(true);
                    self.setMonthlyLimitClicked = ko.observable(false);
                    self.payeeData.limitDetails = {
                        DAILY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        },
                        MONTHLY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        }
                    };
                }
                var confirmScreenDetailsArrayDomestic = [
                    [
                        {
                            label: self.payments.payee.domestic.drafttype,
                            value: self.payments.payee.accdomestic
                        },
                        {
                            label: self.payments.payee.domestic.draftfavouring,
                            value: self.domestic.nickName
                        }
                    ],
                    [{
                            label: self.payments.payee.domestic.draftpayableatcity,
                            value: self.domestic.payAtCity
                        }]
                ];
                if (typeof self.confirmScreenDetails === "function")
                    self.confirmScreenDetails(confirmScreenDetailsArrayDomestic);
                else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        confirmScreenDetails: confirmScreenDetailsArrayDomestic,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
            } else {
                self.international = data.demandDraftPayeeDTO;
                self.deliveryMode(self.international.demandDraftDeliveryDTO.deliveryMode);
                self.international.name = ko.observable(self.international.name);
                self.international.nickName = ko.observable(self.international.nickName);
                self.international.payAtCity = ko.observable(self.international.payAtCity);
                self.international.demandDraftDeliveryDTO.deliveryMode = self.deliveryMode();
                self.payeeAccessType = ko.utils.unwrapObservable(data.demandDraftPayeeDTO.payeeAccessType);
                self.selectedCountry(self.international.payAtCountry);
                self.getCountries();
                if (self.payeeData) {
                    self.payeeData.nickName = self.international.nickName;
                    self.payeeData.id = self.international.id;
                    self.payeeData.name = self.international.name;
                    self.payeeData.payeeType = "DEMANDDRAFT";
                    self.payeeData.demandDraftPayeeType = "INT";
                    self.payeeData.payAtCity = self.international.payAtCity;
                    self.payeeData.payAtCountry = self.international.payAtCountry;
                    self.selectedCountry(self.payeeData.payAtCountry);
                    self.getCountries();
                    self.payeeData.demandDraftDeliveryDTO = self.international.demandDraftDeliveryDTO;
                    self.payeeData.demandDraftDeliveryDTO.deliveryMode = self.international.demandDraftDeliveryDTO.deliveryMode;
                    self.setLimitClicked = ko.observable(false);
                    self.confirmPage = ko.observable(true);
                    self.setMonthlyLimitClicked = ko.observable(false);
                    self.payeeData.limitDetails = {
                        DAILY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        },
                        MONTHLY: {
                            isEffectiveFromTomorrow: false,
                            maxAmount: {
                                amount: ko.observable(),
                                currency: self.limitCurrency()
                            }
                        }
                    };
                }
                var confirmScreenDetailsArrayInternational = [
                    [
                        {
                            label: self.payments.payee.international.drafttype,
                            value: self.payments.payee.accinternational
                        },
                        {
                            label: self.payments.payee.international.draftfavouring,
                            value: self.international.nickName
                        }
                    ],
                    [
                        {
                            label: self.payments.payee.international.payableCountry,
                            value: self.international.payAtCountry
                        },
                        {
                            label: self.payments.payee.international.payableCity,
                            value: self.international.payAtCity
                        }
                    ]
                ];
                if (typeof self.confirmScreenDetails === "function")
                    self.confirmScreenDetails(confirmScreenDetailsArrayInternational);
                else if (self.confirmScreenExtensions) {
                    $.extend(self.confirmScreenExtensions, {
                        isSet: true,
                        confirmScreenDetails: confirmScreenDetailsArrayInternational,
                        confirmScreenMsgEval: self.getConfirmScreenMsg,
                        confirmScreenStatusEval: self.getConfirmScreenStatus,
                        template: "confirm-screen/payments-template"
                    });
                }
            }
        });
        self.getBranchDetails = function (branchCode) {
            DDPayeeModel.getBranchDetails(branchCode).done(function (data) {
                self.addressDetails.postalAddress = data.addressDTO[0].branchAddress.postalAddress;
                self.addressDetails.postalAddress.zipCode = self.addressDetails.postalAddress.postalCode;
                self.addressDetails.postalAddress.branchName = data.addressDTO[0].branchName;
                if (self.payeeData) {
                    self.payeeData.postalAddress = data.addressDTO[0].branchAddress.postalAddress;
                    self.payeeData.postalAddress.zipCode = self.payeeData.postalAddress && self.payeeData.postalAddress.postalCode ? self.payeeData.postalAddress.postalCode : "";
                    self.payeeData.postalAddress.branchName = data.addressDTO[0].branchName;
                }
                self.dataLoaded(true);
            });
        };
        self.getPartyAddress = function (addressType) {
            DDPayeeModel.getPartyAddress(addressType).done(function (data) {
                if (data.party) {
                    for (var i = 0; i < data.party.addresses.length; i++) {
                        if (data.party.addresses[i].type === addressType) {
                            self.addressDetails.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            if (self.payeeData) {
                                self.payeeData.postalAddress = data.party.addresses[i].postalAddress ? data.party.addresses[i].postalAddress : "";
                            }
                            break;
                        }
                    }
                }
                self.addressDetails.addressTypeDescription = self.payments.payee[addressType];
                self.addressDetails.postalAddress.zipCode = self.addressDetails.postalAddress.postalCode;
                if (self.payeeData) {
                    self.payeeData.addressTypeDescription = self.payments.payee[addressType];
                    self.payeeData.postalAddress.zipCode = self.payeeData.postalAddress && self.payeeData.postalAddress.postalCode ? self.payeeData.postalAddress.postalCode : "";
                }
                self.dataLoaded(true);
            });
        };
        self.getCountries = function () {
            DDPayeeModel.getCountries().done(function (data) {
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    if (self.selectedCountry() === data.enumRepresentations[0].data[i].code) {
                        self.selectedCountry(data.enumRepresentations[0].data[i].description);
                        break;
                    }
                }
                if(self.international.demandDraftDeliveryDTO.deliveryMode === "BRN")
                     self.getBranchDetails(self.international.demandDraftDeliveryDTO.branch);
                else if(self.international.demandDraftDeliveryDTO.deliveryMode === "MAI")
                    self.getPartyAddress(self.international.demandDraftDeliveryDTO.addressType);
                else
                    self.dataLoaded(true);
                if (self.payeeData) {
                    if(self.payeeData.demandDraftDeliveryDTO.deliveryMode === "BRN")
                        self.getBranchDetails(self.international.demandDraftDeliveryDTO.branch);
                    else if(self.payeeData.demandDraftDeliveryDTO.deliveryMode === "MAI")
                        self.getPartyAddress(self.international.demandDraftDeliveryDTO.addressType);
                    else
                        self.dataLoaded(true);
                }
            });
        };
    };
});