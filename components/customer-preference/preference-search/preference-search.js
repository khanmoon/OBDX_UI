define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/customer-preference",
    "ojs/ojvalidation",
    "ojs/ojradioset",
    "ojs/ojknockout-validation",
    "ojs/ojinputtext"
], function (oj, ko, $, PreferenceFunctionsModel, BaseLogger, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var getNewKoModel = function () {
                var KoModel = PreferenceFunctionsModel.getNewModel();
                return ko.mapping.fromJS(KoModel);
            }, self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.resource = resourceBundle;
        self.showMenu = ko.observable(false);
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        self.isCorpAdmin = ko.observable();
        self.rootModelInstance = ko.observable(getNewKoModel());
        self.rootModelInstance().partyDetails.party.value(self.partyID());
        var partyId = {};
        self.isBankAdmin = ko.observable(false);
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        partyId.displayValue = rootParams.dashboard.userData.userProfile.partyId.displayValue;
        var userProfile = {};
        userProfile.firstName = rootParams.dashboard.userData.userProfile.firstName;
        self.searchCustPreferenceForPartyID = function () {
            if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
                return;
            }
            self.selectedUserLimit(null);
            self.selectedCCL(null);
            self.gracePeriod(null);
            self.previousSelectedUserLimit(null);
            self.previousSelectedPartyLimit(null);
            PreferenceFunctionsModel.fetchPreferenceForParty(self.partyID()).done(function (data) {
                if (data.partyPreferencesDTOs) {
                    self.parames = data.partyPreferencesDTOs;
                    if (data.partyPreferencesDTOs.addresses) {
                        self.addressData.postalAddress.city = data.partyPreferencesDTOs.addresses[0].postalAddress.city;
                        self.addressData.postalAddress.state = data.partyPreferencesDTOs.addresses[0].postalAddress.state;
                        self.addressData.postalAddress.country = data.partyPreferencesDTOs.addresses[0].postalAddress.country;
                        self.addressData.postalAddress.zipCode = data.partyPreferencesDTOs.addresses[0].postalAddress.zipCode;
                        self.addressData.postalAddress.line1 = data.partyPreferencesDTOs.addresses[0].postalAddress.line1;
                        self.addressData.postalAddress.line2 = data.partyPreferencesDTOs.addresses[0].postalAddress.line2;
                        self.addressData.postalAddress.line3 = data.partyPreferencesDTOs.addresses[0].postalAddress.line3;
                        self.addressData.postalAddress.line4 = data.partyPreferencesDTOs.addresses[0].postalAddress.line4;
                    }
                    self.version(data.partyPreferencesDTOs.version);
                    self.partyIDdisplayValue(data.partyPreferencesDTOs.party.displayValue);
                    self.partyName(data.partyPreferencesDTOs.partyName);
                    self.isEnabled(data.partyPreferencesDTOs.isEnabled);
                    if (self.isEnabled() === true) {
                        self.isEnabledSelected("true");
                    } else {
                        self.isEnabledSelected("false");
                    }
                    self.isForexDealCreationEnabled(data.partyPreferencesDTOs.dealCreationAllowed);
                    if (self.isForexDealCreationEnabled() === true)
                        self.isForexDealCreationAllowed("true");
                     else
                        self.isForexDealCreationAllowed("false");

                    if (data.partyPreferencesDTOs.isCorpAdminEnabled) {
                        self.isCorpAdminEnabled("ENABLED");
                        self.isAccessibleRoles(true);
                    } else {
                        self.isAccessibleRoles(false);
                        self.isCorpAdminEnabled("DISABLED");
                    }
                    for (var i = 0; i < self.approvalType().length; i++) {
                        if (self.approvalType()[i].value === data.partyPreferencesDTOs.approvalType) {
                            if (self.approvalType()[i].value === data.partyPreferencesDTOs.approvalType) {
                                self.selectedApprovalType(self.approvalType()[i].value);
                                self.selectedApprovalTypeDescription(self.approvalType()[i].displayValue);
                            }
                        }
                    }

                    if (data.partyPreferencesDTOs.gracePeriod) {
                        self.gracePeriod(data.partyPreferencesDTOs.gracePeriod);
                        self.isGracePeriodLoaded(false);
                        self.isGracePeriodLoaded(true);
                    }
                    self.allowedRoles(data.partyPreferencesDTOs.allowedRoles);
                    self.selectedAllowedRoles(self.allowedRoles());
                    self.customerPreferenceValidated(true);
                } else {
                    self.customerPreferenceValidated(false);
                }
                self.partyPreferenceLoaded(true);
                self.isDataReceived(true);
            }).fail(function () {
                self.customerPreferenceValidated(false);
            });
            self.isDisabled(true);
        };

        var partyDetailsFetchedSubscription = self.rootModelInstance().partyDetails.partyDetailsFetched.subscribe(function (newValue) {
            if (newValue && self.rootModelInstance().partyDetails.partyDetailsFetched()) {
                self.showMenu(true);
                self.isDisabled(false);
                self.showCreateCustomerScreen(true);
                self.partyName(self.rootModelInstance().partyDetails.partyName());
                self.partyID(self.rootModelInstance().partyDetails.party.value());
                self.partyIDdisplayValue(self.rootModelInstance().partyDetails.party.displayValue());
                self.selectedUserLimit("");
                self.selectedCCL("");
                self.selectedApprovalType(null);
                self.selectedApprovalTypeDescription("");
                self.selectedCCLDescription("");
                self.selectedUserLimitDescription("");
                self.partyValidated(true);
                self.searchCustPreferenceForPartyID();
                self.gracePeriod("");
            }
        });
        if (partyId.value) {
            self.rootModelInstance().partyDetails.party.value(partyId.value);
            self.rootModelInstance().partyDetails.partyName(userProfile.firstName);
            self.rootModelInstance().partyDetails.party.displayValue(partyId.displayValue);
            self.rootModelInstance().partyDetails.partyDetailsFetched(true);
            self.isCorpAdmin(true);
        } else {
            self.isCorpAdmin(false);
        }
        self.version = ko.observable();
        self.addressData = self.rootModelInstance().addressData;
        self.additionalDetails = ko.observable();
        rootParams.baseModel.registerComponent("party-validate", "common");
        rootParams.baseModel.registerElement("modal-window");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("action-header");
        rootParams.baseModel.registerComponent("modify-customer-preference", "customer-preference");
        self.isUserlimitLoaded(true);
        self.isselectedCCLLoaded(true);
        self.maxGracePeriodFetched = ko.observable(false);
        self.maxGracePeriod = ko.observable();
        PreferenceFunctionsModel.getMaxGracePeriod(partyId.displayValue).done(function (data) {
            self.maxGracePeriod(data.maxAllowedDays);
            self.maxGracePeriodFetched(true);
        });

        self.updateCustomerPreference = function () {
            self.previousSelectedUserLimit(self.selectedUserLimit());
            self.previousSelectedPartyLimit(self.selectedCCL());
            self.modifyButtonPressed(true);
            self.isDisabled(false);
        };
        self.goBack = function () {
            rootParams.dashboard.loadComponent("preference-base", {}, self);
        };
        self.initiateCustomerPreference = function () {
            self.isEnabled("reset");
            self.isEnabled(undefined);
            self.selectedUserLimit("reset");
            self.selectedUserLimit(undefined);
            self.selectedCCL("reset");
            self.selectedCCL(undefined);
            self.previousSelectedUserLimit("reset");
            self.previousSelectedUserLimit(undefined);
            self.previousSelectedPartyLimit("reset");
            self.previousSelectedPartyLimit(undefined);
            self.isEnabledSelected("reset");
            self.isEnabledSelected(null);
            self.isForexDealCreationAllowed("reset");
            self.isForexDealCreationAllowed(null);
            self.selectedApprovalType("reset");
            self.selectedApprovalType(null);
            self.gracePeriod("reset");
            self.gracePeriod(undefined);
        };
        self.editPartyPreference = function () {
            rootParams.dashboard.loadComponent("modify-customer-preference", {
                allowedRoles: self.allowedRoles(),
                selectedAllowedRoles: self.selectedAllowedRoles()
            }, self);
        };
        self.dispose = function () {
            partyDetailsFetchedSubscription.dispose();
        };
    };
});
