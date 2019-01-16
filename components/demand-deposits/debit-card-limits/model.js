define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Manage Limit section
   *
   * @namespace ManageLimit~ManageLimitModel
   * @class
   */
  var ManageLimitModel = function() {

    var debitCardDetailsModel = function() {
        this.accountId = null;
        this.branchId = null;
        this.branchName = null;
        this.debitCardLimit = [{

        }];
        this.debitCardInternationalLimit = [{

        }];
      },
      debitCardLimitModel = function() {
        this.unit = null;
        this.amount = {};
        this.count = null;
        this.limitType = null;
      };
    /**
     * Model file for card Limit section. This file contains the model definition
     * for cardLimit requirements section and exports the ManageLimitModel which can be used
     * as a component in any form in which debit card limit information are required.
     *
     * @namespace ManageLimitModel~ManageLimitModel
     * @property {Object} Params - Object to store the data passed
     * @property {Object} fetchLimitsDeferred - Stores deferred object
     * @property {Object} baseService - Stores BaseService obect
     */
    var params, baseService = BaseService.getInstance();
    /**
     * Method to fetch limits information data.
     * @accountId - unique account number
     * @cardNo - card for which limits need to be fetched
     *  deferred object is resolved once the accounts information list is successfully fetched
     */
    var fetchLimitsDeferred, fetchLimits = function(accountId, cardNo, deferred) {
        params = {
          "accountId": accountId,
          "cardNo": cardNo
        };
        var options = {
          url: "accounts/demandDeposit/{accountId}/debitCards/{cardNo}/limits",
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
        baseService.fetch(options, params);
      },
      updateLimitsDeferred,
      updateLimits = function(accountId, cardNo, payload, deferred) {
        params = {
          "accountId": accountId,
          "cardNo": cardNo
        };
        var options = {
          url: "accounts/demandDeposit/{accountId}/debitCards/{cardNo}/limits/",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      };
    return {
      fetchLimits: function(accountId, cardNo) {
        fetchLimitsDeferred = $.Deferred();
        fetchLimits(accountId, cardNo, fetchLimitsDeferred);
        return fetchLimitsDeferred;
      },
      updateLimits: function(accountId, cardNo, payload) {
        updateLimitsDeferred = $.Deferred();
        updateLimits(accountId, cardNo, payload, updateLimitsDeferred);
        return updateLimitsDeferred;
      },
      getNewDebitCardDetailsModel: function() {
        return new debitCardDetailsModel();
      },
      getNewDebitCardLimitsModel: function() {
        return new debitCardLimitModel();
      }
    };
  };
  return new ManageLimitModel();
});
