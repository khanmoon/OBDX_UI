define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/feedback-capture",
  "ojs/ojinputtext",
  "ojs/ojgauge",
  "ojs/ojradioset",
  "ojs/ojcheckboxset",
  "ojs/ojknockout-validation",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, FeedbackModel, resourceBundle) {
  "use strict";
  return function(params) {
    var self = this;
    self.resource = resourceBundle;
    ko.utils.extend(self, params.rootModel);
    self.showGauge = ko.observable(true);
    self.feedbacktemplateData = ko.observable([]);
    self.feedbackDefinition = ko.observable([]);
    self.templateLoaded = ko.observable(false);
    self.hideOverallquestion = ko.observable(true);
    self.showThankYou = ko.observable(false);
    self.selectedOptions = ko.observable();
    self.comments = ko.observable(null);
    self.templateDefinitionLoaded = ko.observable(false);
    self.ratingW5 = ko.observable(0);
    self.fetchedQuestion = ko.observable("");
    self.fetchedQuestionId = ko.observable();
    self.overallQuestion = "";
    self.showQuestion = ko.observable(false);
    self.fetchedOptions = ko.observable([]);
    self.feedbackEnabled = ko.observable();
    self.ratingColor = ko.observable("#FFD236");
    self.ratingBgColor = ko.observable("#E8E8E8");
    self.customShape = ko.observable();
    self.FetchedTaskCode = "";
    self.nonDefaultFeedback = ko.observable(false);
    self.feedbackLoaded = ko.observable(false);
    params.baseModel.registerElement("modal-window");
    self.ratingValue = ko.observable([{
      id: 1
    },
    {
      id: 2

    },
    {
      id: 3

    },
    {
      id: 4

    },
    {
      id: 5
    }
  ]);

    self.ratingFocus = function () {
     $("#ratingGuage").focus();
    };
    if (params.taskCode) {
      self.FetchedTaskCode = params.taskCode;
      self.feedbacktemplateData(params.feedback.feedbackTemplateDTO[0]);
      self.overallQuestion = self.feedbacktemplateData().templateDescription;
      FeedbackModel.getScaleSVGPath().done(function(item) {
        self.customShape(item.scaleSVG[params.feedback.feedbackTemplateDTO[0].scaleDTO.scaleId - 1].value);
        self.feedbacktemplateData().scaleDTO.dataContent = "data:image/svg+xml;base64," + self.customShape();
        self.templateLoaded(true);
        ko.tasks.runEarly();
        self.feedbackDefinition(params.feedback.feedbackTemplateDTO[0].definitionDTOs[0]);
        self.templateDefinitionLoaded(true);
      });
    } else {
      FeedbackModel.getFeedbackTemplate().done(function(data) {
        if (data.feedbackTemplateDTO) {
          self.FetchedTaskCode = "GENERIC";
          self.feedbacktemplateData(data.feedbackTemplateDTO[0]);
          self.overallQuestion = self.feedbacktemplateData().templateDescription;
          FeedbackModel.getScaleSVGPath().done(function(item) {
            self.customShape(item.scaleSVG[data.feedbackTemplateDTO[0].scaleDTO.scaleId - 1].value);
            self.feedbacktemplateData().scaleDTO.dataContent = "data:image/svg+xml;base64," + self.customShape();
            self.templateLoaded(true);
            ko.tasks.runEarly();
            self.feedbackDefinition(data.feedbackTemplateDTO[0].definitionDTOs[0]);
            self.templateDefinitionLoaded(true);
          });
        }
      });
    }
    self.ratingChangeHandler = function(event) {
      if (event.detail.value) {
        self.selectedOptions([]);
        self.hideOverallquestion(false);
        self.showQuestion(false);
        self.feedbackLoaded(false);
        ko.tasks.runEarly();
        if (!self.feedbackDefinition().ratings) {
          self.nonDefaultFeedback(true);
        } else {
          self.feedbackDefinition().ratings.forEach(function(item) {
            if (parseInt(item.weightId) === event.detail.value) {
              self.fetchedQuestion(item.questionRequestList[0].questionDescription);
              self.fetchedOptions(item.questionRequestList[0].optionsRequestList);
              self.fetchedQuestionId(item.questionRequestList[0].questionId);
              self.showQuestion(true);
              self.nonDefaultFeedback(false);
            }
          });
        }
        self.feedbackLoaded(true);
      }
      else {
        self.selectedOptions([]);
        self.feedbackLoaded(false);
        self.hideOverallquestion(true);
      }
    };
    self.captureFeedback = function() {
      var temp_selectedOptions = [];
      self.fetchedOptions().forEach(function(optionObj) {
    if (optionObj.optionId) {
        self.selectedOptions().forEach(function(optionId) {
          if (optionObj.optionId === optionId) {
            var temp_optionObj = {};
            temp_optionObj.optionId = optionObj.optionId;
            temp_optionObj.optionDescription = optionObj.optionDescription;
            temp_selectedOptions.push(temp_optionObj);
          }
        });
      }
    });
      var sendData = {
        taskId: self.FetchedTaskCode,
        templateId: self.feedbacktemplateData().templateId,
        rating: self.ratingW5(),
        feedbackCaptured: true,
        comments: self.comments(),
        questions: [{
          questionId: self.fetchedQuestionId(),
          questionDescription: self.fetchedQuestion(),
          optionsRequestList: temp_selectedOptions
        }]
      };
      FeedbackModel.captureFeedback(ko.toJSON(sendData)).done(function() {
        self.showThankYou(true);
        setTimeout(function() {
          params.dashboard.openDashBoard();
        }, 3000);
      });
    };
    self.neverAskMeAgain = function() {
      var sendData = null;
      FeedbackModel.getPreference().done(function(data) {
        sendData = data;
        sendData.feedbackEnabled = false;
        delete sendData.status;
        FeedbackModel.neverAskMeAgain(ko.toJSON(sendData)).done(function() {
          params.dashboard.openDashBoard();
        });
      });
    };
  };
});
