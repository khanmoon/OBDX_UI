define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/file-admin-create",
  "ojs/ojknockout-validation",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox",
  "ojs/ojtable",
  "ojs/ojlistview",
  "ojs/ojpopup",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource"
], function(oj, ko, $, adminSearchModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    rootParams.baseModel.registerComponent("file-identifier-view", "file-upload");
    rootParams.baseModel.registerComponent("file-identifier-edit", "file-upload");
    rootParams.baseModel.registerComponent("file-identifier-create", "file-upload");
    rootParams.baseModel.registerElement("page-section");
    self.Nls = resourceBundle.fileAdminCreate;
    self.isFILoaded = ko.observable(false);
    self.isBankAdmin = ko.observable(false);
    self.transactionTypesMap = {};
    self.approvalTypesMap = {};
    self.additionalDetails = ko.observable();
    self.selectedFUID = ko.observable();
    self.approvalTypes = ko.observableArray();
    self.isApprovalTypesLoaded = ko.observable(false);
    self.isTransactionTypesLoaded = ko.observable(false);
    self.showCreate = ko.observable(false);
    var FIMap = {};
    self.FIList = ko.observableArray();
    self.datasource = ko.observable();
    if (!rootParams.dashboard.userData.userProfile.partyId.value) {
      self.isBankAdmin(true);
    } else {
      self.isBankAdmin(false);
    }
    var count = 1;
    self.renderSrNo = function() {
      if (count > self.FIList().length)
        count = 1;
      return count++;
    };

    self.adminCreate = function() {
      adminSearchModel.adminCreate().done(function(data) {
        for (var i = 0; i < data.fileIdentifierRegistrations.length; i++) {
          data.fileIdentifierRegistrations[i].index = i + 1;
          if (data.fileIdentifierRegistrations[i].fileTemplateDTO) {
            data.fileIdentifierRegistrations[i].transactionDesc = self.transactionTypesMap[data.fileIdentifierRegistrations[i].fileTemplateDTO.transaction];
          }
          FIMap[data.fileIdentifierRegistrations[i].fileIdentifier] = data.fileIdentifierRegistrations[i];
          data.fileIdentifierRegistrations[i].approvalDesc = self.approvalTypesMap[data.fileIdentifierRegistrations[i].approvalType];
        }
        self.FIList(data.fileIdentifierRegistrations);
        self.datasource(new oj.ArrayTableDataSource(self.FIList(), {
          idAttribute: "fileIdentifier"
        }));
        self.isFILoaded(true);
      });
    };

    adminSearchModel.getApprovalTypes().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.approvalTypes.push({
          text: data.enumRepresentations[0].data[i].description,
          value: data.enumRepresentations[0].data[i].code
        });
        self.approvalTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
      }
      self.isApprovalTypesLoaded(true);
      self.getTransactionTypes();
    });
    self.getTransactionTypes = function() {
      adminSearchModel.getTransactionTypes().done(function(data) {
        for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
          self.transactionTypesMap[data.enumRepresentations[0].data[i].code] = data.enumRepresentations[0].data[i].description;
        }
        self.isTransactionTypesLoaded(true);
        self.adminCreate();
      });
    };
    self.create = function() {
      rootParams.dashboard.loadComponent("file-identifier-create", {}, self);
    };
    self.onUserSelected = function(id) {
      self.selectedFUID(FIMap[id]);
      rootParams.dashboard.loadComponent("file-identifier-view", {}, self);
    };
  };
});
