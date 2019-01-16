/**
 * Model for rd-details
 * @param {object} BaseService
 * @return {object} rdDetailsModel
 */
 define(["baseService"], function(BaseService) {
    "use strict";
    var rdDetailsModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetchRdDetails -fetches Recurring Deposit details based on account id.
             *
             * @param {String} accountId account id to fetch RD account details.
             * @returns {Promise}  Returns the promise object
             */
            fetchRdDetails: function(accountId) {
                return baseService.fetch({
                    url: "accounts/deposit/" + accountId + ";module=RD"
                });
            },
            /**
             * fetchpayoutInstructions -fetches payout instructions for recurring deposit.
             *
             * @param {String} accountId account id to fetch RD payout instructions.
             * @returns {Promise}  Returns the promise object
             */
            fetchpayoutInstructions: function(accountId) {
                return baseService.fetch({
                    url: "accounts/deposit/" + accountId + "/payOutInstructions;module=RD"
                });
            },
            /**
             * fetchBankDetails -fetches bank details for recurring deposit.
             *
             * @param {String} url to fetch RD payout instructions.
             * @returns {Promise}  Returns the promise object
             */
            fetchBankDetails: function(url) {
                return baseService.fetch({
                    url: url
                });
            }
        };
    };
    return new rdDetailsModel();
});
