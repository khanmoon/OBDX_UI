/**
 * Model for review-amend-rd
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
             * @function amend
             * @param {object} data Payload to be passed to amend RD
             * @param {string} accountId account id of selected account.
             * @param {object} deferred - resolved for successful request
             * @memberOf recurringDepositModel
             * @returns {void}
             * @private
             */
            amendRD = function(data, accountId, deferred) {
                var options = {
                    url: "accounts/deposit/" + accountId,
                    data: data,
                    success: function(data, status, jqXhr) {
                        deferred.resolve(data, status, jqXhr);
                    }
                };
                baseService.update(options);
            };
        return {
            /**
             * Public function to amend RD
             *
             * @param {object} data Payload to be passed to redeem RD
             * @param {string} accountId account id of selected account.
             * @returns {Promise}  Returns the promise object
             */
            amendRD: function(data, accountId) {
                redeemDeferred = $.Deferred();
                amendRD(accountId, data, redeemDeferred);
                return redeemDeferred;
            }
        };
    };
    return new recurringDepositModel();
});