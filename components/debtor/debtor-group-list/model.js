define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var BillerListModel = function() {
    var modelInitialized = false,
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
      deleteDebtorDeferred, deleteDebtor = function(groupId, payerId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}/payers/domestic/{payerId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "groupId": groupId,
            "payerId": payerId
          };
        baseService.remove(options, params);
      },
      deleteDebtorGroupDeferred, deleteDebtorGroup = function(groupId, deferred) {
        var options = {
            url: "payments/payerGroup/{groupId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            "groupId": groupId
          };
        baseService.remove(options, params);
      },
      getDebtorsListDeferred, getDebtorsList = function(deferred) {
        var options = {
          url: "payments/payerGroup?expand=ALL",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      };
    return {
      init: function() {
        modelInitialized = true;
        return modelInitialized;
      },
      deleteDebtor: function(groupId, payerId) {
        objectInitializedCheck();
        deleteDebtorDeferred = $.Deferred();
        deleteDebtor(groupId, payerId, deleteDebtorDeferred);
        return deleteDebtorDeferred;
      },
      deleteDebtorGroup: function(groupId) {
        objectInitializedCheck();
        deleteDebtorGroupDeferred = $.Deferred();
        deleteDebtorGroup(groupId, deleteDebtorGroupDeferred);
        return deleteDebtorGroupDeferred;
      },
      getDebtorsList: function() {
        objectInitializedCheck();
        getDebtorsListDeferred = $.Deferred();
        getDebtorsList(getDebtorsListDeferred);
        return getDebtorsListDeferred;
      }
    };
  };
  return new BillerListModel();
});