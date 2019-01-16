define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var viewUserSecurityQuestionModel = function() {

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
      },
      fetchQuestionConfigurationDeferred, fetchQuestionConfiguration = function(deferred, userSegment) {
        var options = {
            url: "me/securityQuestion/noOfQuestions",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "userSegment": userSegment
          };
        baseService.fetch(options, params);
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
      fetchQuestionConfiguration: function(userSegment) {
        fetchQuestionConfigurationDeferred = $.Deferred();
        fetchQuestionConfiguration(fetchQuestionConfigurationDeferred, userSegment);
        return fetchQuestionConfigurationDeferred;
      }
    };
  };
  return new viewUserSecurityQuestionModel();
});