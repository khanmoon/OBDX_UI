define([
    "knockout",
    "jquery",

    "./model",
    "ojL10n!resources/nls/security-question",
    "ojs/ojinputtext"
], function(ko, $, SecurityQuestionsModel, locale) {
    "use strict";
    return function(rootParams) {
        var self = this;
        ko.utils.extend(self, rootParams.rootModel);
        self.mappingQuestionIdAndAnswer = [];
        self.locale = locale;
        self.sendQuestionIdAndAnswer = {};
        self.sendQuestionIdAndAnswer.authType = "SEC_QUE";
        self.sendQuestionIdAndAnswer.referenceNo = JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).referenceNo;
        self.actionHeaderheading = ko.observable(self.locale.securityQuestion.headers.securityQuestion);
        self.mappingOfQuestionsAndId = ko.observableArray();
        self.submittedAnswers = [];
        self.questionIds = JSON.parse(self.serverResponse.getResponseHeader("X-CHALLENGE")).questionIDs;
        self.questionPopulated = ko.observable();
        for (var i = 0; i < self.questionIds.length; i++) {
            SecurityQuestionsModel.fetchQuestion(self.questionIds[i]).done(function(idAndQuestion) {
                self.mappingOfQuestionsAndId.push({
                    "questionId": idAndQuestion.securityQuestionMappingDTO.questionId,
                    "question": idAndQuestion.securityQuestionMappingDTO.question,
                    "answer": ko.observable()
                });
                self.questionPopulated(true);
            });
        }
        self.completedSecQuestion = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (self.originalSuccess) {
                return self.originalSuccess.apply(this, Array.prototype.slice.call(arguments));
            }
        };
        self.submitAnswers = function() {
            for (var i = 0; i < self.mappingOfQuestionsAndId().length; i++) {
                self.mappingQuestionIdAndAnswer.push({
                    "questionId": self.mappingOfQuestionsAndId()[i].questionId,
                    "answer": self.mappingOfQuestionsAndId()[i].answer()
                });
            }
            self.sendQuestionIdAndAnswer.questionAnswers = self.mappingQuestionIdAndAnswer;
            self.currentContext.headers["X-CHALLENGE_RESPONSE"] = JSON.stringify(self.sendQuestionIdAndAnswer);
            if (self.isNonce) {
                self.fireRequest(self.currentContext.headers["x-noncecount"], self.sendQuestionIdAndAnswer, self.referenceNumber());
            } else {
                self.currentContext.success = self.completedSecQuestion;
                self.fireRequest(self.currentContext).then(function(data) {
                    self.currentContext.promiseResolve(data);
                });
            }
        };
        self.cancelSecQuestion = function() {
            rootParams.baseModel.onTFAScreen(false);
            if (!rootParams.baseModel.menuNavigationAvailable) {
                return $(document).trigger("2facancelled");
            }
            history.back();
        };
    };
});