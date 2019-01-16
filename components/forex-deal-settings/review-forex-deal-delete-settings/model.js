/** Model for review forex deal delete settings
 * @param {object} BaseService base service instance
 * @return {object} reviewForexDeleteSettingsModel
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";

    var reviewForexDeleteSettingsModel = function() {

        var baseService = BaseService.getInstance();

        return {
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
    return new reviewForexDeleteSettingsModel();
});