define([
  "jquery",
  "baseService",
  "baseLogger"
], function($, BaseService) {
  "use strict";

  /**
   * var UserListDetailsModel - description
   *
   * @return {type}  description
   */
  var UserListDetailsModel = function() {
    /**
     * baseService instance through which all the rest calls will be made.
     *
     * @attribute baseService
     * @type {Object} BaseService Instance
     * @private
     */
    var baseService = BaseService.getInstance(),


    /**
     * readUserDeferred - description
     *
     * @param  {string} id       description
     * @param  {object} deferred description
     * @return {type}          description
     */
    readUserDeferred, readUser = function(id, deferred) {
      var params = {
          "userId": id
        },
        options = {
          url: "users/" + id,
          success: function(data) {
            deferred.resolve(data);
          },
          error: function(data) {
            deferred.reject(data);
          }
        };
      baseService.fetch(options, params);
    };
    return {
      readUser: function(Parameters) {
        readUserDeferred = $.Deferred();
        readUser(Parameters, readUserDeferred);
        return readUserDeferred;
      }
    };

  };
  return new UserListDetailsModel();
});