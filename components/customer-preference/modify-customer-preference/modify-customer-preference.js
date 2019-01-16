define([
    "ojs/ojcore",
    "knockout",
    "jquery",
    "./model",
    "ojL10n!resources/nls/customer-preference",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "baseLogger",
    "ojs/ojpopup",
    "ojs/ojcheckboxset",
    "ojs/ojradioset",
    "ojs/ojvalidationgroup",
    "ojs/ojknockout-validation",
    "ojs/ojvalidation"
], function (oj, ko, $, UpdateCPModel,ResourceBundle) {
    "use strict";
    return function viewModel(rootParams) {
        var self = this;
        self.resource=ResourceBundle;
        self.setRoles = ko.observable(false);
        self.isCorpAdminEnabled = ko.observable();
        self.isAccessibleRoles = ko.observable();
        self.setAllowedRoles = ko.observableArray();
        ko.utils.extend(self, rootParams.rootModel);
        self.transactionStatus = ko.observable();
        self.httpStatus = ko.observable();
        self.partyId = rootParams.partyId;
        rootParams.baseModel.registerElement("page-section");
        rootParams.baseModel.registerElement("row");
        rootParams.baseModel.registerElement("action-header");
        self.showReview = ko.observable(false);
        self.showConfirmationScreen = ko.observable(false);
        self.previousSelectedPartyLimit(rootParams.rootModel.selectedCCL());
        self.previousSelectedUserLimit(rootParams.rootModel.selectedUserLimit());
        rootParams.baseModel.registerElement("confirm-screen");
        self.payload(rootParams.rootModel.payload());
        self.allowedRolesList = ko.observableArray();
        rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
        var partyId = {};
        partyId.value = rootParams.dashboard.userData.userProfile.partyId.value;
        if (!partyId.value && self.params.allowedRoles) {
            self.setAllowedRoles(self.params.allowedRoles);
        }
        rootParams.baseModel.registerComponent("access-point-mapping", "financial-limits");
        self.limitPackagesForParty = ko.observable(rootParams.rootModel.parames.limitPackagesUtilizedByParty);
        self.limitPackagesForUser = ko.observable(rootParams.rootModel.parames.limitPackagesUtilizedByUser);
        self.accessPointType = ko.observable("INT");
        self.entityLimitPackageMapArray = ko.observableArray();
        self.entityLimitPackageMapArray.push({
          entityId: "PARTY",
          selectedLimitPackages: self.limitPackagesForParty,
          limitPackages: ko.observableArray(),
          limitPackagesLoaded: ko.observable(false),
          limitPackageDetails: ko.observableArray()
        });
        self.entityLimitPackageMapArray.push({
          entityId: "USER",
          selectedLimitPackages: self.limitPackagesForUser,
          limitPackages: ko.observableArray(),
          limitPackagesLoaded: ko.observable(false),
          limitPackageDetails: ko.observableArray()
        });


        self.fetchCorpAdminRoles = function () {
            UpdateCPModel.fetchChildRole("corporateuser").done(function (data) {
                    var allowedRolesList = self.allowedRolesList();
                    var corpAdminRoles = data.applicationRoleDTOs;
                    var temp = [];
                    for (var i = 0; i < corpAdminRoles.length; i++) {
                        temp[i] = corpAdminRoles[i].applicationRoleName;
                    }
                    corpAdminRoles = temp;
                    allowedRolesList = allowedRolesList.concat(corpAdminRoles);
                    self.allowedRolesList(allowedRolesList);
                    self.setRoles(true);
            });
        };

        self.fetchCorpAdminRoles();
        self.cumulativeLevelChangeHandler = function (event) {
            if (event.detail.value) {
                    self.selectedCCL(event.detail.value);
            }
        };
        self.userLimitChangeHandler = function (event) {
            if (event.detail.value) {
                if (event.detail.value) {
                    self.selectedUserLimit(event.detail.value);
                } else if (self.selectedUserLimit() === undefined || (typeof self.selectedUserLimit() === "object" && self.selectedUserLimit() === undefined)) {
                        self.selectedUserLimit("");
                        self.selectedUserLimitDescription(self.nls.headings.noLimitGroupSelected);
                    }
            }
        };
        self.switchAction = function ()
        {
                self.payload().isEnabled = self.isEnabledSelected();
                self.isEnabled(self.isEnabledSelected());
        };
        self.enableForexDeal = function ()
        {
            self.payload().isDealCreationEnabledValue = self.isForexDealCreationAllowed();
            self.isForexDealCreationEnabled(self.isForexDealCreationAllowed());
        };
        self.enableCorpAdmin = function () {
          if(self.isCorpAdminEnabled()==="ENABLED")
            {
                self.payload().isCorpAdminEnabled = true;
                self.setAllowedRoles.removeAll();
                self.isAccessibleRoles(true);
            } else if (self.isCorpAdminEnabled()==="DISABLED")
            {
                self.payload().isCorpAdminEnabled = false;
                self.isAccessibleRoles(false);
            }
        };
        self.approvalTypeChangeHandler = function () {
                self.payload().approvalType = self.selectedApprovalType();
                self.selectedApprovalType(self.selectedApprovalType());
        };
        self.reviewCP = function () {
          var validationTracker = document.getElementById("validationTracker");
            if (!rootParams.baseModel.showComponentValidationErrors(validationTracker)) {
                return;
            }
            var limitPackagesUtilizedByUser = [];
            var limitPackagesUtilizedByParty = [];
            for (var x1 = 0; x1 < self.entityLimitPackageMapArray().length; x1++) {
              for (var x2 = 0; x2 < self.entityLimitPackageMapArray()[x1].limitPackageDetails().length; x2++) {
                if (self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage()) {
                  var limitPackage = {};
                  limitPackage.key = {};
                  limitPackage.key.id = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].selectedLimitPackage();
                  limitPackage.accessPointValue = self.entityLimitPackageMapArray()[x1].limitPackageDetails()[x2].accessPoint;
                  if (self.entityLimitPackageMapArray()[x1].entityId === "USER") {
                    limitPackagesUtilizedByUser.push(limitPackage);
                  } else {
                    limitPackagesUtilizedByParty.push(limitPackage);
                  }
                }
              }
            }
            self.payload().partyId = self.partyID();
            self.payload().partyName = self.partyName();
            self.payload().partyLimitDescription = self.selectedCCLDescription();
            self.payload().userLimitDescription = self.selectedUserLimitDescription();
            self.payload().allowedRoles = self.setAllowedRoles();
            self.payload().version = self.version();
            self.payload().limitPackagesUtilizedByUser = limitPackagesUtilizedByUser;
            self.payload().limitPackagesUtilizedByParty = limitPackagesUtilizedByParty;
            self.payload().gracePeriod = self.gracePeriod();
            if (typeof self.selectedApprovalType() === "object") {
                self.payload().approvalType = self.selectedApprovalType()[0];
            } else {
                self.payload().approvalType = self.selectedApprovalType();
            }
            if (typeof self.isEnabled() === "object") {
                self.payload().isEnabled = self.isEnabled()[0];
            } else {
                self.payload().isEnabled = self.isEnabled();
            }
            if (typeof self.isForexDealCreationEnabled() === "object")
                self.payload().dealCreationAllowed = self.isForexDealCreationEnabled()[0];
            else
                self.payload().dealCreationAllowed = self.isForexDealCreationEnabled();
            if (self.isCorpAdminEnabled() === "ENABLED") {
                self.payload().isCorpAdminEnabled = true;
            } else {
                self.payload().isCorpAdminEnabled = false;
            }
            location.hash = "review";
            self.payload().isActionRequired = true;
            $.extend(self.params, { data: self.payload() });
            self.showReview(true);
        };
        self.backOnEdit = function () {
            rootParams.dashboard.loadComponent("preference-search", {}, self);
            self.searchCustPreferenceForPartyID();
        };
        self.cancelOnEdit = function () {
            rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
        };
    };
});
