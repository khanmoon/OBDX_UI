define([
    "ojs/ojcore",
    "knockout",
    "jquery",

    "./model",
    "ojL10n!lzn/gamma/resources/nls/application-form",
    "ojs/ojradioset",
    "ojs/ojinputtext",
    "ojs/ojselectcombobox",
    "ojs/ojtrain",
    "ojs/ojdatetimepicker"
], function (oj, ko, $, ApplicationFormModel, resourceBundle) {
    "use strict";
    return function (rootParams) {
        var self = this, i, j, successHandlers = {};
        ko.utils.extend(self, rootParams.rootModel);
        self.resource = resourceBundle;
        self.applicantType = "PRIMARY";
        self.dataLoaded = ko.observable(false);
        if (self.productDetails().requirements && self.productDetails().requirements.requestedAmount) {
            self.loanAmount(rootParams.baseModel.formatCurrency(self.productDetails().requirements.requestedAmount.amount, self.productDetails().requirements.requestedAmount.currency));
        }
        successHandlers.successHandlerfetchApplcantList = function (data) {
            if (data.applicants && data.applicants.length > 0) {
                data.applicants.reduce(function (a, e) {
                    if (e.applicantRelationshipType === "CO_APPLICANT") {
                        self.applicantDetails()[1].applicantId(e.applicantId);
                    }
                    if (e.applicantRelationshipType === "APPLICANT") {
                        self.applicantDetails()[0].applicantId(e.applicantId);
                        if (!e.newApplicant) {
                            self.applicantDetails()[0].applicantType("customer");
                        }
                    }
                    return null;
                }, []);
            }
            self.applicantDetails()[0].newApplicant = data.applicants[0].newApplicant;
            self.dataLoaded(true);
        };
        ApplicationFormModel.fetchpplicantList(self.productDetails().submissionId.value, successHandlers.successHandlerfetchApplcantList);
        if (!self.applicantDetails()[0].applicantType) {
            self.applicantDetails()[0].applicantType = ko.observable("anonymous");
            self.applicantDetails()[0].channelUser = ko.observable(false);
            if (self.productDetails().requirements) {
                for (i = 1; i <= self.productDetails().requirements.noOfCoApplicants; i++) {
                    self.applicantDetails()[i].applicantType = ko.observable("anonymous");
                    self.applicantDetails()[i].channelUser = ko.observable(false);
                }
            }
        }
        if (self.productDetails().requirements) {
            if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.years() !== 0) {
                self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.years() + self.resource.years);
            }
            if (typeof self.productDetails().requirements.requestedTenure !== "undefined" && self.productDetails().requirements.requestedTenure.months() !== 0) {
                self.tenure(self.tenure() + self.productDetails().requirements.requestedTenure.months() + self.resource.months);
            }
        }
        self.disableFinalContinue = function (obj) {
            for (var i = 0; i < obj.length; i++) {
                if (!JSON.parse(obj[i].isComplete())) {
                    return true;
                }
            }
            return false;
        };
        if (!self.productDetails().application) {
            self.productDetails().applicantList = ko.observableArray([]);
            self.productDetails().application = ko.observable({ stages: ko.observableArray([]) });
            rootParams.baseModel.registerComponent("payday-" + self.productDetails().currentStage.stages[0].id, "origination");
            self.productDetails().productApplicationComponentName = ko.observable("payday-" + self.productDetails().currentStage.stages[0].id);
            for (i = 0; i < self.productDetails().currentStage.stages.length; i++) {
                self.productDetails().application().stages.push(self.productDetails().currentStage.stages[i]);
                if (self.productDetails().application().stages()[i].stages !== null) {
                    self.productDetails().application().stages()[i].applicantStages = JSON.parse(ko.toJSON(self.productDetails().application().stages()[i].stages));
                    for (j = 0; j < self.productDetails().application().stages()[i].stages.length; j++) {
                        self.productDetails().application().stages()[i].applicantStages[j].isComplete = ko.observable(false);
                    }
                }
            }
            self.productDetails().application().currentApplicationStage = self.productDetails().application().stages()[0];
        }
        else{
          rootParams.baseModel.registerComponent("payday-" + self.productDetails().currentStage.stages[0].id, "origination");
          self.productDetails().productApplicationComponentName("payday-" + self.productDetails().currentStage.stages[0].id);
        }

        self.saveApplicationCustomer = function (stage) {
            var payload = {
                requestedAmount: {
                    currency: rootParams.baseModel.getLocaleValue("localCurrency"),
                    amount: 0
                },
                requestedTenure: {
                    days: 0,
                    months: 0,
                    years: 0
                },
                isIPA: false,
                purposeType: "",
                frequency: "MONTHLY",
                isCapitalizeFeesOpted: false,
                isSettlementRequired: false,
                purpose: { code: "" },
                noOfCoApplicants: "0",
                productGroupCode: self.productDetails().productCode,
                productGroupName: self.productDetails().productDescription,
                productGroupSerialNumber: self.productGroupSerialNumber(),
                productClass: self.productDetails().productClassName,
                productSubClass: self.productDetails().productType,
                productId: self.productDetails().productCode,
                state: self.selectedState(),
                facilityId: self.productDetails().facilityId
            };
            var isStageReq = stage.id === "requirements" || stage.id === "vehicle-info";
            var isFirstStageForCustomer = !self.applicantDetails()[0].newApplicant && stage.sequenceNumber === 1;
            if (isFirstStageForCustomer && !self.applicationStartedFromDraft && !isStageReq) {
                ApplicationFormModel.validateLoan(self.productDetails().submissionId.value, payload);
            }
        };

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
            if (self.saveApplicationCustomer) {
              self.saveApplicationCustomer(stage, accordion);
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
              self.productComponentName("payday-review");

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

        ko.utils.extend(self);
    };
});
