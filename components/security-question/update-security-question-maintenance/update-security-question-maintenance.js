define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/security-question",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojinputtext",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, UpdateSecurityQuestionModel, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.securityQuestion.headers.securityQuestion);
    self.back = function() {
      history.back();
    };
    self.actionHeaderheading = ko.observable(self.nls.securityQuestion.headers.EDIT);
    rootParams.baseModel.registerComponent("review-security-question-maintenance", "security-question");
    var getNewKoModel = function() {
      if (!self.updateSecQueModel) {
        var KoModel = UpdateSecurityQuestionModel.getNewModel();
        return ko.mapping.fromJS(KoModel);
      }
      return self.updateSecQueModel;
    };
    if (!self.updateSecQueModel) {
      self.updateSecQueModel = getNewKoModel();
      self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping.removeAll();
    }
    self.updateSecQueModel = getNewKoModel();
    self.createSuccess = ko.observable(false);
    self.validationTracker = ko.observable();
    self.questionNumber = function(index) {
      return index + 1;
    };
    if (self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping().length === 0) {
      for (var i = 0; i < self.params.questionsList.length; i++) {
        self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping.push({
          "question": ko.observable(self.params.questionsList[i].question),
          "languageId": "en_US",
          "maintenanceId": self.params.maintenanceId,
          "questionId": self.params.questionsList[i].questionId,
          "version": self.params.questionsList[i].version
        });
      }
    }
    self.addQuestion = function() {
      self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping.push({
        "question": ko.observable(),
        "languageId": "en_US",
        "maintenanceId": self.params.maintenanceId,
        "questionId": null,
        "version": 0
      });
    };
    self.deleteQuestion = function(index) {
      self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping.splice(index, 1);
    };
    self.isSecQueMappingEmpty = function() {
      if (self.updateSecQueModel.updateSecurityQuestionPayload.secQueMapping().length === 0) {
        return true;
      }
      return false;

    };
    self.save = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater"))) {
        return;
      }
      if (self.isSecQueMappingEmpty()) {
        rootParams.baseModel.showMessages(null, [self.nls.securityQuestion.messages.questionsNotEntered], "ERROR");
        return;
      }
      self.updateSecQueModel.updateSecurityQuestionPayload.id = self.params.maintenanceId;
      self.updateSecQueModel.updateSecurityQuestionPayload.version = self.params.version;
      var payload = self.updateSecQueModel.updateSecurityQuestionPayload;
      rootParams.dashboard.loadComponent("review-security-question-maintenance", {
        "payload": payload,
        "mode": "UPDATE",
        "maintenanceId": self.params.maintenanceId
      }, self);
    };
  };
});