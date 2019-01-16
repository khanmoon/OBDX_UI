define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  /**
   * Model for Manage Debit Card details
   *
   * @namespace ManageCard~ManageCardModel
   * @class
   */
  var ManageCardModel = function() {
    var debitCardDetailsModel = function() {
      this.accountId = null;
      this.branchId = null;
      this.branchName = null;
      this.cardNo = null;
      this.cardHolderName = null;
      this.expiryDate = null;
      this.cardStatus = null;
      this.isInternationalUsage = null;
    };

    /**
     * Model file for debit card details. This file contains the model definition
     * for debit card and exports the ManageCardModel which can be used
     * as a component in any form in which debit card information are required.
     *
     * @namespace ManageCardModel~ManageCardModel
     * @property {Object} Params - Object to store the data passed
     * @property {Object} updateInternationalUsageDeferred - Stores deferred object
     * @property {Object} baseService - Stores BaseService obect
     */
    var params, baseService = BaseService.getInstance();
    /**
     * Method to update international usage of debit card.
     * @cardNo - card for which limits need to be fetched
     * @DebitCardDetailsDTO - Debit card details payload
     *  deferred object is resolved once the debit card information is successfully updated
     */
    var updateInternationalUsageDeferred, updateInternationalUsage = function(accountId, cardNo, payload, deferred) {
        params = {
          "accountId": accountId,
          "cardNo": cardNo
        };
        var options = {
          url: "accounts/demandDeposit/" + accountId + "/debitCards/" + cardNo + "/internationalusage/",
          data: payload,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.update(options, params);
      },
      fetchDebitCardDetailsDeferred, fetchDebitCardDetails = function(accountId, cardNo, deferred) {
        var options = {
          url: "accounts/demandDeposit/" + accountId + "/debitCards/" + cardNo,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          },
          error: function(data, status, jqXhr) {
            deferred.reject(data, status, jqXhr);
          }
        };
        baseService.fetch(options);
      };
    return {
      updateInternationalUsage: function(accountId, cardNo, payload) {
        updateInternationalUsageDeferred = $.Deferred();
        updateInternationalUsage(accountId, cardNo, payload, updateInternationalUsageDeferred);
        return updateInternationalUsageDeferred;
      },
      fetchDebitCardDetails: function(accountId, cardNo) {
        fetchDebitCardDetailsDeferred = $.Deferred();
        fetchDebitCardDetails(accountId, cardNo, fetchDebitCardDetailsDeferred);
        return fetchDebitCardDetailsDeferred;
      },
      getNewDebitCardDetailsModel: function() {
        return new debitCardDetailsModel();
      }
    };
  };
  return new ManageCardModel();
});