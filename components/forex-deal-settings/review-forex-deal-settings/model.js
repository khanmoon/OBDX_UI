/** Model for review forex deals settings
 * @param {object} BaseService base service instance
 * @return {object} reviewForexDealSettingsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    /**
     * In case more than one instance of reviewForexDealSettingsModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class reviewForexDealSettingsModel
     * @private
     */
    var reviewForexDealSettingsModel = function() {
        /**
         * In case more than one instance of reviewForexDealSettingsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        var Model = function() {
                this.settingsModel = {
                    forexDealMaintenanceList: []
                };
            },

            baseService = BaseService.getInstance(),
            confirmSettingsDeferred,
            /**
             * adds or creates the forex deal settings in DB
             * @param {String} payload  An string containg the data to be sent to host
             * @param {String} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            confirmSettings = function(payload, deferred) {
                var options = {
                    url: "forexDeals/configurations",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.add(options);
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
             * Returns deferred
             * @param {String} payload  A string containg the data to be sent to host
             * @returns {object}  Returns the modelData
             */
            confirmSettings: function(payload) {
                confirmSettingsDeferred = $.Deferred();
                confirmSettings(payload, confirmSettingsDeferred);
                return confirmSettingsDeferred;
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
    return new reviewForexDealSettingsModel();
});