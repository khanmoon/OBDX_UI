define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var debtorSubListModel = function() {
    var Model = function() {
        this.debtorDetails = {
          accountName: null,
          accountNumber: "SEPA",
          bankName: null,
          bankAddress: "SEPA"
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      /* variable to make sure that in case there is no change
       * in model no additional fetch requests are fired.*/
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
      },
      getPayerSubListDeferred, getPayerSubList = function(gId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}/payers",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "groupId": gId
          };
        baseService.fetch(options, params);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getPayerSubList: function(gId) {
        objectInitializedCheck();
        getPayerSubListDeferred = $.Deferred();
        getPayerSubList(gId, getPayerSubListDeferred);
        return getPayerSubListDeferred;
      }
    };
  };
  return new debtorSubListModel();
});