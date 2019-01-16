/**
 * Model for add-edit-nominee
 * @param {object} BaseService
 * @return {object} nomineeDetailsModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    var nomineeDetailsModel = function() {
        /**
         * In case more than one instance of nomineeDetailsModel is required,
         * we are declaring model as a function, of which new instances can be created and
         * used when required.
         *
         * @class Model
         * @private
         */
        var Model = function() {
                this.addNomineeModel = {
                    accountId: {
                        displayValue: null,
                        value: null
                    },
                    accountType: null,
                    accountModule: null,
                    dateOfBirth: null,
                    name: null,
                    relation: null,
                    minor: false,
                    address: {
                        country: null,
                        state: null,
                        city: null,
                        zipCode: null,
                        line1: null,
                        line2: null
                    }
                };

                this.guardianDetails = {
                    name: null,
                    address: {
                        country: null,
                        state: null,
                        city: null,
                        zipCode: null,
                        line1: null,
                        line2: null
                    }
                };
            },
            baseService = BaseService.getInstance();

        return {
            /**
             * @returns {object}  Returns the modelData
             */
            getNewModel: function() {
                return new Model();
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
             * fetches nomineeRelations
             *
             * @returns {Promise}  Returns the promise object
             */
            getRelation: function() {
                return baseService.fetch({
                    url: "enumerations/nomineeRelations"
                });
            },
            /**
             * fetches country
             *
             * @returns {Promise}  Returns the promise object
             */
            getCountries: function() {
                return baseService.fetch({
                    url: "enumerations/country"
                });
            },
            /**
             * fetches nominee list
             *
             * @returns {Promise}  Returns the promise object
             */
            getNomineeList: function() {
                return baseService.fetch({
                    url: "nominee"
                });
            }
        };
    };
    return new nomineeDetailsModel();
});