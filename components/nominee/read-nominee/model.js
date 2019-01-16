/** Model for read nominee
 * @param {object} BaseService
 * @return {object} readNomineeModel
 */
 define(["baseService", "jquery"], function(BaseService, $) {
    "use strict";
    /**
     * In case more than one instance of readNomineeModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class readNomineeModel
     * @private
     */
    var readNomineeModel = function() {
        var baseService = BaseService.getInstance(),

            /**
             * removes nomineeDTO
             * @param1 {object} selectedAccountId  An object containing the vaue of account id
             * @param2 {object} deferred  An object containing the instance of jquery
             * @returns {Promise}  Returns the promise object
             */
            deleteNomineeDeferred, deleteNominee = function(selectedAccountId, deferred) {
                var options = {
                        url: "nominee/{accountId}",
                        success: function(data, status, jqXHR) {
                            deferred.resolve(data, status, jqXHR);
                        }
                    },
                    params = {
                        accountId: selectedAccountId
                    };
                baseService.remove(options, params);
            };
        return {
            /**
             * fetches nomineeDTO
             * @param {object} selectedAccountId  An object containing the vaue of account id
             * @returns {Promise}  Returns the promise object
             */
            readNominee: function(selectedAccountId) {
                return baseService.fetch({
                    url: "nominee/{accountId}"
                }, {
                    accountId: selectedAccountId
                });
            },
            /**
             * removes nomineeDTO
             * @param {object} selectedAccountId  An object containing the vaue of account id
             * @returns {Promise}  Returns the promise object
             */
            deleteNominee: function(selectedAccountId) {
                deleteNomineeDeferred = $.Deferred();
                deleteNominee(selectedAccountId, deleteNomineeDeferred);
                return deleteNomineeDeferred;
            },
            /**
             * fetches nomineeRelation
             *
             * @returns {Promise}  Returns the promise object
             */
            getRelation: function() {
                return baseService.fetch({
                    url: "enumerations/nomineeRelations"
                });
            },
            /**
             * fetches Country
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
    return new readNomineeModel();
});
