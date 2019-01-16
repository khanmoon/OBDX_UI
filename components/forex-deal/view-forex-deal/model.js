/** Model for view fores deals list
 * @param {object} BaseService base service instance
 * @return {object} viewForexDealModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    /**
     * In case more than one instance of viewForexDealModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class viewForexDealModel
     * @private
     */

    var viewForexDealModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetches forex deals list for the user
             *
             * @param {String} dealType contains selected deal type as sprot or forward
             * @param {String} rateType contains rate type as Buy or Sell
             * @param {String} currency contains selected currency for filter
             * @param {String} currency2 contains selected currency for filter
             * @param {String} dealID contains Deal Number
             * @param {String} bookingDate contains booking Date
             * @param {String} expiryDate contains Expiry Date
             * @param {String} status conatins status as active or inactive
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDealList: function(dealType, rateType, currency, currency2, dealID, bookingDate, expiryDate, status) {

                return baseService.fetch({
                    url: "forexDeals?dealType={dealType}&rateType={rateType}&currency={currency}&currency2={currency2}&dealId={dealId}&bookingDate={bookingDate}&expiryDate={expiryDate}&status={status}"
                }, {
                    dealType: dealType,
                    rateType: rateType,
                    currency: currency,
                    currency2: currency2,
                    dealId: dealID,
                    bookingDate: bookingDate,
                    expiryDate: expiryDate,
                    status: status
                });
            },

            /**
             * fetches the list of forex currencies
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchCurrency: function() {
                return baseService.fetch({
                    url: "forex/currencyPairs"
                });
            },

             /**
             * fetches dealStatusType
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchStatusTypeList: function() {
                return baseService.fetch({
                    url: "enumerations/dealStatusType"
                });
            },

             /**
             * fetches dealType
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchDealTypeList: function() {
                return baseService.fetch({
                    url: "enumerations/dealType"
                });
            },

            /**
             * fetches dealRateType
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchRateTypeList: function() {
                return baseService.fetch({
                    url: "enumerations/dealRateType"
                });
            },

            /**
             * fetches the Host Date / Current Date
             *
             * @returns {Promise}  Returns the promise object
             */
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            }

        };
    };
    return new viewForexDealModel();
});