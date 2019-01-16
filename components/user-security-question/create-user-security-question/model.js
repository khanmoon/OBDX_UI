define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var createUserSecurityQuestionModel = function() {
    var Model = function() {
      this.QuesAnsPayload = {
        userSecurityQuestionList: []
      };
    };
    var baseService = BaseService.getInstance();
    var fetchQuestionsDeferred, fetchQuestions = function(deferred) {
        var options = {
          url: "securityQuestion",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      addQuesAnsDeferred, addQuesAns = function(deferred, payload) {
        var options = {
          url: "me/securityQuestion",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
    return {
      fetchQuestions: function() {
        fetchQuestionsDeferred = $.Deferred();
        fetchQuestions(fetchQuestionsDeferred);
        return fetchQuestionsDeferred;
      },
      getNewModel: function() {
        return new Model();
      },
      addQuesAns: function(payload) {
        addQuesAnsDeferred = $.Deferred();
        addQuesAns(addQuesAnsDeferred, payload);
        return addQuesAnsDeferred;
      }
    };
  };
  return new createUserSecurityQuestionModel();
});