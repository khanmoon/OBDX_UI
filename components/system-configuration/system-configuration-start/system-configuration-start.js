define([
  "knockout",
  "jquery",

  "./model",
  "ojL10n!resources/nls/system-configuration-start",
  "ojs/ojinputtext"
], function(ko, $, SystemConfigurationStart, Resourcebundle) {
  "use strict";
  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.id = ko.observable();
    self.nls = Resourcebundle;
    params.dashboard.headerName(self.nls.pageTitle.header);
    self.hostConfigurationDone = ko.observable(false);
    if (params.rootModel.mode === undefined) {
      self.mode = ko.observable("view");
      self.hostSelected = ko.observable();
      self.hostSelected(false);
      SystemConfigurationStart.fetchConfigurationDetails().done(function(data) {
        if (data.configResponseList[0].propertyValue === "true") {
          self.hostConfigurationDone(true);
          SystemConfigurationStart.getHostSelection().done(function(data) {
            self.selectedHost = ko.observable();
            self.selectedHost(data.configResponseList[0].propertyValue);
            self.hostSelected(true);
          });
        } else {
          params.baseModel.registerComponent("system-configuration-home", "system-configuration");
          params.dashboard.loadComponent("system-configuration-home", {}, self);
        }
      });
    } else {
      self.selectedHost(self.selectedHost());
    }
    params.baseModel.registerComponent("system-configuration-menu", "system-configuration");
  };
});
