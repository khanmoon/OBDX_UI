define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/user-search-list",
  "ojs/ojtable",
  "ojs/ojarraytabledatasource",
  "ojs/ojpagingcontrol",
  "ojs/ojpagingtabledatasource",
  "ojs/ojswitch"
], function(oj, ko, $, ReviewUserStatusModel, resourceBundle) {
  "use strict";
  return function viewModel(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.searchedResultResponse = ko.observable();
    if (rootParams.rootModel.params && rootParams.rootModel.params.data) {
      self.searchedResultResponse(ko.toJS(rootParams.rootModel.params.data));
      if (rootParams.rootModel.params.data.lockStatus() === "LOCK")
        self.reviewstatusOptionValue = ko.observable(true);
      else {
        self.reviewstatusOptionValue = ko.observable(false);
      }
      self.lockStatusValue = ko.observable(rootParams.rootModel.params.data.lockStatus());
    } else {
      self.searchedResultResponse = rootParams.rootModel.selectedUserData;
      self.reviewstatusOptionValue = ko.observable(rootParams.rootModel.statusOptionValueNew());
      self.lockStatusValue = ko.observable(rootParams.rootModel.statusOptionValue());
      self.lockReason = ko.observable(rootParams.rootModel.reason());
    }
    self.nls = resourceBundle;
    rootParams.baseModel.registerElement("confirm-screen");

    self.confirm = function() {
      if (self.lockStatusValue().toUpperCase() === "LOCKED") {
        var payload = {lockReason: self.lockReason()};
        ReviewUserStatusModel.lockStatus(self.searchedResultResponse().username, ko.toJSON(payload)).done(function(data, status, jqXhr) {
          self.transactionStatus(data.status);
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.header.lockStatus
          }, self);
        });
      } else {
        ReviewUserStatusModel.unlockStatus(self.searchedResultResponse().username).done(function(data, status, jqXhr) {
          self.transactionStatus(data.status);
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.header.lockStatus
          }, self);
        });
      }
    };
  };
});
