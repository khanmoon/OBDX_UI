define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "./model",
  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext",
  "ojs/ojknockout-validation"
], function(oj, ko, $, BaseLogger, ApplicationRolesSearchModel, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    self.validationTracker = ko.observable();
    self.selectedUser = ko.observable();
    self.selectedAccessPoint = ko.observable();
    self.accessPointType = ko.observableArray();
    self.isAccessPointFetched = ko.observable(false);
    self.isUserFetched = ko.observable(false);
    self.appRoleName = ko.observable();
    self.validationTracker = ko.observable();
    self.userSegment = ko.observableArray();
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    rootParams.baseModel.registerComponent("application-role-create", "role-transaction-mapping");
    ApplicationRolesSearchModel.fetchUserGroupOptions().done(function(data) {
      if (data.enterpriseRoleDTOs) {
        for (var i = 0; i < data.enterpriseRoleDTOs.length; i++) {
          self.userSegment().push({
            text: data.enterpriseRoleDTOs[i].enterpriseRoleName,
            value: data.enterpriseRoleDTOs[i].enterpriseRoleId
          });
        }
        self.isUserFetched(true);
      }
    });
    ApplicationRolesSearchModel.fetchAccessPointType().done(function(data) {
      for (var i = 0; i < data.enumRepresentations[0].data.length; i++) {
        self.accessPointType().push({
          text: data.enumRepresentations[0].data[i].description,
          value: data.enumRepresentations[0].data[i].code
        });
        self.isAccessPointFetched(true);
      }
    });
    self.submitIfEnter = function(data, event) {
      if (event.keyCode === 13) {
        self.searchApplicationRoles();
      }
    };

  };
});
