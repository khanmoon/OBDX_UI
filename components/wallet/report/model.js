define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var reportModel = function() {
    var Model = function() {
        this.updateKYC = {
          "updatedWallets": [{
            "dictionaryArray": null,
            "refLinks": null,
            "walletId": "",
            "partyId": null,
            "salutation": null,
            "firstName": null,
            "lastName": null,
            "emailId": null,
            "mobileNo": null,
            "accountOpeningDate": null,
            "availableBalance": null,
            "kycStatus": "",
            "kycComments": "",
            "createdBy": null,
            "creationDate": null,
            "lastUpdatedBy": null,
            "lastUpdatedDate": null,
            "version": 1
          }]
        };
      },

      baseService = BaseService.getInstance(),

      fetchReportDeferred, fetchReport = function(url, searchParameters, deferred) {
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
            emailId: searchParameters.emailId(),
            userId: searchParameters.userId(),
            fromDate: searchParameters.fromDate(),
            toDate: searchParameters.toDate(),
            status: searchParameters.status(),
            mobile: searchParameters.mobileNumber(),
            currentDate: searchParameters.currentDate,
            transactionType: searchParameters.transactionType()
          };
        baseService.fetch(options, params);
      },
      updateReportDeferred, updateReport = function(payload, deferred) {
        var options = {
          url: "wallets/kyc",
          data: payload,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.update(options);
      },
      getWalletUserIdTypeDeferred, getWalletUserIdType = function(deferred) {
        var options = {
          url: "configurations/base/WalletConfiguration/properties/WALLET_USER_ID_TYPE",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options);
      },
      fetchPDFDeferred, fetchPDF = function(baseURL) {
        var options = {
          url: baseURL + "&media=application/pdf"
        };
        baseService.downloadFile(options);
      },
      fetchGLPDFDeferred, downloadCSV = function(baseURL) {
        var options = {
          url: baseURL
        };
        baseService.downloadFile(options);
      };
    return {
      getNewModel: function(modelData) {
        return new Model(modelData);
      },
      getReport: function(url, searchParameters) {
        fetchReportDeferred = $.Deferred();
        fetchReport(url, searchParameters, fetchReportDeferred);
        return fetchReportDeferred;
      },
      updateReport: function(payload) {
        updateReportDeferred = $.Deferred();
        updateReport(payload, updateReportDeferred);
        return updateReportDeferred;
      },
      getWalletUserIdType: function() {
        getWalletUserIdTypeDeferred = $.Deferred();
        getWalletUserIdType(getWalletUserIdTypeDeferred);
        return getWalletUserIdTypeDeferred;
      },
      fetchPDF: function(baseURL) {
        fetchPDFDeferred = $.Deferred();
        fetchPDF(baseURL, fetchPDFDeferred);
        return fetchPDFDeferred;
      },
      downloadCSV: function(baseURL) {
        fetchGLPDFDeferred = $.Deferred();
        downloadCSV(baseURL, fetchGLPDFDeferred);
        return fetchGLPDFDeferred;
      }
    };
  };
  return new reportModel();
});