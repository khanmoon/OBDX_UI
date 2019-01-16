define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var updateSecurityQuestionModel = function() {
    var Model = function() {
      this.updateSecurityQuestionPayload = {
        "id": null,
        "secQueMapping": [{
          "questionId": null,
          "question": null,
          "languageId": null,
          "maintenanceId": null
        }]

      };
    }

    ;
    var baseService = BaseService.getInstance();
    var createSecurityQuestionDeferred, createSecurityQuestion = function(data, deferred) {
      var options = {
        url: "security-question/security-question-create-response",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetchJSON(options);
    };
    return {
      createSecurityQuestion: function(data) {
        createSecurityQuestionDeferred = $.Deferred();
        createSecurityQuestion(data, createSecurityQuestionDeferred);
        return createSecurityQuestionDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new updateSecurityQuestionModel();
});