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
  "ojs/ojtable"
], function(oj, ko, $, reviewUserSecurityQuestionModel, ResourceBundle) {
  "use strict";
  return function(rootParams) {
    var self = this;
    ko.utils.extend(self, rootParams.rootModel);
    self.nls = ResourceBundle;
    rootParams.dashboard.headerName(self.nls.userSecurityQuestion.headers.userSecurityQuestion);
    rootParams.baseModel.registerElement("confirm-screen");
    self.mode = ko.observable(self.params.mode);
    self.quesAnsPayload = self.params.data;
    self.questionList = ko.observableArray();
    self.userQuestionList = ko.observableArray();
    self.questionListMap = {};
    self.userQuestionListMap = {};
    self.isQuestionListLoaded = ko.observable(false);
    self.isUserQuestionListLoaded = ko.observable(false);
    self.back = function() {
      history.back();
    };
    self.reviewTransactionMessage = {
      header: self.nls.userSecurityQuestion.messages.reviewHeader,
      reviewHeader: self.nls.userSecurityQuestion.messages.reviewHeader1
    };
    reviewUserSecurityQuestionModel.fetchQuestions().done(function(data) {
      self.questionList(data.secQueList[0].secQueMapping);
      for (var i = 0; i < self.questionList().length; i++) {
        self.questionListMap[self.questionList()[i].questionId] = self.questionList()[i].question;
      }
      self.isQuestionListLoaded(true);
    });
    reviewUserSecurityQuestionModel.fetchUserQuestions().done(function(data) {
      self.userQuestionList(data);
      for (var i = 0; i < self.userQuestionList().length; i++) {
        self.userQuestionListMap[self.userQuestionList()[i].questionId] = self.userQuestionList()[i].answer;
      }
      self.isUserQuestionListLoaded(true);
    });
    self.confirm = function() {
      var payload = ko.toJSON(self.quesAnsPayload);
      if (self.mode() === "CREATEREVIEW") {
        reviewUserSecurityQuestionModel.addQuesAns(payload).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.userSecurityQuestion.headers.userSecurityQuestion
          }, self);
        });
      } else if (self.mode() === "EDITREVIEW") {
        reviewUserSecurityQuestionModel.updateQuesAns(payload).done(function(data, status, jqXhr) {
          rootParams.dashboard.loadComponent("confirm-screen", {
            jqXHR: jqXhr,
            transactionName: self.nls.userSecurityQuestion.headers.userSecurityQuestion
          }, self);
        });
      }
    };
  };
});