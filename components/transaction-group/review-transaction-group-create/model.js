/**


 */
define([
  "jquery",
  "baseService"
], function($, BaseService) {
  "use strict";
  var baseService = BaseService.getInstance();
  return {
    /**
     * fetchTransactionList - fetches the Task Group list
     * @returns {Promise}  Returns the promise object
     */
     fetchTransactionList: function() {
       var options = {
         url: "resourceTasks?aspects=limit&view=list"
       };
       return baseService.fetch(options);
     }
  };
});
