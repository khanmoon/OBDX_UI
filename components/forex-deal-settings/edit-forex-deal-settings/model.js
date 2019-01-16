/** Model for edit forex deals list
 * @param {object} BaseService base service instance
 * @return {object} editForexDealSettingsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    /**
     * In case more than one instance of editForexDealSettingsModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class editForexDealSettingsModel
     * @private
     */

    var editForexDealSettingsModel = function() {

        var Model = function() {
                this.settingsModel = {
                    forexDealMaintenanceList: []
                };
            },


            baseService = BaseService.getInstance(),

            /**
             * delete Currency Pair
             * @param1 {string} currency1  currency1 of currency combo to be deleted
             * @param1 {string} currency2  currency2 of currency combo to be deleted
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            deleteCurrencyPairDeffered, deleteCurrencyPair = function(currency1, currency2, deferred) {

                var options = {
                        url: "forexDeals/configurations?currency1={currency1}&currency2={currency2}",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        },
                        error: function(data, status, jqXHR) {
                            deferred.reject(data, status, jqXHR);
                        }
                    },
                    params = {
                        "currency1": currency1,
                        "currency2": currency2
                    };
                baseService.remove(options, params);
            },

            /**
             * update currency pairs
             * @param1 {string} payload  An string containg the data to be sent to host
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            updateCurrencyPairsDeferred, updateCurrencyPairs = function(payload, deferred) {
                var options = {
                    url: "forexDeals/configurations",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.update(options);
            };

        return {
            /**
             * Returns new Model instance
             *
             * @returns {object}  Returns the modelData
             */
            getNewModel: function() {
                return new Model();
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
            },

            deleteCurrencyPair: function(currency1, currency2) {
                deleteCurrencyPairDeffered = $.Deferred();
                deleteCurrencyPair(currency1, currency2, deleteCurrencyPairDeffered);
                return deleteCurrencyPairDeffered;
            },
            updateCurrencyPairs: function(payload) {
                updateCurrencyPairsDeferred = $.Deferred();
                updateCurrencyPairs(payload, updateCurrencyPairsDeferred);
                return updateCurrencyPairsDeferred;
            }


        };
    };
    return new editForexDealSettingsModel();
});