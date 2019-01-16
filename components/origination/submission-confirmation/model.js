define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var SubmissionConfirmationModel = function() {
    var Model = function() {
        this.primary = {
          username: "",
          password: "",
          partyId: "",
          submissionId: ""
        };
        this.coApp = {
          username: "",
          partyId: "",
          submissionId: {
            displayValue: "",
            value: ""
          }
        };
      },
      baseService = BaseService.getInstance(),

      registerCoAppDeferred,
      registerCoApp = function(payload, deferred) {
        var options = {
          url: "registration/prospect/notification",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.add(options);
      },
      deleteSessionDeffered, deleteSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      };
    return {
      getNewModel: function() {
        return new Model();
      },
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      },
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);
        return registerCoAppDeferred;
      }
    };
  };
  return new SubmissionConfirmationModel();
});