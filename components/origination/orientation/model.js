define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   */
  return function OrientationModel() {
    var
      /*
       * Extending BaseService
       */
      baseService = BaseService.getInstance(),
      /*
       * SubmissionId for fetching selected offer
       */
      submissionId,
      /*
       * Boolean to track if the object has been initialized
       */
      modelInitialized = false,
      saveModelDeffered,

      /**
       * saveModel - description
       *
       * @param  {type} model    description
       * @param  {type} deferred description
       * @return {type}          description
       */
      saveModel = function(model, deferred) {
        var params = {
            submissionId: submissionId
          },
          options = {
            url: "submissions/{submissionId}/cancellation",
            data: model,
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.add(options, params);
      },
      deleteSessionDeffered,

      /**
       * deleteSession - description
       *
       * @param  {type} deferred description
       * @return {type}          description
       */
      deleteSession = function(deferred) {
        var options = {
          url: "session",
          success: function(data) {
            deferred.resolve(data);
          }
        };
        baseService.remove(options);
      },
      errors = {

        /**
         * InitializationException - description
         *
         * @return {type}  description
         */
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),

        /**
         * InvalidApplicantId - description
         *
         * @return {type}  description
         */
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),

        /**
         * ObjectNotInitialized - description
         *
         * @return {type}  description
         */
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },

      /**
       * objectInitializedCheck - description
       *
       * @return {type}  description
       */
      objectInitializedCheck = function() {
        if (!modelInitialized) {
          throw new Error(errors.ObjectNotInitialized);
        }
      };
    return {
      /**
       * Method to initialize the described model, this function can take three params
       * and will throw exception in case no submission id is passed.
       *
       * @param {String} subId - submission id for current application
       * @param {String} applId - applicant id for current user
       * @param {String} profId - profile id for current user
       * @function init
       * @memberOf AssetsInfoModel
       */

      /**
       * init - description
       *
       * @param  {type} subId description
       * @return {type}       description
       */
      init: function(subId) {
        submissionId = subId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        modelInitialized = true;
        return modelInitialized;
      },

      /**
       * saveModel - description
       *
       * @param  {type} model description
       * @return {type}       description
       */
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeffered = $.Deferred();
        saveModel(model, saveModelDeffered);
        return saveModelDeffered;
      },

      /**
       * deleteSession - description
       *
       * @return {type}  description
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      }
    };
  };
});
