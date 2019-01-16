/** Model for rd nominee list
 * @param {object} BaseService
 * @return {object} rdNomineeListModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    /**
     * In case more than one instance of rdNomineeListModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class rdNomineeListModel
     * @private
     */

    var rdNomineeListModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetches rd accounts
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchAccountList: function() {
                return baseService.fetch({
                    url: "accounts/deposit?module=RD"
                });
            }
        };
    };
    return new rdNomineeListModel();
});