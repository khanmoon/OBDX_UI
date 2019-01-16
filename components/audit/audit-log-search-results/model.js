define([
"jquery",
   "baseService"
  ], function($, BaseService) {
  "use strict";
  var AuditLogSearchResultsModel = function() {
     var baseService = BaseService.getInstance();
    /**
     * Function to get new instance of AuditLogSearchResultsModel
     *
     * @function
     * @memberOf AuditLogSearchResultsModel
     * @returns Model
     */
    var searchAuditItemDeferred;
     /**
             * Method to get the response of perticular audit based on Id.
             * @function searchAuditItem
             * @param {String} ID of perticular audit
             * @param {object} deferred - resolved for successful request
             * @memberOf AuditLogSearchResultsModel
             * @private
             */
    var searchAuditItem = function(deferred,id) {
      var options = {
        url: "audit/" + id,
        success: function(data) {
          deferred.resolve(data);
        },
        error: function(data) {
          deferred.reject(data);
        }
      };
      baseService.fetch(options);
    };
return {
   /**
             * Public function to search Audit Details
             * @param {String} ID of perticular audit
             * @returns {Promise}  Returns the promise object
             */
searchAuditItem: function(id) {
searchAuditItemDeferred = $.Deferred();
searchAuditItem(searchAuditItemDeferred, id);
return searchAuditItemDeferred;
}
};
  };
return new AuditLogSearchResultsModel();
});