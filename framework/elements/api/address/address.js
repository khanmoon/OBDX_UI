define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",
    "ojL10n!resources/nls/address",
    "ojs/ojinputtext",
    "ojs/ojknockout",
    "ojs/ojselectcombobox",
    "ojs/ojinputtext",
    "ojs/ojinputnumber",
    "ojs/ojradioset",
    "ojs/ojcheckboxset",
    "ojs/ojdatetimepicker",
    "ojs/ojswitch",
    "ojs/ojknockout-validation"
], function (oj, ko, $, CourierAddressModel, BaseLogger, locale) {
    "use strict";
    return function (Params) {
        var self = this,
            i;
        self.address = Params.address;
        self.locale = locale;
        self.fetchBranchesIsRunning = false;
        self.isDataLoaded = ko.observable(true);
        self.isChecked = ko.observable(false);
        self.countryLoaded = ko.observable(false);
        self.stateLoaded = ko.observable(false);
        self.cityLoaded = self.cityLoaded || ko.observable(false);
        self.branchLoaded = ko.observable(false);
        self.addressLoaded = ko.observable(false);
        self.addressMaintained = ko.observable(false);
        self.defaultModeOfDelivery = ko.observable(true);
        self.cityRefreshed = ko.observable(true);
        self.isAddressVisible = ko.observable(false);
        self.validationTracker = Params.validator;
        self.PartyId = Params.partyId;
        self.key = ko.observable("0");
        self.selectedRelationShip = ko.observable();
        self.URL = ko.observable();
        self.serviceRequestNumber = ko.observable();
        self.selectedCity = ko.observable(self.address.postalAddress ? ko.utils.unwrapObservable(self.address.postalAddress.city) : null);
        self.selectedBranch = ko.observable((self.address.postalAddress && ko.utils.unwrapObservable(self.address.postalAddress.branch)) ? ko.utils.unwrapObservable(self.address.postalAddress.branch) + "/" + ko.utils.unwrapObservable(self.address.postalAddress.branchName) : null);
        self.modofdelivery = ko.observable(self.address ? self.address.modeofdelivery : null);
        self.addressType = ko.observable(self.address ? self.address.addressType() + "/" + self.address.addressTypeDescription() : null).extend({
            notify: "always"
        });
        self.selectedCountry = ko.observable();
        self.selectedState = ko.observable();
        self.selectedPartyRelation = ko.observable();
        self.LocalityArray = ko.observableArray([]);
        self.typeOfAddress = ko.observableArray();
        self.country = ko.observableArray();
        self.state = ko.observableArray();
        self.city = ko.observableArray();
        self.branch = ko.observableArray();
        self.courierAddArray = ko.observableArray();
        self.courierAddressLoaded = ko.observable(false);
        self.userAddressArray = ko.observableArray([]);
        self.addresstoShow = ko.observable();
        self.partyRelationship = ko.observableArray([]);
        self.postalAddress = ko.observable({});
        self.addressMap = ko.observable({});
        Params.baseModel.registerComponent("responsive-select", "inputs");
        self.deliverAtArray = [{
                id: "BRN",
                label: self.locale.address.branch
            },
            {
                id: "ACC",
                label: self.locale.address.address
            }
        ];

        var modofdeliverySubscription = self.modofdelivery.subscribe(function (newValue) {
            if (newValue === "ACC") {
                self.defaultModeOfDelivery(true);
                self.addressMap({});
                self.addresstoShow(null);
                self.fetchCourierAddress();
                self.cityLoaded(false);
                self.branchLoaded(false);
                self.addressLoaded(false);
                self.branchAddressLoaded(false);
            } else if (newValue === "BRN") {
                self.defaultModeOfDelivery(false);
                self.addressLoaded(false);
                CourierAddressModel.fetchCity("all").done(function (data) {
                    self.city.removeAll();
                    for (i = 0; i < data.cities.length; i++) {
                        self.city.push({
                            code: data.cities[i],
                            description: data.cities[i],
                            value: data.cities[i],
                            label: data.cities[i]
                        });
                    }
                    if (!self.fetchBranchesIsRunning) {
                        self.fetchBranches(self.selectedCity() || self.city()[0].code);
                    }
                    self.cityLoaded(true);
                });
            }
            self.isAddressVisible(false);
            self.address.modeofdelivery = newValue;
        });
        self.fetchCourierAddress = function () {
            self.addressLoaded(false);
            CourierAddressModel.fetchCourierAddress().done(function (data) {
                var i;
                var addresses = data.party.addresses;
                for (i = 0; i < addresses.length; i++) {
                    self.addresstoShow({
                        postalAddress: addresses[i].postalAddress,
                        line1: addresses[i].postalAddress.line1 ? addresses[i].postalAddress.line1 : "",
                        line2: addresses[i].postalAddress.line2 ? addresses[i].postalAddress.line2 : "",
                        line3: addresses[i].postalAddress.line3 ? addresses[i].postalAddress.line3 : "",
                        line4: addresses[i].postalAddress.line4 ? addresses[i].postalAddress.line4 : "",
                        line5: addresses[i].postalAddress.line5 ? addresses[i].postalAddress.line5 : "",
                        line6: addresses[i].postalAddress.line6 ? addresses[i].postalAddress.line6 : "",
                        line7: addresses[i].postalAddress.line7 ? addresses[i].postalAddress.line7 : "",
                        line8: addresses[i].postalAddress.line8 ? addresses[i].postalAddress.line8 : "",
                        line9: addresses[i].postalAddress.line9 ? addresses[i].postalAddress.line9 : "",
                        line10: addresses[i].postalAddress.line10 ? addresses[i].postalAddress.line10 : "",
                        line11: addresses[i].postalAddress.line11 ? addresses[i].postalAddress.line11 : "",
                        line12: addresses[i].postalAddress.line12 ? addresses[i].postalAddress.line12 : "",
                        city: addresses[i].postalAddress.city ? addresses[i].postalAddress.city : "",
                        state: addresses[i].postalAddress.state ? addresses[i].postalAddress.state : "",
                        country: addresses[i].postalAddress.country ? addresses[i].postalAddress.country : "",
                        zipCode: addresses[i].postalAddress.postalCode ? addresses[i].postalAddress.postalCode : "",
                        branch: "",
                        branchName: ""
                    });
                    self.addressMap()[addresses[i].type] = self.addresstoShow();
                }
                self.addressMaintained(true);
                CourierAddressModel.fetchAddressType().done(function (data) {
                    self.typeOfAddress.removeAll();
                    for (i = 0; i < data.enumRepresentations[0].data.length; i++) {
                        if (self.addressMap()[data.enumRepresentations[0].data[i].code]) {
                            if (self.addressMap()[data.enumRepresentations[0].data[i].code].postalAddress.line1) {
                                self.typeOfAddress.push({
                                    code: data.enumRepresentations[0].data[i].code,
                                    description: data.enumRepresentations[0].data[i].description,
                                    value: data.enumRepresentations[0].data[i].code,
                                    label: data.enumRepresentations[0].data[i].description
                                });
                            }
                        }
                    }
                    if (!self.addressType()) {
                        self.addressType(self.typeOfAddress()[0].code + "/" + self.typeOfAddress()[0].description);
                    }
                    self.addressType.valueHasMutated();
                    self.addressLoaded(true);
                    self.courierAddressLoaded(true);
                });
            });
        };
        self.branchAddressLoaded = ko.observable(false);
        self.fetchAddress = function (selectedBranchArray) {
            CourierAddressModel.fetchAddress(selectedBranchArray[0]).done(function (data) {
                self.addressLoaded(false);
                self.addresstoShow(data.addressDTO[0].branchAddress.postalAddress);
                self.addresstoShow({
                    line1: self.addresstoShow().line1 ? self.addresstoShow().line1 : "",
                    line2: self.addresstoShow().line2 ? self.addresstoShow().line2 : "",
                    line3: self.addresstoShow().line3 ? self.addresstoShow().line3 : "",
                    line4: self.addresstoShow().line4 ? self.addresstoShow().line4 : "",
                    line5: self.addresstoShow().line5 ? self.addresstoShow().line5 : "",
                    line6: self.addresstoShow().line6 ? self.addresstoShow().line6 : "",
                    line7: self.addresstoShow().line7 ? self.addresstoShow().line7 : "",
                    line8: self.addresstoShow().line8 ? self.addresstoShow().line8 : "",
                    line9: self.addresstoShow().line9 ? self.addresstoShow().line9 : "",
                    line10: self.addresstoShow().line10 ? self.addresstoShow().line10 : "",
                    line11: self.addresstoShow().line11 ? self.addresstoShow().line11 : "",
                    line12: self.addresstoShow().line12 ? self.addresstoShow().line12 : "",
                    city: self.addresstoShow().city ? self.addresstoShow().city : "",
                    state: self.addresstoShow().state ? self.addresstoShow().state : "",
                    country: self.addresstoShow().country ? self.addresstoShow().country : "",
                    zipCode: self.addresstoShow().postalCode ? self.addresstoShow().postalCode : "",
                    branch: selectedBranchArray[0] ? selectedBranchArray[0] : "",
                    branchName: selectedBranchArray[1] ? selectedBranchArray[1] : ""
                });
                self.address.modeofDelivery(self.modofdelivery());
                self.address.addressType("");
                self.address.addressTypeDescription("");
                self.address.postalAddress = self.addresstoShow();
                if (self.modofdelivery() === "ACC") {
                    self.addressLoaded(true);
                    self.branchAddressLoaded(false);
                } else {
                    self.branchAddressLoaded(true);
                    self.addressLoaded(false);
                }
            });
        };
        self.fetchBranches = function (selectedCity) {
            if (selectedCity !== "" && selectedCity !== null) {
                self.fetchBranchesIsRunning = true;
                CourierAddressModel.fetchBranches("all", selectedCity).done(function (data) {
                    self.cityRefreshed(false);
                    self.branchAddressLoaded(false);
                    self.branch.removeAll();
                    ko.tasks.runEarly();
                    for (i = 0; i < data.branchAddressDTO.length; i++) {
                        self.branch.push({
                            code: data.branchAddressDTO[i].id,
                            description: data.branchAddressDTO[i].branchName,
                            label: data.branchAddressDTO[i].branchName,
                            value: data.branchAddressDTO[i].id + "/" + data.branchAddressDTO[i].branchName
                        });
                    }
                    self.fetchAddress((self.selectedBranch() && self.selectedBranch() !== "/") ? self.selectedBranch().split("/") : [self.branch()[0].code, self.branch()[0].description]);
                    self.cityRefreshed(true);
                    self.branchLoaded(true);
                    ko.tasks.runEarly();
                    self.fetchBranchesIsRunning = false;
                });
            }
        };
        self.countryChangeHandler = function (event, data) {
            if (data.option === "value") {
                self.address.country = Params.baseModel.getDropDownValue(self.selectedCountry());
                CourierAddressModel.fetchCity(Params.baseModel.getDropDownValue(self.selectedCountry())).done(function (data) {
                    for (i = 0; i < data.cities.length; i++) {
                        self.city.push({
                            code: data.cities[i],
                            description: data.cities[i]
                        });
                    }
                    self.cityLoaded(true);
                });
            }
        };
        var selectedCitySubscription = self.selectedCity.subscribe(function (value) {
            if (value) {
                self.branchAddressLoaded(false);
                self.fetchBranches(value);
                self.addressLoaded(false);
            }
        });
        var selectedBranchSubscription = self.selectedBranch.subscribe(function (selectedBranchArray) {
            self.branchAddressLoaded(false);
            self.fetchAddress(selectedBranchArray.split("/"));
        });
        self.selectedAddressType = ko.observable();
        var selectedAddressTypeSubscription = self.addressType.subscribe(function (newValue) {
            if (newValue && self.modofdelivery() === "ACC") {
                self.selectedAddressType(newValue.split("/")[0]);
                self.addressLoaded(false);
                self.address.modeofDelivery(self.modofdelivery());
                self.address.addressType(self.selectedAddressType());
                self.address.addressTypeDescription(newValue.split("/")[1]);
                self.address.postalAddress = self.addressMap()[self.selectedAddressType()];
                self.postalAddress(self.addressMap()[self.selectedAddressType()].postalAddress);
                self.addressLoaded(true);
                self.validateAddress();
            }
        });
        self.validateAddress = function () {
            var addType = oj.Components.getWidgetConstructor($("#addressType"));
            if (typeof addType === "function") {
                addType("validate");
            }
        };
        if (!self.modofdelivery()) self.modofdelivery("BRN");
        self.modofdelivery.valueHasMutated();
        self.dispose = function () {
            selectedCitySubscription.dispose();
            selectedBranchSubscription.dispose();
            selectedAddressTypeSubscription.dispose();
            modofdeliverySubscription.dispose();
        };
    };
});
