define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "baseModel",
  "ojL10n!resources/nls/origination-generic",
  "knockout-mapping",
  "ojs/ojknockout",
  "knockout-helper",
  "ojs/ojbutton"
], function(oj, ko, $, BaseModel) {
  "use strict";
  return function(root) {
    var self = this;
    ko.utils.extend(self, BaseModel.getInstance());
    ko.utils.extend(self, root);

    /*This function returns whether or not the final submit button of a particular application stage
    should be displayed or not
    */
    self.displaySubmitButton = function() {
      return true;
    };
    /*This function returns true or false based on whether a Apllication stages section is complete or not
    exaple: can use this function to test if contact-info section is completed
    */
    self.getApplicationStageSectionCompletionStatus = function(sectionName) {
      var i;
      for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
        if (self.productDetails().application().currentApplicationStage.stages[i].id === sectionName) {
          return self.productDetails().application().currentApplicationStage.stages[i].isComplete();
        }
      }
    };
    self.setAccordionTitle = function() {
      for (var i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
        if (self.applicantDetails().length > 1) {
          if (self.productDetails().application().currentApplicationStage.applicantStages[i].coappNumber && self.applicantDetails()[1].primaryInfo) {
            self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(self.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i - 1].name], {
              applicant: self.format(self.accordionNames.accordionNames.applicantName, {
                name: self.format(self.resource.generic.common.name, {
                  firstName: self.applicantDetails()[1].primaryInfo.primaryInfo.firstName(),
                  lastName: self.applicantDetails()[1].primaryInfo.primaryInfo.lastName()
                })
              })
            }));
          } else if (!self.productDetails().application().currentApplicationStage.applicantStages[i].coappNumber) {
            if (self.applicantDetails()[0].primaryInfo) {
              self.productDetails().application().currentApplicationStage.applicantStages[i].accordionTitle(self.format(self.accordionNames.accordionNames[self.productDetails().application().currentApplicationStage.applicantStages[i].name], {
                applicant: self.format(self.accordionNames.accordionNames.applicantName, {
                  name: self.format(self.resource.generic.common.name, {
                    firstName: self.applicantDetails()[0].primaryInfo.primaryInfo.firstName(),
                    lastName: self.applicantDetails()[0].primaryInfo.primaryInfo.lastName()
                  })
                })
              }));
            }
          }
        }
      }
    };
    /*
    This function is used to mark a application stage section as complete
    example to mark 'primary-info' section of 'personal-details' application stage as complete
    */
    self.completeApplicationStageSection = function(stage, accordion) {
      stage.isComplete(true);
      var applicantAccordions = ["EMPINF", "CONINF", "PERINF", "IDINF"];
      if (!stage.nextStagename) {
        accordion().close(stage.sequenceNumber);
      } else if (self.productDetails().sectionBeingEdited() || (!self.applicantDetails()[0].newApplicant && $.inArray(stage.workflowId, applicantAccordions) > -1)) {
          accordion().close(stage.sequenceNumber);
        } else {
          accordion().open(stage.sequenceNumber + 1);
        }
      if (root.saveApplicationCustomer) {
        root.saveApplicationCustomer(stage, accordion);
      }
    };
    /**
     * This function is used to navigate to the next application stage
     * @function getNextApplicationStage
     * @memberOf ApplicationFormViewModel
     */
    self.getNextApplicationStage = function() {
      if (self.productDetails().sectionBeingEdited()) {
        var review = ko.utils.arrayFilter(self.productDetails().productStages, function(stage) {
          if (stage.id === "review") {
            return stage;
          }
        });
        self.productDetails().currentStage = review[0];
        self.productComponentName("review");

      } else if (self.productDetails().application().currentApplicationStage.sequenceNumber === self.productDetails().application().stages().length) {
          self.getNextStage();
        } else {
          self.registerComponent(self.productDetails().application().currentApplicationStage.nextStagename, "origination");
          self.productDetails().productApplicationComponentName(self.productDetails().application().currentApplicationStage.nextStagename);
          self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[self.productDetails().application().currentApplicationStage.sequenceNumber];
        }
    };

    self.checkformDataChange = function(currentData, oldData, stages) {
      if (oldData === currentData) {
        self.completeApplicationStageSection(stages, self.productDetails().application().currentApplicationStage.applicantAccordion);
        return true;
      }
      return false;
    };
  };
});
