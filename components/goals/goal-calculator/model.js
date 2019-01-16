define([
  "jquery",
  "baseService",
  "framework/js/constants/constants-goals"
], function($, BaseService) {
  "use strict";
  var goalCalculatorViewModel = function() {
    var Model = function() {
        this.goalCalculatorModel = {
          categoryId: null,
          subCategoryId: null,
          targetAmount: {
            currency: null,
            amount: null
          },
          contributionAmount: null,
          initialDepositAmount: {
            currency: null,
            amount: null
          },
          interestRate: null,
          tenure: {
            year: null,
            month: null,
            day: null,
            date: null
          },
          frequency: null,
          interestAmount: null
        };

      },
      modelInitialized = true,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
      calculateDeferred, calculate = function(payload, deferred) {
        var options = {
          url: "goals/calculator",
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

      errors = {
        InitializationException: function() {
          var message = "";
          message += "\nObject can't be initialized without a valid submission Id. ";
          message += "\nPlease make sure the submission id is present.";
          message += "\nProper initialization has to be:";
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
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      calculate: function(payload) {
        objectInitializedCheck();
        calculateDeferred = $.Deferred();
        calculate(payload, calculateDeferred);
        return calculateDeferred;
      }
    };
  };
  return new goalCalculatorViewModel();
});