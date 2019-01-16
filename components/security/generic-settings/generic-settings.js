define([
  "ojs/ojcore",
  "knockout",
  "ojs/ojswitch"
], function(oj, ko) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    rootParams.baseModel.registerComponent("device-unbinding", "security");
    rootParams.baseModel.registerComponent("push-unbinding", "security");
    rootParams.baseModel.registerComponent("wearable-device-unbinding", "security");
    rootParams.baseModel.registerComponent("feedback-preference", "feedback");
  };
});
