define([
  "jquery",
  "baseService", "framework/js/constants/constants"
], function($, BaseService, Constants) {
  "use strict";
  /**
   * Model file for accountsList section. This file contains the model definition
   * for accountsList  section and exports the UserAccounts model which can be used
   * as a component in any form in which user's accounts information are required.
   *
   * @namespace myAccounts~UserAccountsModel
   * @property {String} params -To store the data passed
   * @property {Object} baseService -To store the BaseService object
   * @property {Object} fetchAccountInfoDeferred -To store the deferred object
   */
  var UserAccountsModel = function() {
    var params, baseService = BaseService.getInstance();
    /**
     * Method to fetch Accounts information data.
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchAccountInfoDeferred, fetchAccountInfo = function(deferred) {
      var options = {
        url: "accounts/demandDeposit/",
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/demand-deposits/demand-deposit-list/accounts";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options);
      }
    };
    var fetchBankConfigDeferred, fetchBankConfig = function(deferred) {

      var options = {
        url: "bankConfiguration",
        success: function(data) {
          deferred.resolve(data);
        }
      };
      if (Constants.userSegment === "ADMIN") {
        options.url = "design-dashboard/data/demand-deposits/demand-deposit-list/bank-config";
        baseService.fetchJSON(options);
      } else {
        baseService.fetch(options,params);
      }
    };

    return {
      fetchAccountInfo: function() {
        fetchAccountInfoDeferred = $.Deferred();
        fetchAccountInfo(fetchAccountInfoDeferred);
        return fetchAccountInfoDeferred;
      },
      fetchBankConfig: function() {
        fetchBankConfigDeferred = $.Deferred();
        fetchBankConfig(fetchBankConfigDeferred);
        return fetchBankConfigDeferred;
      }
    };
  };
  return new UserAccountsModel();
});