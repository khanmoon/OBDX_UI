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
    Params.dashboard.headerName(self.resource.productConfiguration);

    Params.baseModel.registerElement("confirm-screen");
    Params.baseModel.registerComponent("workflow-confirm", "origination");
    var body = self.payload().body.steps[0].steps;
    $("#sortable").sortable();

    var sortedIDs;
    var body2;
    $("#sortable").on("sortstop", function() {
      sortedIDs = $("#sortable").sortable("toArray");
      if (self.isMoveAllowed(sortedIDs)) {

        body2 = [];
        for (var i = 0; i < sortedIDs.length; i++) {
          var object = ko.utils.arrayFilter(body, function(stage) {
            if (stage.id === sortedIDs[i]) {

              return stage;
            }
          });
          body2.push(object[0]);
        }

        for (var j = 0; j < body2.length; j++) {
          body2[j].sequenceId = j + 1;
        }

        body = JSON.parse(JSON.stringify(body2));
        self.payload().body.steps[0].steps = body;
      } else {

        $("#sortable").sortable("cancel");
      }
    });

    self.searchStage = function(stageKey, stages) {
      var matchedStage = ko.utils.arrayFilter(stages, function(stage) {
        if (stage.id === stageKey) {
          return stage;
        }
      });
      return matchedStage[0];
    };

    self.isMoveAllowed = function(sortedIDs) {

      for (var i = 0; i < self.payload().body.steps[0].steps.length - 1; i++) {
        if (sortedIDs[i] !== self.payload().body.steps[0].steps[i].id) {
          var currentStage = self.searchStage(sortedIDs[i], self.payload().body.steps[0].steps);
          var nextStage = self.searchStage(sortedIDs[i + 1], self.payload().body.steps[0].steps);

          var currentWeight = currentStage.uiWeightage;
          var nextWeight = nextStage.uiWeightage;
          if (currentWeight > nextWeight) {
            $("#deactivateMove").trigger("openModal");
            return false;
          }
        }
      }
      return true;
    };

    self.move = function(array, from, to) {
      array.splice(to, 0, array.splice(from, 1)[0]);
    };

    self.defaultFlowDisplay = function() {
      self.loadDefaultFlowDisplay(!self.loadDefaultFlowDisplay());

    };

  };
});
