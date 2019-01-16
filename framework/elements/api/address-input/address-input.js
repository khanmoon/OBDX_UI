define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",
    "ojL10n!resources/nls/address"
], function (oj, ko, $, AddressService, Constants, locale) {
    "use strict";
    return function (Params) {
        var self = this;
        self.locale = locale;
        self.id = Params.id ? Params.id : 1;
        self.postalAddress = Params.addressModel;
        self.disableInputs = ko.observable(Params.disableInputs);
        self.validator = Params.validator;
        self.statesChanged = ko.observable(false);
        self.countryDataLoaded = ko.observable(false);
        self.countryOptions = ko.observable([]);
        self.stateOptions = ko.observable([]);
        self.hideState = !!(Params.rootModel.hideState && Params.rootModel.hideState);
        self.successHandlerState = function (data) {
            if (data.enumRepresentations) {
                self.stateOptions(data.enumRepresentations[0].data);
                self.statesChanged(true);
            }
        };
        if (self.postalAddress.country.length > 0 && typeof self.postalAddress.country === "string") {
            self.statesChanged(false);
            AddressService.fetchStates(self.postalAddress.country, self.successHandlerState);
        }
        self.countryChangeHandler = function (event) {
            if (event.detail.value) {
                self.postalAddress.country = Params.baseModel.getDropDownValue(self.postalAddress.country);
                if (Params.selectedCountry) {
                    Params.selectedCountry(Params.baseModel.getDescriptionFromCode(self.countryOptions(), self.postalAddress.country));
                }
                self.statesChanged(false);
                self.postalAddress.state = "";
                AddressService.fetchStates(event.detail.value, self.successHandlerState);
            }
        };
        self.successHandlerCountry = function (data) {
            self.countryOptions(data.enumRepresentations[0].data);
            self.countryDataLoaded(true);
        };
        AddressService.fetchCountryList(self.successHandlerCountry);
    };
});