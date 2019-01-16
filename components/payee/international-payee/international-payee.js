define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/international-payee",
    "ojL10n!resources/nls/bank-account-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojvalidationgroup",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton"
], function (oj, ko, $, internationalPayeeModel, BaseLogger, ResourceBundle, commonPayee, Constants) {
    "use strict";
    return function (Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        self.international = ko.toJS(Params.model);
        self.validationTracker = Params.validator;
        self.resource = ResourceBundle;
        self.payments = commonPayee.payments;
        self.payments.payee.international = ResourceBundle.payments.payee.international;
        self.payeeDetails = ko.observable(self.international);
        self.internationalNetworkTypes = ko.observableArray();
        self.isNetworkTypesLoaded = ko.observable(false);
        self.networkTypesMap = {};
        self.groupValid = ko.observable();
        self.countries = ko.observableArray();
        self.countriesMap = {};
        self.isCountriesLoaded = ko.observable(false);
        self.refreshLookup(true);
        Params.baseModel.registerElement("bank-look-up");
        internationalPayeeModel.init("INTERNATIONAL");
        $.when(internationalPayeeModel.getNetworkTypes(), internationalPayeeModel.getCountries()).then(function (networkTypesResponse, countriesResponse) {
            for (var i = 0; i < networkTypesResponse.enumRepresentations[0].data.length; i++) {
                self.internationalNetworkTypes.push({
                    text: networkTypesResponse.enumRepresentations[0].data[i].description,
                    value: networkTypesResponse.enumRepresentations[0].data[i].code
                });
                self.networkTypesMap[networkTypesResponse.enumRepresentations[0].data[i].code] = networkTypesResponse.enumRepresentations[0].data[i].description;
                self.isNetworkTypesLoaded(true);
                self.isCountriesLoaded(true);
            }
            for (var j = 0; j < countriesResponse.enumRepresentations[0].data.length; j++) {
                self.countries.push({
                    text: countriesResponse.enumRepresentations[0].data[j].description,
                    value: countriesResponse.enumRepresentations[0].data[j].code
                });
                self.countriesMap[countriesResponse.enumRepresentations[0].data[j].code] = countriesResponse.enumRepresentations[0].data[j].description;
            }
            void(self.network() || self.network(networkTypesResponse.enumRepresentations[0].data[0].code));
            ko.tasks.runEarly();
            self.isNetworkTypesLoaded(true);
            self.isCountriesLoaded(true);
        });
        self.openLookup = function () {
            self.clearingCodeType = self.network();
            ko.tasks.runEarly();
            $("#menuButtonDialog").trigger("openModal");
        };
        self.validateInterCode = [{
            "validate": function (value) {
                if (value.length > 20 || !/^[a-zA-Z0-9]+$/.test(value)) {
                    throw new oj.ValidatorError("", oj.Translations.getTranslatedString(self.payments.payee.international.invalidError));
                }
            }
        }];
        self.verifyCode = function () {
            var tracker = document.getElementById("verify-swiftCode-tracker"),
            nccTracker = document.getElementById("verify-ncc-tracker");
            if ((tracker !== null && tracker.valid === "valid") || (nccTracker !== null && nccTracker.valid === "valid")) {
                if (self.network() === "SWI") {
                    internationalPayeeModel.getBankDetailsBIC(self.bankDetailsCode()).done(function (data) {
                        self.additionalBankDetails(data);
                    });
                } else if (self.network() === "NAC") {
                    internationalPayeeModel.getBankDetailsNCC(self.bankDetailsCode(), self.region()).done(function (data) {
                        self.additionalBankDetails(data);
                    });
                }
            }
        };
    };
});