define([
  "baseService",
  "jquery"
], function(BaseService, $) {
  "use strict";
  /**
   * This is a model for favorites
   * @return {Object} containing functions related to favorite transactions
   */
  var FavoritesModel = function() {

    var modelInitialized = false,
      baseService = BaseService.getInstance(),

      fireBatchDeferred, fireBatch = function(batchData, batchId, deferred) {
        var options = {
          headers: {
            "BATCH_ID": batchId
          },
          url: "batch",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.batch(options, {}, batchData);
      },
      deleteFavouriteDeferred, deleteFavourite = function(paymentId, transactionType, deferred) {

        var options = {
          url: "payments/favorites?transactionId=" + paymentId + "&&type=" + transactionType,
          success: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          },
          error: function(data, status, jqXHR) {
            deferred.resolve(data, status, jqXHR);
          }
        };
        baseService.remove(options);
      },
      getFavoritesDeferred, getFavoritesDetails = function(deferred) {
        var options = {
          url: "payments/favorites",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
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

      deleteFavourite: function(paymentId, transactionType) {

        deleteFavouriteDeferred = $.Deferred();
        deleteFavourite(paymentId, transactionType, deleteFavouriteDeferred);
        return deleteFavouriteDeferred;
      },
      getFavoritesDetails: function() {
        objectInitializedCheck();
        getFavoritesDeferred = $.Deferred();
        getFavoritesDetails(getFavoritesDeferred);
        return getFavoritesDeferred;
      },
      fireBatch: function(batchData, batchId) {
        objectInitializedCheck();
        fireBatchDeferred = $.Deferred();
        fireBatch(batchData, batchId, fireBatchDeferred);
        return fireBatchDeferred;
      }
    };
  };
  return new FavoritesModel();
});
