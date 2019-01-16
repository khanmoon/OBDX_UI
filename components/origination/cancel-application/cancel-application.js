define([
  "ojs/ojcore",
  "knockout",
  "jquery",

  "./model",
  "baseLogger",
  "ojL10n!resources/nls/cancel-application",
  "ojs/ojcheckboxset"
], function(oj, ko, $, CancelApplicationModelObject, BaseLogger, resourceBundle) {
  "use strict";
  /**
   * View Model for Orientation screen. This page gives details about the flow
   * like what all details would be required and how much time would be needed
   * to complete the flow.
   *
   * @namespace Orientation~viewModel
   * @constructor OrientationViewModel
   */

  return function(rootParams) {
    var self = this,
      i = 0,

      stage, CancelApplicationModel = new CancelApplicationModelObject(),
      getNewKoModel = function() {
        var KoModel = CancelApplicationModel.getNewModel();

        return KoModel;
      };
    ko.utils.extend(self, rootParams.rootModel);
    self.applicantObject = rootParams.rootModel.applicantDetails();
    self.redirectObj = ko.observable();
    self.Reasons = ko.observableArray([]);
    self.ReasonsLoaded = ko.observable(false);
    self.cancelType = ko.observableArray([]);
    self.otherReasonsLoaded = ko.observable(false);
    self.validationTracker = ko.observable();
    self.productClassName = ko.observable("");
    self.othersReasonsText = ko.observable("");
    self.othersPresent = ko.observable(false);
    self.resource = resourceBundle;
    self.initializeModel = function() {
      CancelApplicationModel.init(self.productDetails().submissionId.value);
      CancelApplicationModel.fetchCancellationReasons(self.productDetails().productClassName).then(function(data) {
        self.Reasons(data.enumRepresentations[0].data);
        self.ReasonsLoaded(true);
        if (self.productDetails().currentStage.id === "application-form") {
          if (self.productDetails().application().currentApplicationStage.applicantStages) {
            for (i = 0; i < self.productDetails().application().currentApplicationStage.applicantStages.length; i++) {
              if (!self.productDetails().application().currentApplicationStage.applicantStages[i].isComplete()) {
                stage = self.productDetails().application().currentApplicationStage.applicantStages[i].id;
                break;
              }
            }
          } else if (self.productDetails().application().currentApplicationStage.id === "financial-details") {
            for (i = 0; i < self.productDetails().application().currentApplicationStage.stages.length; i++) {
              if (!self.productDetails().application().currentApplicationStage.stages[i].isComplete()) {
                stage = self.productDetails().application().currentApplicationStage.stages[i].id;
                break;
              }
            }
          }
        }

        if (!stage) {
          if (self.productDetails().sectionBeingEdited()) {
            stage = self.productDetails().sectionBeingEdited();
          } else {
            stage = self.productDetails().currentStage.id;
          }
        }
      });
    };
    self.initializeModel();
    if (!self.applicantObject.cancelApplication) {
      self.applicantObject.cancelApplication = getNewKoModel();
    }
    self.cancelApplication = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.productClass = self.productDetails().productClassName;
      if (stage) {
        self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.currentStep = stage.toUpperCase();
      }
      if (self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs.length > 1) {
        self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs = [{}];
      }
      for (i = 0; i < self.cancelType().length; i++) {
        self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs.push(getNewKoModel().cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs[0]);
        if (rootParams.baseModel.getDescriptionFromCode(self.Reasons(), self.cancelType()[i]).toUpperCase() === "OTHERS") {
          self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs[i].code = rootParams.baseModel.getDescriptionFromCode(self.Reasons(), self.cancelType()[i]);
          self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs[i].description = self.othersReasonsText();
        } else {
          self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs[i].code = self.cancelType()[i];
          self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs[i].description = rootParams.baseModel.getDescriptionFromCode(self.Reasons(), self.cancelType()[i]);
        }
      }
      self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs.splice(-1, 1);
      var payLoad = ko.toJSON(self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO);
      CancelApplicationModel.saveModel(payLoad).then(function() {
        self.isApplicationCancelled(true);
      }).fail(function() {
        self.applicantObject.cancelApplication.cancelInfo.submissionCancellationCreateRequestDTO.cancellationReasonsDTOs = [{}];
      });
    };
    self.changeCancelType = function(event) {
      if (event.detail.value) {
        for (i = 0; i < event.detail.value.length; i++) {
          if (rootParams.baseModel.getDescriptionFromCode(self.Reasons(), event.detail.value[i]).toUpperCase() === "OTHERS") {

            self.otherReasonsLoaded(true);
            self.othersPresent(true);
            break;

          } else {
            self.otherReasonsLoaded(false);
          }
        }
        if (event.detail.value.length === 0) {
          self.otherReasonsLoaded(false);
        }
        if (self.othersPresent() && self.otherReasonsLoaded()) {
          self.otherReasonsLoaded(true);
        }
      }
    };

    self.returnToApplication = function() {
      if(self.previousPluginComponent() && self.previousPluginComponent() === "document-upload") {
        self.previousPluginComponent("");
        self.showPluginComponent("document-upload");
      } else {
        self.productflowComponent(true);
      }
    };
  };
});
