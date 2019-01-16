/**
 * Model for create-rd
 * @param1 {object} jquery jquery instance
 * @param2 {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel Modal instance
 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var recurringDepositModel = function() {
    /**
     * In case more than one instance of recurringDepositModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class Model
     * @private
     */
    var baseService = BaseService.getInstance(),
    redeemDeferred,
    /**
       * Method to save the details of redemption of Recurring Deposit
       * deferred object is resolved once the  information  is successfully fetched
       *
       * @function redeem
       * @param {string} accountId account id of selected account.
       * @param {object} data Payload to be passed to redeem RD
       * @param {object} deferred - resolved for successful request
       * @memberOf recurringDepositModel
       * @returns {void}
       * @private
       */
      redeem = function(accountId, data, deferred) {
        var options = {
          url: "accounts/deposit/" + accountId + "/redemptions",
          data: data,
          success: function(data, status, jqXhr) {
            deferred.resolve(data, status, jqXhr);
          }
        };
        baseService.add(options);
      };
      return {
      /**
      * fetchBranch -fetches branch details
      *
      * @param {String} clearingCodeType clearing code type of the code to be verified
      * @param {String} clearingCode clearing code to be verified
      * @returns {Promise}  Returns the promise object
      */
      fetchBranch: function(clearingCodeType, clearingCode) {
        return baseService.fetch({
            url: "financialInstitution/domesticClearingDetails/" + clearingCodeType + "/" + clearingCode
        });
    },
    /**
       * Public function to redeem RD
       *
       * @param {string} accountId account id of selected account.
       * @param {object} data Payload to be passed to redeem RD
       * @returns {Promise}  Returns the promise object
       */
      redeem: function(accountId, data) {
        redeemDeferred = $.Deferred();
        redeem(accountId, data, redeemDeferred);
        return redeemDeferred;
      }
    };
  };
  return new recurringDepositModel();
});
