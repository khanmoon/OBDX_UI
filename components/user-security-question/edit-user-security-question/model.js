define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var editUserSecurityQuestionModel = function() {
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
      fetchUserQuestionsDeferred, fetchUserQuestions = function(deferred) {
        var options = {
          url: "me/securityQuestion",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      fetchQuestions: function() {
        fetchQuestionsDeferred = $.Deferred();
        fetchQuestions(fetchQuestionsDeferred);
        return fetchQuestionsDeferred;
      },
      fetchUserQuestions: function() {
        fetchUserQuestionsDeferred = $.Deferred();
        fetchUserQuestions(fetchUserQuestionsDeferred);
        return fetchUserQuestionsDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new editUserSecurityQuestionModel();
});