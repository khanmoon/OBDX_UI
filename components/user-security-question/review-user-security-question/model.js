define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewUserSecurityQuestionModel = function() {

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
      addQuesAnsDeferred, addQuesAns = function(deferred, payload) {
        var options = {
          url: "me/securityQuestion",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateQuesAnsDeferred, updateQuesAns = function(deferred, payload) {
        var options = {
          url: "me/securityQuestion",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
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
      addQuesAns: function(payload) {
        addQuesAnsDeferred = $.Deferred();
        addQuesAns(addQuesAnsDeferred, payload);
        return addQuesAnsDeferred;
      },
      updateQuesAns: function(payload) {
        updateQuesAnsDeferred = $.Deferred();
        updateQuesAns(updateQuesAnsDeferred, payload);
        return updateQuesAnsDeferred;
      }
    };
  };
  return new reviewUserSecurityQuestionModel();
});