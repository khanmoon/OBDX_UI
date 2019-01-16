/**
 * Model for forex-deal-create
 *
 * @param {object} $ instance
 * @param {object} BaseService instance
 * @return {object} forexDealTransactionsModel
 */
define([
    "framework/js/constants/constants",
    "baseService"
], function (Constants, BaseService) {
    "use strict";

    var forexDealTransactionsModel = function () {
        var baseService = BaseService.getInstance();

        return {
            /**
             * fetches exchangeRate
             *
             * @param {object} view data containing view
             * @param {object} fromDate data containing the from date of transactions
             * @param {object} toDate data containing the to date of transactions
             * @returns {Promise}  Returns the promise object
             */
            getTransactionList: function (view, fromDate, toDate) {
                return baseService.fetch({
                    url: "transactions?view={view}&discriminator=FOREX_DEAL&fromDate={fromDate}&toDate={toDate}&roleType={roleType}"
                }, {
                    "view": view,
                    "fromDate": fromDate,
                    "toDate": toDate,
                    "roleType": Constants.userSegment === "ADMIN" ? "A" : Constants.userSegment === "CORPADMIN" ? "PA" : "P"
                });
            }
        };
    };
    return new forexDealTransactionsModel();
});