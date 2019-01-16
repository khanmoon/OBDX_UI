define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reviewSecurityQuestionModel = function() {
    var Model = function() {
      this.createSecurityQuestionPayload = {
        "id": null,
        "secQueMapping": [{
          "questionId": null,
          "question": null,
          "languageId": null
        }]

      };
    };
    var baseService = BaseService.getInstance();
    var createSecurityQuestionDeferred, createSecurityQuestion = function(data, deferred) {
        var options = {
          url: "securityQuestion",
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      },
      updateSecurityQuestionDeferred, updateSecurityQuestion = function(data, maintenanceId, deferred) {
        var options = {
          url: "securityQuestion/" + maintenanceId,
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.update(options);
      };
    return {
      createSecurityQuestion: function(data) {
        createSecurityQuestionDeferred = $.Deferred();
        createSecurityQuestion(data, createSecurityQuestionDeferred);
        return createSecurityQuestionDeferred;
      },
      updateSecurityQuestion: function(data, maintenanceId) {
        updateSecurityQuestionDeferred = $.Deferred();
        updateSecurityQuestion(data, maintenanceId, updateSecurityQuestionDeferred);
        return updateSecurityQuestionDeferred;
      },
      getNewModel: function() {
        return new Model();
      }
    };
  };
  return new reviewSecurityQuestionModel();
});