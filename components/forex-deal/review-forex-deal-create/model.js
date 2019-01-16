/**
 * Model for review-forex-deal-create
 * @param {object} BaseService
 * @return {object} forexDealModel
 */
define([
    "baseService", "jquery"
], function(BaseService, $) {
    "use strict";
    /**
     * In case more than one instance of forexDealModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class reviewForexDealModel
     * @private
     */
    var reviewForexDealModel = function() {
        var baseService = BaseService.getInstance(),
            /**
             * confirm forex deal
             * @param1 {string} payload  An string containg the data to be sent to host
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            confirmForexDealDeferred, confirmForexDeal = function(payload, deferred) {
                var options = {
                    url: "forexDeals",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.add(options);
            },
            /**
             * confirm forex deal
             * @param1 {string} payload  An string containg the data to be sent to host
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            forexDealBookingDeferred, forexDealBooking = function(id,deferred) {
                var options = {
                    url: "forexDeals/{id}",
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                },
                params = {
                        id: id
                    };
                baseService.update(options,params);
            };

        return {
            confirmForexDeal: function(payload) {
                confirmForexDealDeferred = $.Deferred();
                confirmForexDeal(payload, confirmForexDealDeferred);
                return confirmForexDealDeferred;
            },
            forexDealBooking: function(id) {
                forexDealBookingDeferred = $.Deferred();
                forexDealBooking(id, forexDealBookingDeferred);
                return forexDealBookingDeferred;
            },
            /**
             * fetches currencyPairs
             *
             * @param {object} data data containing curequest details
             * @returns {Promise}  Returns the promise object
             */
            getCurrencyPairs: function(data) {
                return baseService.fetch({
                    url: "forexDeals/configurations?currency1={ccy1}&currency2={ccy2}"
                }, {
                    ccy1: data.curr1,
                    ccy2: data.curr2
                });
            },
            /**
             * fetches exchangeRate
             *
             * @param {object} data data containing exchange rate request details
             * @returns {Promise}  Returns the promise object
             */
            getExchangeRate: function(data) {
                return baseService.fetch({
                    url: "forex/rates?branchCode={branchCode}&ccy1Code={ccy1}&ccy2Code={ccy2}"
                }, {
                    branchCode: data.branchCode,
                    ccy1: data.ccy1Code,
                    ccy2: data.ccy2Code
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
             * fetches timer flag
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchTimerDetails: function() {
                return baseService.fetch({
                    url: "maintenances/forex"
                });
            }
        };
    };
    return new reviewForexDealModel();
});
