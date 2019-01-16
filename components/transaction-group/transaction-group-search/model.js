/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var TransactionGroupSearchModel = function() {
    var baseService = BaseService.getInstance();
    return {
      /**
       * searchTransactionGroup - fetches the Transaction groups
       * @param  {String} taskAspect for Transaction group
       * @param  {String} transactionGroupCode Code for Transaction group
       * @param  {String} transactionGroupDesc Description for Transaction group
       * @returns {Promise}  Returns the promise object
       */
      searchTransactionGroup: function(taskAspect, transactionGroupCode, transactionGroupDesc) {
        var params = {
            "name": transactionGroupCode,
            "description": transactionGroupDesc,
            "taskAspect": taskAspect
          },
          options = {
            url: "taskGroups?name={name}&description={description}&taskAspect={taskAspect}"
          };
        return baseService.fetch(options, params);
      }
    };
  };
  return new TransactionGroupSearchModel();
});
