define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseLogger",

  "ojL10n!resources/nls/workflow-configuration",
  "ojs/ojinputnumber",
  "ojs/ojinputtext",
  "ojs/ojselectcombobox"
], function(oj, ko, $, BaseLogger, ResourceBundle) {
  "use strict";

  return function(Params) {
    var self = this;
    ko.utils.extend(self, Params.rootModel);
    self.model = Params.model;
    self.validationTracker = Params.validator;
    self.resource = ResourceBundle;
    self.flowsLoaded = ko.observable(false);
    Params.dashboard.headerName(self.resource.productConfiguration);

    Params.baseModel.registerElement("confirm-screen");

    $("#sortable").sortable();

    var sortedIDs;

    $("#sortable").on("sortbeforestop", function() {
      sortedIDs = $("#sortable").sortable("toArray");
      self.logConsole(sortedIDs);
    });

    self.logConsole = function() {
      $("#sortable").sortable("cancel");

    };

  };
});
