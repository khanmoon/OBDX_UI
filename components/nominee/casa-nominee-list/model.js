/** Model for casa nominee list
 * @param {object} BaseService
 * @return {object} casaNomineeListModel
 */
define([
    "baseService"
], function(BaseService) {
    "use strict";
    /**
     * In case more than one instance of casaNomineeListModel is required,
     * we are declaring model as a function, of which new instances can be created and
     * used when required.
     *
     * @class casaNomineeListModel
     * @private
     */

    var casaNomineeListModel = function() {
        var baseService = BaseService.getInstance();
        return {
            /**
             * fetches CASA accounts
             *
             * @returns {Promise}  Returns the promise object
             */
            fetchAccountList: function() {
                return baseService.fetch({
                    url: "accounts/demandDeposit"
                });
            }
        };
    };
    return new casaNomineeListModel();
});