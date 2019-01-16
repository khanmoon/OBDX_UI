define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "framework/js/constants/constants",

    "ojL10n!lzn/gamma/resources/nls/address"
], function (oj, ko, $, AddressService, Constants, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.id = rootParams.id;
        self.postalAddress = rootParams.addressModel;
        self.disableInputs = ko.observable(rootParams.disableInputs);
        self.addressValues = rootParams.addressValues;
        self.validator = rootParams.validator;
        self.statesChanged = ko.observable(false);
        self.countryDataLoaded = ko.observable(false);
        self.countryOptions = ko.observable([]);
        self.stateOptions = ko.observable([]);
        self.successHandlerState = function (data) {
            self.stateOptions(data.enumRepresentations[0].data);
            self.statesChanged(true);
            self.addressValues.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), self.postalAddress.state);
        };
        if (self.postalAddress.country.length > 0 && typeof self.postalAddress.country === "string") {
            self.statesChanged(false);
            AddressService.fetchStates(self.postalAddress.country, self.successHandlerState);
        }
        self.updateState = function (event, data) {
            if (data.option === "value") {
                self.addressValues.state = rootParams.baseModel.getDescriptionFromCode(self.stateOptions(), data.value[0]);
            }
        };
        self.countryChangeHandler = function (event) {
            if (event.detail.value) {
                self.statesChanged(false);
                AddressService.fetchStates(event.detail.value, self.successHandlerState);
            }
        };
        self.successHandlerCountry = function (data) {
            self.countryOptions(data.enumRepresentations[0].data);
            self.countryDataLoaded(true);
        };
    };
});
