define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * @namespace CreditCardStructureSolution~CardStructureSolutionModel
   * @class CardStructureSolutionModel
   */
  return function CancelApplicationModel() {
    var Model = function() {
        this.isCompleting = true;
        this.disableInputs = false;
        this.cancelInfo = {
          submissionCancellationCreateRequestDTO: {
            productClass: "",
            currentStep: "",
            cancellationReasonsDTOs: [{
              code: "",
              description: ""
            }]
          }
        };
      },
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
      /**
       * Deferred instance for fetching selected offer.
       */
      selectedReasonDeffered, fetchCancellationReasons = function(deferred, productClass) {
        var params = {
            productClass: productClass
          },
          options = {
            url: "enumerations/submissionCancellationReasons/{productClass}",
            success: function(data) {
              deferred.resolve(data);
            }
          };
        baseService.fetch(options, params);
      },
      saveModelDeffered, saveModel = function(model, deferred) {
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
      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        InvalidApplicantId: function() {
          var message = "";
          message += "\nNo applicant id found, please make sure applicant id is present while initializing the model. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }(),
        ObjectNotInitialized: function() {
          var message = "";
          message += "\nModel has not been initialized. Please initialize the model before setting properties. ";
          message += "\nProper initialization has to be: ";
          message += "\n\n\tModelName.init(\"SubId\"[, \"ApplicantId\"]);";
          return message;
        }()
      },
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
      init: function(subId) {
        submissionId = subId || undefined;
        if (!submissionId) {
          throw new Error(errors.InitializationException);
        }
        modelInitialized = true;
        return modelInitialized;
      },
      /*
       * Fetch offer selected for the product in the submissionId.
       */
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      fetchCancellationReasons: function(productClass) {
        selectedReasonDeffered = $.Deferred();
        fetchCancellationReasons(selectedReasonDeffered, productClass);
        return selectedReasonDeffered;
      },
      saveModel: function(model) {
        objectInitializedCheck();
        saveModelDeffered = $.Deferred();
        saveModel(model, saveModelDeffered);
        return saveModelDeffered;
      }
    };
  };
});