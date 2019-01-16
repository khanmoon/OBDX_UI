define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recordListFinancialModel = function() {
    var baseService = BaseService.getInstance(),
      getCurrencyTypesDeferred, getCurrencyTypes = function(deferred) {
        var options = {
          url: "payments/currencies?type=PC_F_IT",
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
      getPaymentTypesDeferred, getPaymentTypes = function(deferred) {
        var options = {
          url: "enumerations/transactionTypes?financial=Y",
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
      },
      downloadEReceiptDeferred, downloadEReceipt = function(deferred, fileRefId, recRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/records/{recRefId}?media={media}&mediaFormat={mediaFormat}",
            success: function(data) {
              deferred.resolve(data);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId,
            "recRefId": recRefId,
            "media": "application/pdf",
            "mediaFormat": "pdf"
          };
        baseService.downloadFile(options, params);
      },
      deleteRecordsDeferred,
      deleteRecords = function(deferred, fileRefId, recordRefId) {
        var options = {
            url: "fileUploads/files/{fileRefId}/records/{recordRefId}",
            success: function(result, status, xhr) {
              deferred.resolve(result, status, xhr);
            },
            error: function(data) {
              deferred.reject(data);
            }
          },
          params = {
            "fileRefId": fileRefId,
            "recordRefId": recordRefId

          };
        baseService.remove(options, params);
      };
    return {
      getCurrencyTypes: function() {
        getCurrencyTypesDeferred = $.Deferred();
        getCurrencyTypes(getCurrencyTypesDeferred);
        return getCurrencyTypesDeferred;
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
      getPaymentTypes: function() {
        getPaymentTypesDeferred = $.Deferred();
        getPaymentTypes(getPaymentTypesDeferred);
        return getPaymentTypesDeferred;
      },
      downloadEReceipt: function(fileRefId, recRefId) {
        downloadEReceiptDeferred = $.Deferred();
        downloadEReceipt(downloadEReceiptDeferred, fileRefId, recRefId);
        return downloadEReceiptDeferred;
      },
      deleteRecords: function(fileRefId, recordRefId) {
        deleteRecordsDeferred = $.Deferred();
        deleteRecords(deleteRecordsDeferred, fileRefId, recordRefId);
        return deleteRecordsDeferred;
      }
    };
  };
  return new recordListFinancialModel();
});