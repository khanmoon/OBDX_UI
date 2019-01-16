/** Model to fetch details of a particular Deal.
 * @param {object} BaseService base service instance
 * @return {object} viewForexDealDetailsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var viewForexDealDetailsModel = function() {
        var baseService = BaseService.getInstance();
        return {

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
            },

            /**
             * fetches the party details
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party"
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
            }
        };
    };
    return new viewForexDealDetailsModel();
});