define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",
  "ojL10n!resources/nls/authorization",
  "ojs/ojinputtext",
  "ojs/ojradioset"
], function(oj, ko, $, BaseLogger, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = resourceBundle;
    rootParams.baseModel.registerComponent("transaction-mapping-search", "role-transaction-mapping");
    rootParams.baseModel.registerComponent("application-role-create", "role-transaction-mapping");
    self.verifyAndEdit = ko.observable(false);
    rootParams.dashboard.headerName(self.nls.common.roleTransactionMapping);
    self.openCreatePanel = function() {
      rootParams.dashboard.loadComponent("application-role-create", {}, self);
    };
  };
});
