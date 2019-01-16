/** Model for fores deal booking
 * @param {object} BaseService base service instance
 * @return {object} forexDealBookingModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    /**
     * In case more than one instance of forexDealBookingModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class forexDealBookingModel
     * @private
     */

    var forexDealBookingModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetches forex deals list for the user
             *
             * @param {String} currency contains selected currency for filter
             * @param {String} currency2 contains selected currency for filter
             * @param {String} dealId contains selected currency for filter
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDealList: function(currency, currency2, dealId) {

                return baseService.fetch({
                    url: "forexDeals?currency={currency}&currency2={currency2}&dealId={dealId}"
                }, {
                    currency: currency,
                    currency2: currency2,
                    dealId: dealId
                });

            },

            /**
             * fetches forex deal for the user
             *
             * @param {String} dealId contains selected currency for filter
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDeal: function(dealId) {

                return baseService.fetch({
                    url: "forexDeals/{dealId}"
                }, {
                    dealId: dealId
                });
            }

        };
    };
    return new forexDealBookingModel();
});