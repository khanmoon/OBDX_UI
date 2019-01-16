/**
 * Model for create-rd
 * @param {object} jquery jquery instance
 * @param {object} BaseService base service instance for server communication
 * @return {object} recurringDepositModel  Model instance
 */
define([
    "jquery",
    "baseService"
], function($, BaseService) {
    "use strict";
    var recurringDepositModel = function() {
        /**
         * In case more than one instance of recurringDepositModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        var Model = function() {
                this.calculateModel = {
                     "productId": null,
                    "maturityAmount": {
                        "currency": null,
                        "amount": null
                    },
                    "inflationRate": null,
                    "tenure": {
                        "year": null,
                        "month": null,
                        "day": "0"
                    }
                };
                this.createRDModel = {
                    "maturityAmount": {
                        "currency": null,
                        "amount": null
                    },
                     "tenure": {
                        "days": "0",
                        "months": null,
                        "years": null
                    },
                    "productDTO": {
                        "productId": null,
                        "name": null,
                        "depositProductType" :null
                    },

                    "principalAmount": {
                        "currency": null,
                        "amount": null
                    }
                };
            },
            baseService = BaseService.getInstance();
        return {

            /**
             * Method to get new modal instance
             * @returns {object}  Returns the modelData
             */
            getNewModel: function() {
                return new Model();
            },

            /**
             * getProductList - fetches product list
             *
             * @returns {Promise}  Returns the promise object
             */
            getProductList: function() {
                return baseService.fetch({
                    url: "products/deposit?productType=RD"
                });
            },

            /**
             * calculateInstallmentAmount - calculate Installmentamount and date.
             * @param {object} createRDData  payload to be passed to calculate maturity amount and date for RD
             * @returns {Promise}  Returns the promise object
             */
            calculateInstallmentAmount: function(createRDData) {
                return baseService.add({
                    url: "calculators/deposit/installments",
                    data: createRDData
                });
            }
        };
    };
    return new recurringDepositModel();
});