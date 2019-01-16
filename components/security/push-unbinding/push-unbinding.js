define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/push-unbinding",
  "ojs/ojswitch"
], function(oj, ko, $, Model, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = ResourceBundle;
    rootParams.dashboard.headerName(self.resource.settings);
    self.androidDevice = ko.observable(false);
    self.androidDisabled = ko.observable(true);
    self.iOsDevice = ko.observable(false);
    self.iOsDisabled = ko.observable(true);

    Model.getDeviceCount().then(function(data) {
      ko.utils.arrayForEach(data.listDTO, function(item) {
        if (item.os === "ANDROID" && item.count > 0) {
          self.androidDevice(true);
          self.androidDisabled(false);
        }
        if (item.os === "IOS" && item.count > 0) {
          self.iOsDevice(true);
          self.iOsDisabled(false);
        }
      });
    });

    self.androidDevice.subscribe(function(newValue) {
      if (!newValue) {
        Model.unregisterDevices("ANDROID").then(function() {
          self.androidDisabled(true);
        });
      }
    });
    self.iOsDevice.subscribe(function(newValue) {
      if (!newValue) {
        Model.unregisterDevices("IOS").then(function() {
          self.iOsDisabled(true);
        });
      }
    });
  };
});
