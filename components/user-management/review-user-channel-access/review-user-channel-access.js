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
], function(oj, ko, $, ReviewUserChannelAccessModel, resourceBundle) {
  "use strict";
  return function viewModel(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.userSearchResponse = ko.observable();
    self.nls = resourceBundle;
    if (rootParams.rootModel.params && rootParams.rootModel.params.data) {
      self.userSearchResponse(ko.toJS(rootParams.rootModel.params.data));
      self.channelAccessValue = ko.observable(self.userSearchResponse().deleteStatus);
    } else {
      self.userSearchResponse = rootParams.rootModel.selectedUserDetail;
      self.channelAccessValue = ko.observable(rootParams.rootModel.deleteStatus());
    }
    if (self.channelAccessValue())
      self.userChannelAccess = ko.observable(self.nls.header.revoked);
    else
      self.userChannelAccess = ko.observable(self.nls.header.granted);
    rootParams.baseModel.registerElement("confirm-screen");
    self.confirm = function() {
      ReviewUserChannelAccessModel.deleteUser(self.userSearchResponse().username, self.userChannelAccess()).done(function(data, status, jqXhr) {
        self.transactionStatus(data.status);
        rootParams.dashboard.loadComponent("confirm-screen", {
          jqXHR: jqXhr,
          transactionName: self.nls.header.userChannelAccess
        }, self);
      });
    };
  };
});
