define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recordListNonFinacialModel = function() {
    var baseService = BaseService.getInstance(),
      getAccountTypesDeferred, getAccountTypes = function(deferred) {
        var options = {
          url: "enumerations/accountTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getPayeeTypesDeferred, getPayeeTypes = function(deferred) {
        var options = {
          url: "enumerations/payeeTypes",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      getRecordStatusDeferred, getRecordStatus = function(deferred) {
        var options = {
          url: "enumerations/recordStatuses",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      listRecordsDeferred, listRecords = function(deferred, PARAMS) {
        var options = {
          url: PARAMS,
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
      getAccountTypes: function() {
        getAccountTypesDeferred = $.Deferred();
        getAccountTypes(getAccountTypesDeferred);
        return getAccountTypesDeferred;
      },
      listRecords: function(PARAMS) {
        listRecordsDeferred = $.Deferred();
        listRecords(listRecordsDeferred, PARAMS);
        return listRecordsDeferred;
      },
      getRecordStatus: function() {
        getRecordStatusDeferred = $.Deferred();
        getRecordStatus(getRecordStatusDeferred);
        return getRecordStatusDeferred;
      },
      getPayeeTypes: function() {
        getPayeeTypesDeferred = $.Deferred();
        getPayeeTypes(getPayeeTypesDeferred);
        return getPayeeTypesDeferred;
      }
    };
  };
  return new recordListNonFinacialModel();
});