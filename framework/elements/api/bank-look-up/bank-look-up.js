define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/bank-lookup",
    "ojs/ojbutton",
    "ojs/ojdialog",
    "ojs/ojtable",
    "ojs/ojselectcombobox",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojarraydataprovider",
    "ojs/ojlistview"
], function(oj, ko, $, BankLookUpModel, locale) {
    "use strict";
    return function(rootParams) {
        var self = this;
        self.clearingCodeType = rootParams.clearingCodeType;
        self.accountType = rootParams.accountType ? rootParams.accountType.toUpperCase() : null;
        self.additionalBankDetails = rootParams.additionalBankDetails;
        self.networkCode = rootParams.networkCode;
        self.region = rootParams.region;
        self.clearingCode = ko.observable();
        self.nls = locale;
        self.nccTypes = ko.observableArray();
        self.nccCodeType = ko.observable();
        self.country = ko.observable();
        self.city = ko.observable();
        self.nccTypeLoaded = ko.observable(false);
        self.state = ko.observable();
        self.bankName = ko.observable();
        self.lookUpData = ko.observable(new oj.ArrayDataProvider([]));
        self.lookUpDataLoaded = ko.observable(false);
        self.header = ko.observable();
        self.clearingCodeLabel = ko.observable();
        self.countriesLoaded = ko.observable(false);
        self.countriesList = ko.observableArray();
        rootParams.baseModel.registerElement("modal-window");
        var value = [];

        function areAllFieldsEmpty() {
            return !value.toString().replace(/,/g, "").trim();
        }

        function perform(operation) {
            var ids = ["clearingCode", "bankName", "city", "state", "country", "ncctype"];
            for (var i = 0; i < ids.length; i++) {
                var element = document.getElementById(ids[i]);
                if (element) {
                    element.required = operation === "validate" && areAllFieldsEmpty();
                    element[operation]();
                }
            }
        }

        self.resetLookUp = function(resetErrors) {
            self.clearingCode(null);
            self.bankName(null);
            self.city(null);
            self.nccCodeType(null);
            self.country("");
            self.state(null);
            self.lookUpDataLoaded(false);
            self.lookUpData(null);
            value = [];
            if (resetErrors) {
                perform("reset");
            }
        };

        function setHeader() {
            if (self.clearingCodeType() === "IFSC" || self.clearingCodeType() === "NEFT" || self.clearingCodeType() === "RTGS" || self.clearingCodeType() === "IMPS") {
                self.header(self.nls.searchIfsc);
                self.clearingCodeLabel(self.nls.ifscCode);
            } else if (self.clearingCodeType() === "SWI" && self.region !== "SEPA") {
                self.header(self.nls.searchSwift);
                self.clearingCodeLabel(self.nls.swiftCode);
            } else if (self.clearingCodeType() === "SWI" && self.region === "SEPA") {
                self.header(self.nls.searchBic);
                self.clearingCodeLabel(self.nls.bicCode);
            } else if (self.clearingCodeType() === "NAC" && self.region !== "UK" && self.region !== "SEPA") {
                self.header(self.nls.searchNCC);
                self.clearingCodeLabel(self.nls.ncc);
            } else if (self.clearingCodeType() === "NAC" && self.region === "UK") {
                self.header(self.nls.searchSort);
                self.clearingCodeLabel(self.nls.sortCode);
            }
        }

        function clearingCodeTypeSubscribe(val, keepErrors) {
            if (val === "NAC") {
                BankLookUpModel.fetchNCCType().done(function(data) {
                    self.nccTypeLoaded(false);
                    self.nccTypes.removeAll();
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.nccTypes.push({
                            text: data.enumRepresentations[0].data[i].description,
                            value: data.enumRepresentations[0].data[i].code
                        });
                    }
                    self.nccTypeLoaded(true);
                });
            } else if (val === "SWI" && !self.countriesLoaded()) {
                BankLookUpModel.fetchCountries().done(function(data) {
                    self.countriesList.removeAll();
                    for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        self.countriesList.push({
                            text: data.enumRepresentations[0].data[i].description,
                            value: data.enumRepresentations[0].data[i].code
                        });
                    }
                    self.countriesLoaded(true);
                });
            }
            setHeader();
            self.additionalBankDetails(null);
            self.resetLookUp(!keepErrors);
        }
        clearingCodeTypeSubscribe(self.clearingCodeType(), true);
        var clearingCode = self.clearingCodeType.subscribe(clearingCodeTypeSubscribe);

        self.valueChangeHandler = function(index, event) {
            if (event.detail.originalEvent) {
                value[index] = event.detail.value;
                perform("validate");
            }
        };

        function getLookupURL() {
            var masterUrl = "financialInstitution/{codeDetailType}?financialInstitutionCode={code}&financialInstitutionName={bankName}&city={city}&financialInstitutionNameSearch={nameSearchType}&country={country}&financialInstitutionCodeType={codeType}&financialInstitutionCodeSearchType={codeSearchType}&state={state}&network={network}";
            switch (self.clearingCodeType()) {
                case "SWI":
                    return rootParams.baseModel.format(masterUrl, {
                        codeDetailType: "bicCodeDetails",
                        code: self.clearingCode(),
                        bankName: self.bankName(),
                        city: self.city(),
                        country: self.country(),
                        nameSearchType: "C",
                        codeType: null,
                        codeSearchType: null,
                        state: null,
                        network: null
                    });
                case "NAC":
                    return rootParams.baseModel.format(masterUrl, {
                        codeDetailType: "nationalClearingDetails",
                        code: self.clearingCode(),
                        bankName: self.bankName(),
                        city: self.city(),
                        country: self.country(),
                        nameSearchType: "C",
                        codeType: self.nccCodeType(),
                        codeSearchType: null,
                        state: null,
                        network: null
                    });
                case "NEFT":
                case "RTGS":
                case "IMPS":
                    return rootParams.baseModel.format(masterUrl, {
                        codeDetailType: "domesticClearingDetails",
                        code: self.clearingCode(),
                        bankName: self.bankName(),
                        city: self.city(),
                        country: null,
                        nameSearchType: "S",
                        codeType: null,
                        codeSearchType: "S",
                        state: self.state(),
                        network: self.clearingCodeType()
                    });
                case "IFSC":
                    return rootParams.baseModel.format(masterUrl, {
                        codeDetailType: "domesticClearingDetails",
                        code: self.clearingCode(),
                        bankName: self.bankName(),
                        city: self.city(),
                        country: null,
                        nameSearchType: "S",
                        codeType: null,
                        codeSearchType: "S",
                        state: self.state(),
                        network: "NEFT&network=RTGS&network=IMPS"
                    });
            }
        }

        self.search = function() {
            perform("validate");
            if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("bank-look-up-validation-tracker"))) {
                return;
            }
            BankLookUpModel.fetchDetails(getLookupURL()).done(function(data) {
                self.lookUpData(new oj.ArrayDataProvider(data.listFinancialInstitution));
                self.lookUpDataLoaded(true);
            }).fail(function() {
                self.lookUpDataLoaded(false);
                self.lookUpData(null);
            });
        };
        self.bankCodeSubmit = function(data) {
            self.networkCode(data.code);
            self.additionalBankDetails(data);
            $("#menuButtonDialog").hide();
            self.resetLookUp();
        };
        self.fromObjectToArray = function(obj) {
            var array = [];
            $.each(obj, function(key, value) {
                if (value) {
                    array.push(value);
                }
            });
            return array;
        };
        self.dispose = function() {
            clearingCode.dispose();
        };
    };
});