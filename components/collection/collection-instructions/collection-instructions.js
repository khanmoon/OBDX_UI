define([
    "knockout",

    "ojs/ojtable",
    "ojs/ojarraytabledatasource",
    "ojs/ojpagingcontrol",
    "ojs/ojpagingtabledatasource",
    "ojs/ojinputtext"
], function (ko) {
    "use strict";
    return function (params) {
        var self = this;
        ko.utils.extend(self, params.rootModel);
        self.stageIndex = params.index;
        self.datasourceForInstructions = ko.observable();
        self.instructionsArray = ko.observable();
        self.instrSelectionHandler = ko.observable();
        self.allInstructionSelected = ko.observable(["false"]);
        self.continueFunc = function () {
          var tracker = document.getElementById("instructionsValidationTracker");
          if (tracker.valid === "valid") {
            self.stages[self.stageIndex()].expanded(false);
            self.stages[self.stageIndex()].validated(true);
            self.stages[self.stageIndex() + 1].expanded(true);
          }else {
              self.stages[self.stageIndex()].validated(false);
              tracker.showMessages();
              tracker.focusOn("@firstInvalidShown");
          }
        };
    };
});
