define(["baseService", "jquery", "framework/js/constants/constants"], function(BaseService, $, Constants) {
  "use strict";
  /**
   * Model file for Selected Account detail section. This file contains the model definition
   * for Details section and exports the AccountSummaryModel model which can be used
   * as a component in any form in which specific account detail information are required.
   * @namespace AccountSummaryModel~AccountSummaryModel
   * @property {Object} getSpecificAccountDetailDeferred -To store the deferred object
   * @property {Object} params -To store data passed
   * @property {Object} baseService -To store baseService object
   */
  var AccountSummaryModel = function() {
    var baseService = BaseService.getInstance();
    /**
     * Method to fetch Accounts details data.
     * @function getAccountDetails
     * @param {Deferred} deferred jQuery Deferred.
     * @returns {Deferred} deferred is returned..
     */
    var getAccountDetailsDeferred, getAccountDetails = function(deferred) {
      var options = {
        url: "accounts/demandDeposit?status=ACTIVE&status=DORMANT",
        selfLoader: true,
        success: function(data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/demand-deposits/account-summary";
        baseService.fetchJSON(options);
    } else {
        baseService.fetch(options);
    }
    };
    /**
    /**
     * Method to fetch specific Accounts details data.
     * @function downloadAccounts
     * @param {Deferred} deferred jQuery Deferred.
     * @returns {Deferred} deferred is returned..
     */
    var downloadAccountsDeferred, downloadAccounts = function(deferred) {
      var options = {
        url: "accounts/demandDeposit?media=application/pdf",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.downloadFile(options);
    };
    return {
      getAccountDetails: function() {
        getAccountDetailsDeferred = $.Deferred();
        getAccountDetails(getAccountDetailsDeferred);
        return getAccountDetailsDeferred;
      },
      downloadAccounts: function() {
        downloadAccountsDeferred = $.Deferred();
        downloadAccounts(downloadAccountsDeferred);
        return downloadAccountsDeferred;
      }
    };
  };
  return new AccountSummaryModel();
});
