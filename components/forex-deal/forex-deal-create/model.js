/**
 * Model for forex-deal-create
 *
 * @param {object} BaseService instance
 * @return {object} forexDealModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    var forexDealModel = function() {
        /**
         * In case more than one instance of forexDealModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        var Model = function() {
                this.createForexDealModel = {
                    forexDealDTO: {
                        rateType: null,
                        buyAmount: {
                            amount: null,
                            currency: null
                        },
                        rate: null,
                        sellAmount: {
                            amount: null,
                            currency: null
                        },
                        forwardPeriod: null,
                        bookingDate: null,
                        valueDate: null,
                        dealType: null,
                        exchangeRateCurrency: null
                    }
                };
            },
            baseService = BaseService.getInstance();

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
             * fetches currencyPairs
             *
             * @returns {Promise}  Returns the promise object
             */
            getCurrencyPairs: function() {
                return baseService.fetch({
                    url: "forexDeals/configurations"
                });
            },

            /**
             * fetches currentDate
             *
             * @returns {Promise}  Returns the promise object
             */
            getHostDate: function() {
                return baseService.fetch({
                    url: "payments/currentDate"
                });
            },

            /**
             * fetches currentDate
             *
             * @returns {Promise}  Returns the promise object
             */
            listAccessPoint: function() {
                return baseService.fetch({
                    url: "accessPoints"
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
             * fetches forwardDealPeriod
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchFrequencyList: function() {
                return baseService.fetch({
                    url: "enumerations/forwardDealPeriod"
                });
            },

            /**
             * fetches bankConfiguration
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchBankConfig: function() {
                return baseService.fetch({
                    url: "bankConfiguration"
                });
            },
            /**
             * fetches party details to which it is logged in.
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchForexDealCreationFlag: function() {
                return baseService.fetch({
                    url: "me/partyPreferences"
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
             * fetches the party details
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchPartyDetails: function() {
                return baseService.fetch({
                    url: "me/party"
                });
            }
        };
    };
    return new forexDealModel();
});