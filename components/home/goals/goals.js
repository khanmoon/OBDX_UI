define([
  "knockout",
  "jquery",
  "ojL10n!resources/nls/goals"
], function(ko, $, resourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.resource = resourceBundle;
    rootParams.baseModel.registerComponent("goal-category-select", "goals");
    self.openGoalCalculator = function() {
      rootParams.dashboard.loadComponent("goal-category-select", {
        calculateGoal: true,
        loginRequired: true
      }, self);
    };
  };
});