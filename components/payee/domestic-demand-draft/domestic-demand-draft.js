define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",

    "ojL10n!resources/nls/demand-draft-payee",
    "ojL10n!resources/nls/domestic-demand-draft-payee",
    "framework/js/constants/constants",
    "ojs/ojknockout",
    "ojs/ojinputtext",
    "ojs/ojradioset",
    "ojs/ojbutton",
    "ojs/ojvalidationgroup"
], function(oj, ko, $, domesticPayeeModel, CommonPayee, domesticResourceBundle, Constants) {
    "use strict";
    return function(Params) {
        var self = this;
        ko.utils.extend(self, Params.rootModel);
        self.userSegment = Constants.userSegment;
        Params.baseModel.registerElement("address");
        self.domestic = Params.model;
        self.payeeAccessType = ko.utils.unwrapObservable(self.domestic.payeeAccessType);
        self.addressDetails = Params.addressDetails;
        self.validationTracker = Params.validator;
        self.domesticRegion = ko.observable();
        self.payments = CommonPayee.payments;
        self.common = CommonPayee.payments.common;
        self.payments.payee.domestic = domesticResourceBundle.payments.payee.domestic;
        self.isCitiesLoaded = ko.observable(false);
        self.isBranchesLoaded = ko.observable(true);
        self.isBranchAddressLoaded = ko.observable(false);
        self.cities = ko.observableArray();
        self.branches = ko.observableArray();
        self.branchAddress = ko.observable();
        self.remitterAddress = ko.observable();
        self.isRemitterAddressLoaded = ko.observable(false);
        self.selectedCity = ko.observable();
        self.selectedBranch = ko.observable();
        self.deliveryModeMap = {
            BRN: self.payments.payee.domestic.branch,
            MAI: self.payments.payee.domestic.postorcourier
        };
        self.mailModeMap = {
            REM: self.payments.payee.domestic.branch.mailtoremitter,
            BEN: self.payments.payee.domestic.branch.mailtobeneficiary
        };
        domesticPayeeModel.init();
        domesticPayeeModel.getCities().done(function(data) {
            for (var i = 0; i < data.cities.length; i++) {
                self.cities.push({
                    text: data.cities[i],
                    value: data.cities[i]
                });
            }
            self.isCitiesLoaded(true);
        });
        domesticPayeeModel.fetchBankConfiguration().done(function(data) {
            self.domesticRegion(data.bankConfigurationDTO.region);
        });
        self.getRemitterAddress = function() {
            domesticPayeeModel.init();
            domesticPayeeModel.getRemitterAddress().done(function(data) {
                for (var i in data.partyAddressDTO) {
                    if (data.partyAddressDTO[i].type === "PST") {
                        var address = "";
                        for (var key in data.partyAddressDTO[i].postalAddress) {
                            if (key.indexOf("line") === 0) {
                                address += data.partyAddressDTO[i].postalAddress[key] + ", ";
                            }
                        }
                        self.remitterAddress({
                            address: address,
                            city: data.partyAddressDTO[i].postalAddress.city === undefined ? "" : data.partyAddressDTO[i].postalAddress.city,
                            country: data.partyAddressDTO[i].postalAddress.country
                        });
                        break;
                    }
                }
                self.isRemitterAddressLoaded(true);
            });
        };
        self.onCityChanged = function(event) {
            if (event.detail.value) {
                domesticPayeeModel.init(self.selectedCity() + "");
                domesticPayeeModel.getBranches().done(function(data) {
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
                domesticPayeeModel.init("", self.domestic.demandDraftDeliveryDTO.branch() + "");
                domesticPayeeModel.getBranchAddress().done(function(data) {
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
    };
});