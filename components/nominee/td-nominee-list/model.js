/** Model for td nominee list
 * @param {object} BaseService
 * @return {object} tdNomineeListModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";

    /**
     * In case more than one instance of tdNomineeListModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class tdNomineeListModel
     * @private
     */

    var tdNomineeListModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetches Term Deposit accounts
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchAccountList: function() {
                return baseService.fetch({
                    url: "accounts/deposit?module=CON"
                });
            }
        };
    };
    return new tdNomineeListModel();
});