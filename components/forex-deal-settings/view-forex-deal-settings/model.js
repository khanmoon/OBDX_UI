/** Model for view forex deals settings
 * @param {object} BaseService base service instance
 * @return {object} viewForexDealSettingsModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    /**
     * In case more than one instance of viewForexDealSettingsModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class viewForexDealSettingsModel
     * @private
     */

    var viewForexDealSettingsModel = function() {


        var baseService = BaseService.getInstance();

        return {

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
             * fetches the list of forex currencies from DB
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchCurrencyPairs: function() {
                return baseService.fetch({
                    url: "forexDeals/configurations"
                });
            },

            /**
             * fetches the forex deal timer flag
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDealTimerFlag: function() {
                return baseService.fetch({
                    url: "configurations/base/dayoneconfig/properties/FOREX_DEAL_TIMER"
                });
            }

        };
    };
    return new viewForexDealSettingsModel();
});