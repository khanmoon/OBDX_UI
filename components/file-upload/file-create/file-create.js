define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/file-create",
  "./model",
  "framework/js/constants/constants",
  "ojs/ojinputtext",
  "ojs/ojnavigationlist",
  "ojs/ojradioset"
], function(oj, ko, $, BaseLogger, resourceBundle, Model) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("nav-bar");
    rootParams.baseModel.registerComponent("file-identifier-search", "file-upload");
    rootParams.baseModel.registerComponent("file-admin-create", "file-upload");
    rootParams.baseModel.registerElement("modal-window");
    self.isAdmin = ko.observable();
    rootParams.dashboard.headerName(self.nls.fileCreate.create);
    self.partyDetailsFromApprovalNavBar = {};
    self.showChoicePopup = ko.observable(true);
    self.approvalUser = ko.observable();
    self.userType = ko.observable();
    self.menuSelection = ko.observable();
    self.party = ko.observable();
    self.mode = ko.observable("APPROVALREVIEW");
    Model.fetchMe().done(function(partyId) {
      if (partyId.userProfile.partyId.displayValue) {
        self.partyDetailsFromApprovalNavBar.value = partyId.userProfile.partyId.value;
        self.partyDetailsFromApprovalNavBar.displayValue = partyId.userProfile.partyId.displayValue;
        self.loadCorporateComponent();
        self.isAdmin(false);
      } else {
        self.isAdmin(true);
      }
    });
    self.keepCheck = ko.observable(false);
    self.showModal = function() {
      $("#choicePopup").trigger("openModal");
      self.keepCheck(true);
    };
    var targetComponent = rootParams.rootModel.params.type;
    if (!targetComponent)
      rootParams.dashboard.openDashBoard();
    self.closeHandler = function() {
      rootParams.dashboard.openDashBoard();
    };
    self.userTypeSelected = function() {
      if (self.userType() === "Admin User") {
        self.approvalUser("AdminUser");
        self.keepCheck(false);
        if (targetComponent === "file-create") {
          rootParams.dashboard.loadComponent("file-admin-create", {}, self);
        }
      } else if (self.userType() === "Corporate User") {
        self.loadCorporateComponent();
      }
    };
    self.loadCorporateComponent = function() {
      self.approvalUser("CorporateUser");
      self.keepCheck(false);
      if (targetComponent === "file-create")
        rootParams.dashboard.loadComponent("file-identifier-search", {}, self);
    };
  };
});
