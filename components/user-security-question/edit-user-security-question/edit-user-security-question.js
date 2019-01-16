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
], function(oj, ko, $, editUserSecurityQuestionModel, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    var getNewKoModel = function() {
      var KoModel = editUserSecurityQuestionModel.getNewModel();
      return ko.mapping.fromJS(KoModel);
    };
    self.mode = ko.observable(self.params.mode);
    rootParams.baseModel.registerComponent("review-user-security-question", "user-security-question");
    rootParams.dashboard.headerName(self.nls.userSecurityQuestion.headers.userSecurityQuestion);
    self.validationTracker = ko.observable();
    var allQuestionList = null;
    if (!self.previousState)
      self.questionListMap = ko.observableArray();
    self.isUserQuestionListLoaded = ko.observable(false);
    self.refresh = ko.observable(true);

    self.questionNumber = function(index) {
      return index + 1;
    };
    self.backToView = function() {
      self.previousState = null;
      var navData = {
        module: "view-user-security-question",
        id: "setSecurityQuestion"
      };
      rootParams.dashboard.loadComponent("security-menu", {
        data: navData
      }, self);
    };
    self.valueChangeHandler = function(event) {
      if (event.detail.value && event.detail.trigger) {
        var questionRemovedFromMap = null;

        for (var i = 0; i < allQuestionList.length; i++) {
          if (event.detail.previousValue === allQuestionList[i].questionId) {
            questionRemovedFromMap = allQuestionList[i];
          }
        }
        for (var j = 0; j < self.questionListMap().length; j++) {
          if (event.detail.previousValue !== self.questionListMap()[j].questionId()) {
            self.questionListMap()[j].availableQuestionList.remove(function(object) {
              return object.questionId === event.detail.value;
            });
            self.questionListMap()[j].availableQuestionList.push(questionRemovedFromMap);
          } else {
            self.questionListMap()[j].questionId(event.detail.value);
            self.questionListMap()[j].answer("");
          }
        }
        self.reload();
      }
    };
    editUserSecurityQuestionModel.fetchQuestions().done(function(data) {
      allQuestionList = data.secQueList[0].secQueMapping;
      self.getUserSecurityQuestion(true);
    });

    self.getUserSecurityQuestion = function(isQuestionListLoaded) {
      if (isQuestionListLoaded) {
        editUserSecurityQuestionModel.fetchUserQuestions().done(function(data) {
          if (!self.previousState) {
            var selectedQuestionAnsList;
            var selectedQuestionsList = [];
            var notSelectedQuestionList = [];
            selectedQuestionAnsList = data.userSecurityQuestionDTOList;
            for (var i = 0; i < allQuestionList.length; i++) {
              var isContains = false;
              for (var j = 0; j < selectedQuestionAnsList.length; j++) {
                if (allQuestionList[i].questionId === selectedQuestionAnsList[j].questionId) {
                  selectedQuestionsList.push({
                    question: allQuestionList[i],
                    answer: ""
                  });
                  isContains = true;
                  break;
                }
              }
              if (!isContains) {
                notSelectedQuestionList.push(allQuestionList[i]);
              }
            }

            for (var k = 0; k < selectedQuestionsList.length; k++) {
              var questionAvilableOptionsList = Object.assign([], notSelectedQuestionList);
              questionAvilableOptionsList.push(selectedQuestionsList[k].question);
              self.questionListMap.push({
                questionId: ko.observable(selectedQuestionsList[k].question.questionId),
                availableQuestionList: ko.observableArray(questionAvilableOptionsList),
                answer: ko.observable(selectedQuestionsList[k].answer)
              });
            }
          }
          self.isUserQuestionListLoaded(true);
        });
      }
    };
    self.showReviewScreen = function() {
      if (!rootParams.baseModel.showComponentValidationErrors(document.getElementById("TaskValidater")))
        return;
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
      rootParams.dashboard.loadComponent("review-user-security-question", {
        mode: "EDITREVIEW",
        data: self.quesAnsPayload
      }, self);
    };
    self.reload = function() {
      self.refresh(false);
      ko.tasks.runEarly();
      self.refresh(true);
    };
  };
});