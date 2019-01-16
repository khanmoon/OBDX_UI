define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback",
  "ojs/ojinputtext",
  "ojs/ojbutton",
  "ojs/ojtrain",
  "ojs/ojcheckboxset",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup",
  "ojs/ojgauge",
  "ojs/ojselectcombobox"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  /**
   * File contains the view model for listing of properties realated to db table digx_fw_configallb
   *
   * @property {String}   selectedStepValue          - preference name selected by user and use by the services to find the
   *                                            related value.
   * @property {Boolean}  addAnotherTransactionInput       - Initially self flag is set to false until data is fetched from server
   *                                            and ready to display on UI.
   * @property {Boolean}  globalLoaded        - flag is used to refresh the pagination component whenever the data
   *                                            attached to it is refreshed or changed.
   * @property {Array}    newOptionsRequestList          - Array that maintains the list of new Option fetched from the server
   *                                            and loops over it to display on UI.
   * @property {Array}    weightage - Array to store the currently selected weightage by the user from the list
   *                                            of the weightage
   * @property {Array}  question       - Array to store the currently selected question by the user from the list
   *                                            of the question
   * @property {Array}    newQuestions - Array to store the new Question by the user
   * @property {Array}    options          - Array that maintains the list of options fetched from the server
   *                                            and loops over it to display on UI.
   * @property {String}    selectedStepLabel - preference name selected by user and use by the services to find the
   *                                            related value.
   */

  return function(params) {
    var self = this;
    ko.utils.extend(self, params.rootModel);
    self.resource = resourceBundle;
    self.selectedStepValue = ko.observable("feedback-scale-configuration");
    self.newQuestionsValue = ko.observable("");
    self.newOptionsRequestList = ko.observableArray([]);
    self.weightage = ko.observable([]);
    self.selectedStepLabel = ko.observable(self.resource.selectScale);
    self.question = ko.observable([]);
    self.addAnotherTransactionInput = ko.observable(false);
    self.newQuestions = ko.observable([]);
    self.feedbackUserRole = ko.observable([]);
    self.globalLoaded = ko.observable(false);
    self.reviewTemplate = ko.observable(false);
    self.disableInputsGlobal = ko.observable(false);
    self.disableTrain = ko.observable(false);
    self.selectedScale = ko.observable();
    self.forEdit = ko.observable(true);
    self.newOption = ko.observableArray([]);
    self.options = ko.observable([]);
    self.scaleTypeSelected = ko.observable();
    self.templateId = ko.observable("");
    self.version = ko.observable("");
    self.isViewFlag = ko.observable(false);
    self.hideTemplateInfo = ko.observable(false);
    self.fromApproval = ko.observable(false);
    self.scaleTypeText = ko.observable(self.resource.selectScale);
    self.feedbackHomeDTO = ko.observable();
    self.fetchedTransactions = ko.observable([]);
    self.feedbackOriginalDTO = [];
    if (self.fromReview && self.fromReview()) {
      self.hideTemplateInfo(true);
    }
    if (params.rootModel.feedbackOriginalDTO) {
      self.feedbackOriginalDTO = params.rootModel.feedbackOriginalDTO;
    }
    if (params.rootModel.fetchedTransactions) {
      self.fetchedTransactions(params.rootModel.fetchedTransactions());
    }
    params.baseModel.registerComponent("feedback-template-landing", "feedback");
    params.baseModel.registerComponent("feedback-scale-configuration", "feedback");
    params.baseModel.registerComponent("feedback-question-configurations", "feedback");
    params.baseModel.registerComponent("feedback-transaction-configuration", "feedback");
    params.dashboard.headerName(self.resource.title);
    self.componentsToLoadable = [{
      label: self.resourcetitleForTemplate,
      id: "feedback-template-create"
    }];
    if (params.rootModel.params.templateDetails) {
      FeedbackModel.getFeedbackTemplate(params.rootModel.params.templateDetails.templateId).done(function(data) {
        if (data.feedbackTemplateDTO) {
          if (data.feedbackTemplateDTO[0].definitionDTOs) {
            self.feedbackDefinitionDTO = ko.mapping.fromJS(data.feedbackTemplateDTO[0].definitionDTOs);
            self.fetchedTransactions(data.feedbackTemplateDTO[0].definitionDTOs);
            for (var v = 0; v < data.feedbackTemplateDTO[0].definitionDTOs.length; v++) {
              self.feedbackOriginalDTO.push(data.feedbackTemplateDTO[0].definitionDTOs[v].transactionId);
            }
            self.reviewTemplate(true);
            self.templateId(data.feedbackTemplateDTO[0].templateId);
            self.version(data.feedbackTemplateDTO[0].version);
            var feedbackHomeDTO = {
              templateIdentifier: data.feedbackTemplateDTO[0].templateIdentifier,
              templateName: data.feedbackTemplateDTO[0].templateName,
              templateDescription: data.feedbackTemplateDTO[0].templateName,
              templateId: data.feedbackTemplateDTO[0].templateId,
              version: data.feedbackTemplateDTO[0].version,
              scaleDTO: {
                scaleId: data.feedbackTemplateDTO[0].scaleDTO.scaleId,
                scaleType: self.scaleTypeText() + data.feedbackTemplateDTO[0].scaleDTO.scaleId
              },
              roles: data.feedbackTemplateDTO[0].enterpriseRoles
            };
            self.selectedScale(data.feedbackTemplateDTO[0].scaleDTO.scaleId);
            params.baseModel.registerComponent("feedback-template-create", "feedback");
            if (params.rootModel.params.templateDetails.isView) {
              self.isViewFlag(true);
            } else {
              self.isViewFlag(false);
            }
            params.dashboard.loadComponent("feedback-template-create", {
              feedbackHomeDTO: feedbackHomeDTO,
              feedbackDefinitionDTO: self.feedbackDefinitionDTO(),
              isViewFlag: self.isViewFlag()
            }, self);
            self.forEdit(true);
          }
        }
      });
    } else if (params.rootModel.params.data) {
      self.feedbackReviewHeader = ko.observable(false);
      self.feedbackDefinitionDTO = ko.mapping.fromJS(params.rootModel.transactionDetails().transactionSnapshot.definitionDTOs);
      self.reviewTemplate(true);
      self.templateId(params.rootModel.transactionDetails().transactionSnapshot.templateId);
      self.version(params.rootModel.transactionDetails().transactionSnapshot.version);
      var feedbackHomeDTO = {
        templateIdentifier: params.rootModel.transactionDetails().transactionSnapshot.templateIdentifier,
        templateName: params.rootModel.transactionDetails().transactionSnapshot.templateName,
        templateDescription: params.rootModel.transactionDetails().transactionSnapshot.templateDescription,
        templateId: params.rootModel.transactionDetails().transactionSnapshot.templateId,
        version: params.rootModel.transactionDetails().transactionSnapshot.version,
        scaleDTO: {
          scaleId: params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId,
          scaleType: self.scaleTypeText() + params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId
        },
        roles: params.rootModel.transactionDetails().transactionSnapshot.enterpriseRoles
      };
      self.fromApproval(true);
      self.selectedScale(params.rootModel.transactionDetails().transactionSnapshot.scaleDTO.scaleId);
      params.baseModel.registerComponent("feedback-template-create", "feedback");
      self.feedbackHomeDTO(feedbackHomeDTO);
      self.forEdit(true);
    } else {
      self.globalLoaded(true);
    }
    if (params.rootModel.selectedScale) {
      self.selectedScale(params.rootModel.selectedScale());
    }
    if (params.rootModel.selectedStepValue) {
      self.selectedStepValue(params.rootModel.selectedStepValue());
      self.disableTrain(true);
    }
    if (params.rootModel.params.fromLanding) {
      self.selectedStepValue("feedback-scale-configuration");
      self.disableTrain(true);
    }
    self.stepArray =
      ko.observableArray(
        [{
            label: self.resource.selectScale,
            id: "feedback-scale-configuration",
            visited: false,
            disabled: false
          },
          {
            label: self.resource.selectQuestions,
            id: "feedback-question-configurations",
            visited: false,
            disabled: true
          },
          {
            label: self.resource.linkTransaction,
            id: "feedback-transaction-configuration",
            visited: false,
            disabled: true
          }
        ]);
    if (params.rootModel.fromReview) {
      if (params.rootModel.fromReview()) {
        for (var j = 0; j < self.stepArray().length; j++) {
          self.stepArray()[j].disabled = false;
        }
      }
    }
    self.backFromScale = function() {
      self.selectedScale(params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId);
      self.reviewTemplate(false);
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId = self.selectedScale();
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType = self.scaleTypeText() + self.selectedScale();
      params.dashboard.loadComponent("feedback-template-landing", {
        feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
        feedbackDefinitionDTO: self.feedbackDefinitionDTO()
      }, self);
    };
    self.saveToReview = function() {
      self.reviewTemplate(true);
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleId = self.selectedScale();
      params.rootModel.params.feedbackHomeDTO.scaleDTO.scaleType = self.scaleTypeText() + self.selectedScale();
      params.dashboard.loadComponent("feedback-template-create", {
        feedbackHomeDTO: params.rootModel.params.feedbackHomeDTO,
        feedbackDefinitionDTO: self.feedbackDefinitionDTO()
      }, self);
    };
    self.nextStep = function() {
      var tracker = document.getElementById("tracker");
      var itrain = document.getElementById("train");
      if (tracker.valid === "valid") {
        self.globalLoaded(false);
        for (var j = 0; j < itrain.steps.length; j++) {
          if (itrain.selectedStep === itrain.steps[j].id) {
            itrain.steps[j].visited = true;
            itrain.steps[j].disabled = false;
            if (j < 2) {
              itrain.steps[j + 1].visited = true;
              itrain.steps[j + 1].disabled = false;
            }
            break;
          }
        }
        ko.tasks.runEarly();
        var loadIndex = 0;
        for (var i = 0; i < self.stepArray().length; i++) {
          if (self.stepArray()[i].id === self.selectedStepValue()) {
            loadIndex = i + 1;
            break;
          }
        }
        self.selectedStepValue(self.stepArray()[loadIndex].id);
        self.globalLoaded(true);
      } else {
        tracker.showMessages();
        tracker.focusOn("@firstInvalidShown");
      }
    };
    self.previousStep = function() {
      self.globalLoaded(false);
      var itrain = document.getElementById("train");
      for (var j = 0; j < itrain.steps.length; j++) {
        if (itrain.selectedStep === itrain.steps[j].id) {
          itrain.steps[j].visited = true;
          itrain.steps[j].disabled = false;
          if (j > 0) {
            itrain.steps[j - 1].visited = true;
            itrain.steps[j - 1].disabled = false;
          }
          break;
        }
      }
      ko.tasks.runEarly();
      var loadIndex = 0;
      for (var i = 0; i < self.stepArray().length; i++) {
        if (self.stepArray()[i].id === self.selectedStepValue()) {
          loadIndex = i - 1;
          break;
        }
      }
      self.selectedStepValue(self.stepArray()[loadIndex].id);
      self.globalLoaded(true);
    };
  };
});
