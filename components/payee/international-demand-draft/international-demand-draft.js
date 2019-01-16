define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/demand-draft-payee",
    "ojL10n!resources/nls/international-demand-draft-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, internationalPayeeModel, CommonPayee, internationalResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        Params.baseModel.registerElement("address");
        self.international = Params.model;
        self.payeeAccessType = ko.utils.unwrapObservable(self.international.payeeAccessType);
        self.validationTracker = Params.validator;
        self.countries = ko.observableArray();
        self.isCountriesLoaded = ko.observable(false);
        self.countriesMap = {};
        self.payments = CommonPayee.payments;
        self.common = CommonPayee.payments.common;
        self.payments.payee.international = internationalResourceBundle.payments.payee.international;
        self.isBranchAddressLoaded = ko.observable(false);
        self.isCitiesLoaded = ko.observable(false);
        self.cities = ko.observableArray();
        self.branches = ko.observableArray();
        self.branchAddress = ko.observable();
        self.postOrCourierAddress = ko.observable();
        self.isPostOrCourierAddressLoaded = ko.observable(false);
        self.selectedCity = ko.observable();
        self.selectedBranch = ko.observable();
        self.isBranchesLoaded = ko.observable(false);
        self.isBranchAddressLoaded = ko.observable(false);
        self.addressDetails = Params.addressDetails;
        internationalPayeeModel.init();
        self.deliveryModeMap = {
            BRN: self.payments.payee.international.branch,
            MAI: self.payments.payee.international.postorcourier
        };
        self.getCities = function() {
            internationalPayeeModel.init();
            internationalPayeeModel.getCities().done(function(data) {
                self.isCitiesLoaded(false);
                self.cities.removeAll();
                for (var i in data.cities) {
                    if (i !== null) {
                        self.cities.push({
                            text: data.cities[i],
                            value: data.cities[i]
                        });
                    }
                }
                self.isCitiesLoaded(true);
            });
        };
        self.getCountries = function() {
            internationalPayeeModel.init();
            internationalPayeeModel.getCountries().done(function(data) {
                self.isCountriesLoaded(false);
                self.countries.removeAll();
                for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
                    self.countries.push({
                        text: data.enumRepresentations[0].data[i].description,
                        value: data.enumRepresentations[0].data[i].code
                    });
                    self.countriesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
                }
                self.isCountriesLoaded(true);
            });
        };
        self.getCountries();
        self.getSelectedCountry = function(event) {
            for (var i = 0; i < self.countries().length; i++) {
                if (event.detail.value === self.countries()[i].value) {
                    self.selectedCountry(self.countries()[i].text);
                    break;
                }
            }
        };
        self.onCityChanged = function(event) {
            if (event.detail.value) {
                internationalPayeeModel.init(self.selectedCity() + "");
                internationalPayeeModel.getBranches().done(function(data) {
                    self.isBranchesLoaded(false);
                    self.branches.removeAll();
                    for (var i = 0; i < data.branchAddressDTO.length; i++) {
                        self.branches.push({
                            text: data.branchAddressDTO[i].branchName,
                            value: data.branchAddressDTO[i].id
                        });
                    }
                    self.isBranchesLoaded(true);
                });
            }
        };
        self.onBranchChanged = function(event) {
            if (event.detail.value) {
                internationalPayeeModel.init("", self.international.demandDraftDeliveryDTO.branch() + "");
                internationalPayeeModel.getBranchAddress().done(function(data) {
                    self.isBranchAddressLoaded(false);
                    var address = "";
                    for (var key in data.addressDTO[0].branchAddress.postalAddress) {
                        if (key.indexOf("line") === 0) {
                            address += data.addressDTO[0].branchAddress.postalAddress[key] + ", ";
                        }
                    }
                    self.branchAddress({
                        address: address,
                        city: data.addressDTO[0].branchAddress.postalAddress.city,
                        country: data.addressDTO[0].branchAddress.postalAddress.country
                    });
                    self.isBranchAddressLoaded(true);
                });
            }
        };
        self.getPostOrCourierAddress = function() {
            internationalPayeeModel.init();
            internationalPayeeModel.getPostOrCourierAddress().done(function(data) {
                for (var i in data.partyAddressDTO) {
                    if (data.partyAddressDTO[i].type === "PST") {
                        var address = "";
                        for (var key in data.partyAddressDTO[i].postalAddress) {
                            if (key.indexOf("line") === 0) {
                                address += data.partyAddressDTO[i].postalAddress[key] + ", ";
                            }
                        }
                        self.postOrCourierAddress({
                            address: address,
                            city: data.partyAddressDTO[i].postalAddress.city === undefined ? "" : data.partyAddressDTO[i].postalAddress.city,
                            country: data.partyAddressDTO[i].postalAddress.country
                        });
                        break;
                    }
                }
                self.isPostOrCourierAddressLoaded(true);
            });
        };
    };
});