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
  "ojs/ojradiocheckbox",
  "ojs/ojvalidationgroup",
  "ojs/ojknockout-validation",
  "ojs/ojvalidation"
], function(oj, ko, $, CreateCPModel, resourceBundle) {
  "use strict";
  return function viewModel(rootParams) {
    var self = this;
    self.setAllowedRoles = ko.observableArray();
    self.isAccessibleRoles = ko.observable();
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.resource = resourceBundle;
    self.showConfirmationScreen = ko.observable(false);
    self.transactionStatus = ko.observable();
    self.httpStatus = ko.observable();
    self.allowedRolesList = ko.observable();
    rootParams.baseModel.registerElement("confirm-screen");
    rootParams.dashboard.headerName(self.nls.headings.partyPreferences);
    rootParams.baseModel.registerComponent("access-point-mapping", "financial-limits");
    self.entityLimitPackageMapArray = ko.observableArray();
    self.accessPointType = ko.observable("INT");
    self.entityLimitPackageMapArray.push({
      entityId: "PARTY",
      selectedLimitPackages: ko.observableArray(),
      limitPackages: ko.observableArray(),
      limitPackagesLoaded: ko.observable(false),
      limitPackageDetails: ko.observableArray()
    });
    self.entityLimitPackageMapArray.push({
      entityId: "USER",
      selectedLimitPackages: ko.observableArray(),
      limitPackages: ko.observableArray(),
      limitPackagesLoaded: ko.observable(false),
      limitPackageDetails: ko.observableArray()
    });

    self.fetchCorpAdminRoles = function() {
      CreateCPModel.fetchChildRole("corporateuser").done(function(data) {
          var allowedRolesList = self.allowedRolesList();
          var corpAdminRoles = data.applicationRoleDTOs;
          var temp = [];
          for (var i = 0; i < corpAdminRoles.length; i++) {
            temp[i] = corpAdminRoles[i].applicationRoleName;
          }
          allowedRolesList = temp;
          self.allowedRolesList(allowedRolesList);
        });
    };
    self.fetchCorpAdminRoles();
    self.cumulativeLevelChangeHandler = function(event) {
      if (event.detail.value) {
        self.selectedCCL(event.detail.value);
      }
    };
    self.userLimitChangeHandler = function(event) {
      if (event.detail.value) {
        if (event.detail.value) {
          self.selectedUserLimit(event.detail.value);
        } else if (self.selectedUserLimit() === undefined || (typeof self.selectedUserLimit() === "object" && self.selectedUserLimit()[0] === undefined)) {
            self.selectedUserLimit("");
            self.selectedUserLimitDescription(self.nls.headings.noLimitGroupSelected);
          }
      }
    };
    self.approvalTypeChangeHandler = function() {
      self.payload().approvalType = self.selectedApprovalType();
    };
    self.switchAction = function() {
      self.payload().isEnabled = self.isEnabledSelected();
      self.isEnabled(self.isEnabledSelected());
    };
    self.enableForexDeal = function (){
        self.payload().isDealCreationEnabledValue = self.isForexDealCreationAllowed();
        self.isForexDealCreationEnabled(self.isForexDealCreationAllowed());
        };
    self.cancelOnCreate = function() {
      rootParams.dashboard.openDashBoard("nls.common.confirmationMessage");
    };
    self.goBack = function() {
      self.isDataReceived(false);
      self.rootModelInstance().partyDetails.partyDetailsFetched(false);
      rootParams.dashboard.loadComponent("preference-base", {}, self);
    };
    self.enableCorpAdmin = function() {
      if (self.isCorpAdminEnabled() === "ENABLED") {
        self.payload().isCorpAdminEnabled = true;
        self.setAllowedRoles.removeAll();
        self.isAccessibleRoles(true);
      } else if (self.isCorpAdminEnabled() === "DISABLED") {
        self.setAllowedRoles.removeAll();
        self.isAccessibleRoles(false);
        self.payload().isCorpAdminEnabled = false;
      }
    };
    self.createReview = function() {
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
      self.payload().userLimitDescription = self.selectedUserLimitDescription();
      self.payload().limitPackagesUtilizedByUser = limitPackagesUtilizedByUser;
      self.payload().limitPackagesUtilizedByParty = limitPackagesUtilizedByParty;
      self.payload().gracePeriod = self.gracePeriod();
      self.payload().allowedRoles = self.setAllowedRoles();
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
      self.payload().isActionRequired = true;
      $.extend(self.params, {
        data: self.payload()
      });
      self.showReviewForCreate(true);
    };
  };
});
