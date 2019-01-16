define([
  "ojs/ojcore",
  "knockout",
  "jquery",
  "./model",
  "ojL10n!resources/nls/user-security-question",
  "ojs/ojselectcombobox",
  "ojs/ojknockout-validation",
  "ojs/ojpagingcontrol",
  "ojs/ojknockout",
  "ojs/ojnavigationlist",
  "ojs/ojarraytabledatasource",
  "ojs/ojtable",
  "ojs/ojvalidationgroup"
], function(oj, ko, $, createUserSecurityQuestionModel, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    var getNewKoModel = function() {
      var KoModel = createUserSecurityQuestionModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.mode = ko.observable(self.params.mode);
    rootParams.baseModel.registerComponent("review-user-security-question", "user-security-question");
    rootParams.dashboard.headerName(self.nls.userSecurityQuestion.headers.userSecurityQuestion);
    self.validationTracker = ko.observable();
    var allQuestionList = null;
    if (!self.previousState)
      self.questionListMap = ko.observableArray();
    self.isQuestionListLoaded = ko.observable(false);
    self.refresh = ko.observable(true);

    self.back = function() {
      self.previousState = null;
      history.back();
    };
    self.questionNumber = function(index) {
      return index + 1;
    };
    self.valueChangeHandler = function(index, event) {
      if (event.detail.value && event.detail.trigger) {
        var questionRemovedFromMap = null;

        for (var j = 0; j < allQuestionList.length; j++) {
          if (event.detail.previousValue === allQuestionList[j].questionId) {
            questionRemovedFromMap = allQuestionList[j];
          }
        }
        for (var i = 0; i < self.questionListMap().length; i++) {
          if (i !== index && ((event.detail.previousValue !== self.questionListMap()[i].questionId()) || !self.questionListMap()[i].questionId())) {
            self.questionListMap()[i].availableQuestionList.remove(function(object) {
              return object.questionId === event.detail.value;
            });
            if (questionRemovedFromMap) {
              self.questionListMap()[i].availableQuestionList.push(questionRemovedFromMap);
            }
          } else {
            self.questionListMap()[i].questionId(event.detail.value);
            self.questionListMap()[i].answer("");
          }
        }
        self.reload();
      }
    };
    createUserSecurityQuestionModel.fetchQuestions().done(function(data) {
      allQuestionList = data.secQueList[0].secQueMapping;
      if (!self.previousState) {
        for (var i = 0; i < self.params.data(); i++) {
          var questionAvilableOptionsList = Object.assign([], allQuestionList);
          self.questionListMap.push({
            questionId: ko.observable(),
            availableQuestionList: ko.observableArray(questionAvilableOptionsList),
            answer: ko.observable("")
          });
        }
      }
      self.isQuestionListLoaded(true);
    });
    self.showReviewScreen = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater")))
        return;
      if (!rootParams.baseModel.showComponentValidationErrors(self.validationTracker())) {
        return;
      }
      self.quesAnsPayload = getNewKoModel().QuesAnsPayload;
      for (var k = 0; k < self.questionListMap().length; k++) {
        self.quesAnsPayload.userSecurityQuestionList.push({
          questionId: self.questionListMap()[k].questionId(),
          answer: self.questionListMap()[k].answer()
        });
      }
      for (var i = 0; i < self.quesAnsPayload.userSecurityQuestionList().length; i++) {
        self.quesAnsPayload.userSecurityQuestionList()[i].questionId = self.quesAnsPayload.userSecurityQuestionList()[i].questionId + "";
        for (var j = i + 1; j < self.quesAnsPayload.userSecurityQuestionList().length; j++) {
          self.quesAnsPayload.userSecurityQuestionList()[j].questionId = self.quesAnsPayload.userSecurityQuestionList()[j].questionId + "";
          if (self.quesAnsPayload.userSecurityQuestionList()[i].questionId === self.quesAnsPayload.userSecurityQuestionList()[j].questionId) {
            rootParams.baseModel.showMessages(null, [self.nls.userSecurityQuestion.messages.duplicateQuestions], "INFO");
            return;
          }
        }
      }
      if (rootParams.dashboard.userData.firstLoginFlowDone) {
        rootParams.dashboard.loadComponent("review-user-security-question", {
          mode: "CREATEREVIEW",
          data: self.quesAnsPayload
        }, self);
      } else {
        createUserSecurityQuestionModel.addQuesAns(ko.toJSON(self.quesAnsPayload)).done(function() {
          self.loadNextComponent();
        });
      }
    };
    self.reload = function() {
      self.refresh(false);
      ko.tasks.runEarly();
      self.refresh(true);
    };
  };
});