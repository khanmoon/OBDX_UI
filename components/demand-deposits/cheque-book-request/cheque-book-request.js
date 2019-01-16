define([
    "knockout",
    "jquery",
    "./model",

    "framework/js/constants/constants",
    "ojL10n!resources/nls/cheque-book-request",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup"
], function (ko, $, demandDepositChequeRequestModel, Constants, locale) {
    "use strict";
    return function (rootParams) {
        var self = this;
        self.chequeBookRequestLocale = locale;
        self.common = locale.common;
        self.constants = Constants;
        self.accountNumber = ko.observable();
        self.accountAdditionalDetails = ko.observable();
        self.validRequest = ko.observable();
        var confirmScreenExtensions = {};
        var getNewKoModel = function () {
            var KoModel = demandDepositChequeRequestModel.getNewModel();
            return ko.mapping.fromJS(KoModel);
        };
        self.modelInstance = rootParams.rootModel.previousState ? rootParams.rootModel.previousState.data : getNewKoModel();
        self.reviewData = self.modelInstance.chequeBookDetails;
        self.addressDetails = self.modelInstance.addressDetails;
        self.chequeBookTypeArray = ko.observableArray();
        self.chequeBookType = ko.observable();
        self.chequBookTypeLoaded = ko.observable(false);
        ko.utils.extend(self, rootParams.rootModel);
        if (self.params.id) {
            self.accountNumber(self.params.id.value);
        }
        self.numberOfLeavesOptions = ko.observableArray([{
                "number": "10",
                "value": "10",
                "label": rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    "leavesCount": 10
                })
            },
            {
                "number": "25",
                "value": "25",
                "label": rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    "leavesCount": 25
                })
            },
            {
                "number": "50",
                "value": "50",
                "label": rootParams.baseModel.format(self.chequeBookRequestLocale.chequeBookRequest.chequeBookLeaveOption, {
                    "leavesCount": 50
                })
            }
        ]);
        rootParams.baseModel.registerComponent("account-nickname", "accounts");
        rootParams.baseModel.registerElement("confirm-screen");
        rootParams.baseModel.registerComponent("review-cheque-book-request", "demand-deposits");
        rootParams.baseModel.registerElement("address");
        rootParams.baseModel.registerComponent("responsive-select", "inputs");
        rootParams.baseModel.registerElement("account-input");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.dashboard.headerName(self.chequeBookRequestLocale.compName.compName);
        self.chequeBookType.subscribe(function (data) {
            var cheqbookTypeValue = data.split("-");
            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockCode(cheqbookTypeValue[0]);
            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockCurrency(cheqbookTypeValue[1]);
            self.modelInstance.chequeBookDetails.chequeBookTypeList()[0].stockDescription(cheqbookTypeValue[2]);
        });
        self.callChequeBookType = function () {
            demandDepositChequeRequestModel.fetchChequeBookType(self.accountNumber()).done(function (data) {
                self.chequBookTypeLoaded(false);
                self.chequeBookTypeArray.removeAll();
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.chequeBookTypeArray.push({
                        label: data.enumRepresentations[0].data[i].description,
                        description: data.enumRepresentations[0].data[i].stockDescription,
                        currency: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code + "-" + data.enumRepresentations[0].data[i].description + "-" + data.enumRepresentations[0].data[i].description
                    });
                }
                self.chequBookTypeLoaded(true);
            });
        };
        if (self.constants.userSegment !== "CORP" || self.accountNumber()) {
            self.callChequeBookType();
        }
        self.accountNumber.subscribe(function () {
            self.callChequeBookType();
        });
        self.review = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("requestChequeBook"))) {
                return;
            }

            self.modelInstance.chequeBookDetails.accountId = self.accountAdditionalDetails().account.id;
            rootParams.dashboard.loadComponent("review-cheque-book-request", {
                mode: "review",
                data: self.modelInstance,
                confirmScreenExtensions: confirmScreenExtensions
            }, self);
        };
        self.chequeBookRequest = function () {
            self.modelInstance.chequeBookDetails.currency(self.accountAdditionalDetails().account.currencyCode);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.addressType(self.addressDetails.addressType());
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.branchCode(self.addressDetails.postalAddress.branch);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.deliveryOption(self.addressDetails.modeofDelivery());
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.line1(self.addressDetails.postalAddress.line1);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.line1(self.addressDetails.postalAddress.line1);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.line2(self.addressDetails.postalAddress.line2);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.line3(self.addressDetails.postalAddress.line3);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.line4(self.addressDetails.postalAddress.line4);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.city(self.addressDetails.postalAddress.city);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.state(self.addressDetails.postalAddress.state);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.country(self.addressDetails.postalAddress.country);
            self.modelInstance.chequeBookDetails.chequeDeliveryDetailsDTO.address.zipCode(self.addressDetails.postalAddress.zipCode);
            demandDepositChequeRequestModel.requestChequeBook(self.accountNumber(), ko.mapping.toJSON(self.modelInstance.chequeBookDetails, {
                ignore: ["accountId"]
            })).done(function (data, status, jqXhr) {
                rootParams.dashboard.loadComponent("confirm-screen", {
                    jqXHR: jqXhr,
                    transactionName: self.chequeBookRequestLocale.compName.compName,
                    eReceiptRequired: true,
                    hostReferenceNumber: data.chequeBookDetails ? data.chequeBookDetails.chequeBookRequestRefNo : null,
                    confirmScreenExtensions: confirmScreenExtensions,
                    template: "confirm-screen/casa-template"
                }, self);
            });
        };
        self.accountsParser = function (data) {
            var tempData = data;
            if (tempData.accounts) {
                var filteredAccounts = tempData.accounts.filter(function (account) {
                    return account.productDTO.demandDepositProductFacilitiesDTO.hasChequeBookFacility;
                });
                tempData.accounts = filteredAccounts;
            }
            return tempData;
        };
    };
});
