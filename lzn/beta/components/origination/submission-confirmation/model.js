define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";

  /**
   * var SubmissionConfirmationModel - description
   *
   * @return {Object}  description
   */
  var SubmissionConfirmationModel = function() {

    /**
     * var Model - description
     *
     * @return {void}  description
     */
    var Model = function() {
        this.primary = {
          username: "",
          password: "",
          applicantId: "",
          submissionId: ""
        };
        this.coApp = {
          username: "",
          applicantId: "",
          submissionId: {
            displayValue: "",
            value: ""
          }
        };
      },
      baseService = BaseService.getInstance(),

      registerCoAppDeferred,

      /**
       * registerCoApp - description
       *
       * @param  {Object} payload  description
       * @param  {Object} deferred description
       * @return {void}          description
       */
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
      deleteSessionDeffered,
      /**
       * deleteSession - description
       *
       * @param  {Object} deferred description
       * @return {void}          description
       */
      deleteSession = function(deferred) {
        var options = {
            url: "session",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.remove(options);
      };

    return {

      /**
       * getNewModel - description
       *
       * @return {Object}  description
       */
      getNewModel: function() {
        return new Model();
      },

      /**
       * registerCoApp - description
       *
       * @param  {Object} payload description
       * @return {Object}         description
       */
      registerCoApp: function(payload) {
        registerCoAppDeferred = $.Deferred();
        registerCoApp(payload, registerCoAppDeferred);
        return registerCoAppDeferred;
      },
      /**
       * deleteSession - description
       *
       * @return {Object}  description
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      }
    };
  };
  return new SubmissionConfirmationModel();
});
