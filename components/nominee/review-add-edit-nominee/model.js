/** Model for review add edit nominee
 * @param {object} BaseService
 * @return {object} reviewNomineeModel
 */
 define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";
    /**
     * In case more than one instance of reviewNomineeModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class reviewNomineeModel
     * @private
     */
    var reviewNomineeModel = function() {
        var baseService = BaseService.getInstance(),
            /**
             * add nominee
             * @param1 {string} payload  An string containg the data to be sent to host
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            confirmAddNomineeDeferred, confirmAddNominee = function(payload, deferred) {
                var options = {
                    url: "nominee",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.add(options);
            },
            /**
             * update nomineeDetails
             * @param1 {string} payload  An string containg the data to be sent to host
             * @param2 {string} deferred  An string containg the data to be recieved from host
             * @returns {Promise}  Returns the promise object
             */
            confirmEditNomineeDeferred, confirmEditNominee = function(payload, deferred) {
                var options = {
                    url: "nominee",
                    data: payload,
                    success: function(data, status, jqXHR) {
                        deferred.resolve(data, status, jqXHR);
                    }
                };
                baseService.update(options);
            };

        return {
            confirmAddNominee: function(payload) {
                confirmAddNomineeDeferred = $.Deferred();
                confirmAddNominee(payload, confirmAddNomineeDeferred);
                return confirmAddNomineeDeferred;
            },
            confirmEditNominee: function(payload) {
                confirmEditNomineeDeferred = $.Deferred();
                confirmEditNominee(payload, confirmEditNomineeDeferred);
                return confirmEditNomineeDeferred;
            },
            /**
             * fetch nomineeRelation
             *
             * @returns {Promise}  Returns the promise object
             */
            getRelation: function() {
                return baseService.fetch({
                    url: "enumerations/nomineeRelations"
                });
            },
            /**
             * fetch country
             *
             * @returns {Promise}  Returns the promise object
             */
            getCountry: function() {
                return baseService.fetch({
                    url: "enumerations/country"
                });
            }
        };
    };
    return new reviewNomineeModel();
});
