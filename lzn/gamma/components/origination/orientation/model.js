define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   * @return {Object}  description
   */
  return function OrientationModel() {
    /*
     * Extending BaseService
     */
    var baseService = BaseService.getInstance(),
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
       * @param  {Object} model    description
       * @param  {Object} deferred description
       * @return {void}          description
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
      },
      errors = {

        /**
         * InitializationException - description
         *
         * @return {String}  description
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
         * @return {String}  description
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
         * @return {String}  description
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
       * @return {Object}  description
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
       * @return {type}       description
       * @function init
       * @memberOf AssetsInfoModel
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
       * saveModel - Fetch offer selected for the product in the submissionId.
       *
       * @param  {Object} model description
       * @return {Object}       description
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
       * @return {Object}  description
       */
      deleteSession: function() {
        deleteSessionDeffered = $.Deferred();
        deleteSession(deleteSessionDeffered);
        return deleteSessionDeffered;
      }
    };
  };
});
