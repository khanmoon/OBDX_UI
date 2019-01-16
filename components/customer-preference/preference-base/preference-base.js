define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "baseLogger",

    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojpopup"
], function (oj, ko, $, PreferenceBaseModel, BaseLogger, resourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.nls = resourceBundle;
        self.customerPreferenceValidated = ko.observable(false);
        self.partyPreferenceLoaded = ko.observable(false);
        self.partyIDdisplayValue = ko.observable();
        self.partyValidated = ko.observable(false);
        self.isDataReceived = ko.observable(false);
        self.done = ko.observable(false);
        self.showCreateCustomerScreen = ko.observable(false);
        self.allowedRoles = ko.observableArray();
        self.isDisabled = ko.observable(true);
        self.isEnabled = ko.observable();
        self.isForexDealCreationEnabled = ko.observable();
        self.isEnabledSelected = ko.observable();
        self.isForexDealCreationAllowed = ko.observable();
        self.userLimitDataLoaded = ko.observable(false);
        self.cummulativeDataLoaded = ko.observable(false);
        self.isUserlimitLoaded = ko.observable(false);
        self.isselectedCCLLoaded = ko.observable(false);
        self.isGracePeriodLoaded = ko.observable(false);
        self.showReviewForCreate = ko.observable(false);
        self.modifyButtonPressed = ko.observable(false);
        self.showConfirmation = ko.observable(false);
        self.partyID = ko.observable();
        self.partyName = ko.observable();
        self.userLimitData = ko.observable([]);
        self.selectedUserLimit = ko.observable();
        self.selectedCCL = ko.observable();
        self.selectedAllowedRoles = ko.observable();
        self.selectedUserLimitDescription = ko.observable();
        self.selectedCCLDescription = ko.observable();
        self.gracePeriod = ko.observable();
        self.selectedApprovalTypeDescription = ko.observable();
        self.cumLevelData = ko.observable([]);
        self.validationTracker = ko.observable();
        self.gracePeriod = ko.observable();
        self.pathForBrandCSS = ko.observable();
        self.selectedApprovalType = ko.observable();
        self.previousSelectedUserLimit = ko.observable();
        self.previousSelectedPartyLimit = ko.observable();
        self.isEnabledChecked = ko.observable(["false"]);
        self.isForexDealCreationChecked = ko.observable(false);
        self.isCorpAdminEnabled = ko.observable();
        self.isAccessibleRoles = ko.observable(false);
        self.parames = null;
        self.searchParameters = {

          assignableEntities: [{
            key: {
              "type": "ROLE",
              "value": "corporateuser"
            }
          }]
        };
        self.approvalType = ko.observable([
            {
                value: "SE",
                displayValue: self.nls.headings.sequential
            },
            {
                value: "NSE",
                displayValue: self.nls.headings.nonSequential
            },
            {
                value: "ZE",
                displayValue: self.nls.headings.noApproval
            }
        ]);
        self.payload = ko.observable({
            approvalType: "",
            partyId: "",
            partyName: "",
            isEnabled: self.isEnabled(),
            limitPackageUtilizedByUser: {},
            limitPackageUtilizedByParty: {},
            isCorpAdminEnabled: false,
            allowedRoles: "",
            version: "",
            dealCreationAllowed: self.isForexDealCreationEnabled()
        });
        self.isCorporateAdminEnabled = ko.observable(false);
        rootParams.baseModel.registerComponent("preference-search", "customer-preference");
        rootParams.baseModel.registerComponent("create-customer-preference", "customer-preference");
        rootParams.baseModel.registerComponent("review-create-customer-preference", "customer-preference");
        rootParams.baseModel.registerComponent("review-modify-customer-preference", "customer-preference");
        rootParams.baseModel.registerComponent("confirmation", "account-access-management");
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        PreferenceBaseModel.fetchLimitGroups(JSON.parse(ko.toJSON(self.searchParameters))).done(function (data) {
            self.userLimitData(data.limitPackageDTOList);
            self.cumLevelData(data.limitPackageDTOList);
            self.cummulativeDataLoaded(true);
            self.userLimitDataLoaded(true);
        });
        self.selectedCCL.subscribe(function () {
            $.each(self.cumLevelData(), function (index) {
                if (self.cumLevelData()[index].key.id === self.selectedCCL()) {
                    self.selectedCCLDescription(self.cumLevelData()[index].key.id);
                }
            });
        });
        self.selectedUserLimit.subscribe(function () {
            $.each(self.userLimitData(), function (index) {
                if (self.userLimitData()[index].key.id === self.selectedUserLimit()) {
                    self.selectedUserLimitDescription(self.userLimitData()[index].key.id);
                }
            });
        });
        self.selectedApprovalType.subscribe(function () {
            $.each(self.approvalType(), function (index) {
                if (typeof self.selectedApprovalType() === "object") {
                    if (self.selectedApprovalType() !== null) {
                        if (self.approvalType()[index].value === self.selectedApprovalType()[0]) {
                            self.selectedApprovalTypeDescription(self.approvalType()[index].displayValue);
                        }
                    }
                } else {
                    if (self.approvalType()[index].value === self.selectedApprovalType()) {
                        self.selectedApprovalTypeDescription(self.approvalType()[index].displayValue);
                    }
                    self.payload().approvalType = self.selectedApprovalType();
                }
            });
        });
    };
});
