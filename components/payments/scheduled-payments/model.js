define([
  "jquery",
  "baseService"

], function($, BaseService) {
  "use strict";
  var ScheduledPaymentsInfoModel = function() {
    var Model = function() {
        this.cancelModel = {
          "instructionType": null
        };
      },
      modelInitialized = false,
      baseService = BaseService.getInstance(),
      initiateCancelSIDeferred, initiateCancelSI = function(id, payload, deferred) {
        var options = {
            url: "payments/instructions/cancellation/{externalReferenceId}",
            data: payload,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            externalReferenceId: id
          };
        baseService.add(options, params);
      },
      verifyCancelSIDeferred, verifyCancelSI = function(id, deferred) {
        var options = {
            url: "payments/instructions/cancellation/{externalReferenceId}",
            success: function(data, status, jqXHR) {
              deferred.resolve(data, status, jqXHR);
            },
            error: function(data, status, jqXHR) {
              deferred.reject(data, status, jqXHR);
            }
          },
          params = {
            externalReferenceId: id
          };
        baseService.patch(options, params);
      },
      fetchAccountDataDeferred, fetchAccountData = function(taskCode, deferred) {
        var params = {
            taskCode: taskCode
          },
          url = "accounts/demandDeposit";
        if (taskCode) {
          url += "?taskCode={taskCode}";
        }
        var options = {
          url: url,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      getHostDateDeferred, getHostDate = function(deferred) {

        var options = {
          url: "payments/currentDate",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getUpcomingPaymentsListDeferred, getUpcomingPaymentsList = function(fromDate, toDate, accountId, url, deferred) {
        var options = {
            url: url,
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            fromDate: fromDate,
            toDate: toDate,
            accountId: accountId
          };
        baseService.fetch(options, params);
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
      initiateCancelSI: function(refId, payload) {
        objectInitializedCheck();
        initiateCancelSIDeferred = $.Deferred();
        initiateCancelSI(refId, payload, initiateCancelSIDeferred);
        return initiateCancelSIDeferred;
      },
      verifyCancelSI: function(refId) {
        objectInitializedCheck();
        verifyCancelSIDeferred = $.Deferred();
        verifyCancelSI(refId, verifyCancelSIDeferred);
        return verifyCancelSIDeferred;
      },
      getUpcomingPaymentsList: function(fromDate, toDate, accountId, url) {
        objectInitializedCheck();
        getUpcomingPaymentsListDeferred = $.Deferred();
        getUpcomingPaymentsList(fromDate, toDate, accountId, url, getUpcomingPaymentsListDeferred);
        return getUpcomingPaymentsListDeferred;
      },
      fetchAccountData: function(taskCode) {
        fetchAccountDataDeferred = $.Deferred();
        fetchAccountData(taskCode, fetchAccountDataDeferred);
        return fetchAccountDataDeferred;
      },
      getHostDate: function() {
        objectInitializedCheck();
        getHostDateDeferred = $.Deferred();
        getHostDate(getHostDateDeferred);
        return getHostDateDeferred;
      }
    };
  };
  return new ScheduledPaymentsInfoModel();
});